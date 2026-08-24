# System Design & Architecture Write-Up

## Executive Summary
The Healthcare Appointment & Follow-up Manager is an enterprise-grade healthcare orchestration platform designed to handle simultaneous patient bookings, doctor workflow automation, AI triage, post-visit summary synthesis, and resilient multi-channel notifications.

---

## 1. Double-Booking Prevention & Concurrency Control
Concurrent booking collisions are a primary failure vector in high-volume healthcare systems. To eliminate race conditions where two patients attempt to book the exact same slot concurrently:

### Implementation Architecture
- **Pessimistic Concurrency Locking via DB Transactions**: All appointment creations pass through PostgreSQL database transactions (`prisma.$transaction`).
- **Atomic Verification**: Inside the atomic block:
  1. The transaction queries existing `Appointment` records matching `doctorId`, `date`, and `startTime` with status `CONFIRMED` or `HOLD`.
  2. It queries active `SlotHold` records where `expiresAt > NOW()` for other patient accounts.
  3. If a matching record exists, the transaction fails immediately and returns `HTTP 409 Conflict`.
  4. If clear, the appointment is written and any temporary hold owned by the booking user is released.
- **Result**: Guarantees strict linearizability without relying on uncoordinated application memory locks across serverless lambda instances.

---

## 2. Doctor Leave Conflict Management & Cascading Resolution
When an Admin registers a doctor's leave for a date range (`POST /api/admin/doctors/[id]/leave`), the system triggers a cascading resolution workflow:

### Automated Cascading Workflow
1. **Affected Scope Resolution**: Queries all `CONFIRMED` or `RESCHEDULED` appointments for the doctor falling between `[startDate, endDate]`.
2. **Atomic Status Mutation**: Executes a batch update setting all affected appointments to `CANCELLED`.
3. **Notification Dispatch**: Dispatches `sendLeaveNotification` emails to every impacted patient explaining the doctor's leave.
4. **Google Calendar Cleanup**: Deletes synchronized Google Calendar events via `deleteCalendarEvent(googleEventId)`.
5. **Audit Logging**: Inserts audit trail records into `AuditLog` capturing actor ID, cancellation count, and affected appointment IDs.

---

## 3. Slot Hold Reservation Mechanism
To prevent slot sniping while patients complete symptom intake forms, the application implements a temporary reservation layer:

### Architecture & Lifecycle
- **Reservation Trigger**: Clicking a slot triggers `POST /api/appointments/hold`, generating a `SlotHold` entry with an explicit expiration (`NOW() + 5 minutes`).
- **Exclusivity Enforcement**: Other patients attempting to select or hold the same slot are blocked with an HTTP 409 response.
- **Automatic Garbage Collection**: An automated background worker (`GET /api/cron/cleanup-holds`) runs every 60 seconds via Upstash QStash / Vercel Cron to delete expired holds where `expiresAt < NOW()`.

---

## 4. Notification Reliability & Failure Recovery
Notifications in healthcare require high delivery guarantees across transient network and provider outages.

### Multi-Provider Delivery Pipeline
Email delivery evaluates a prioritized provider waterfall in `lib/email.ts`:
1. **Tier 1 (Gmail SMTP / Direct SMTP)**: Transmits via `nodemailer` if `GMAIL_USER` and `GMAIL_APP_PASSWORD` are defined.
2. **Tier 2 (SendGrid Web API)**: Transmits via `@sendgrid/mail` if `SENDGRID_API_KEY` is present.
3. **Tier 3 (Resend API)**: Transmits via `resend` as an API fallback.

### Asynchronous Retry Engine
- **Audit Tracking**: Every notification attempt logs to `NotificationLog` with status (`PENDING`, `SENT`, `FAILED`), payload, and attempt counter.
- **Exponential Backoff**: Failed attempts trigger a retry delay schedule (`[5m, 15m, 30m]`).
- **Cron Worker**: The `GET /api/cron/email-retry` worker polls failed entries where `attempts < 3` and `nextRetryAt <= NOW()`, attempting re-delivery until exhausted.

---

## 5. LLM Synthesis & Graceful Degradation
- **Pre-Visit Triage**: Analyzes chief complaints via Gemini 2.5 Flash, generating urgency ratings (`LOW`, `MEDIUM`, `HIGH`) and doctor questions stored in `SymptomSummary`.
- **Post-Visit Summary**: Translates clinical notes into patient-friendly summaries stored in `VisitNote`.
- **Fault Tolerance**: LLM invocations execute asynchronously with try/catch fallbacks. Failures update the summary status to `FAILED` without blocking the primary booking or clinical note creation workflows.
