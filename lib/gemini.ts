import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface PreVisitSummary {
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  chiefComplaint: string
  doctorQuestions: string[]
}

export interface PostVisitSummary {
  patientSummary: string
}

/**
 * Generates a pre-visit AI summary from patient symptoms.
 * Returns urgency level, chief complaint, and questions for the doctor.
 */
export async function generatePreVisitSummary(symptoms: {
  chiefComplaint: string
  duration: string
  severity: number
  previousConditions?: string | null
  currentMedicines?: string | null
}): Promise<PreVisitSummary> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `You are a medical AI assistant helping doctors prepare for patient visits.

Analyze these patient symptoms and return a structured JSON response:

Patient Symptoms:
- Chief Complaint: ${symptoms.chiefComplaint}
- Duration: ${symptoms.duration}
- Severity (1-10): ${symptoms.severity}
- Previous Conditions: ${symptoms.previousConditions || 'None reported'}
- Current Medicines: ${symptoms.currentMedicines || 'None reported'}

Return ONLY a valid JSON object with this exact structure:
{
  "urgency": "LOW" | "MEDIUM" | "HIGH",
  "chiefComplaint": "concise one-line summary of main complaint",
  "doctorQuestions": ["question 1", "question 2", "question 3"]
}

Urgency criteria:
- HIGH: Severe symptoms (7-10), chest pain, difficulty breathing, neurological symptoms
- MEDIUM: Moderate symptoms (4-6), persistent pain, fever, infection signs
- LOW: Mild symptoms (1-3), routine checkup, minor issues`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Invalid AI response format')
  }

  const parsed = JSON.parse(jsonMatch[0]) as PreVisitSummary
  if (!parsed.urgency || !parsed.chiefComplaint || !parsed.doctorQuestions) {
    throw new Error('Incomplete AI response')
  }

  return parsed
}

/**
 * Converts clinical notes into patient-friendly language.
 */
export async function generatePostVisitSummary(notes: {
  clinicalNotes: string
  diagnosis: string
  prescriptions: Array<{
    drugName: string
    dosage: string
    frequency: string
    durationDays: number
  }>
  followUpDate?: Date | null
}): Promise<PostVisitSummary> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prescriptionText = notes.prescriptions
    .map(
      (p) =>
        `- ${p.drugName} ${p.dosage}, ${p.frequency} for ${p.durationDays} days`
    )
    .join('\n')

  const prompt = `You are a medical AI helping patients understand their visit summary.

Convert these clinical notes into simple, friendly, easy-to-understand language for a patient:

Diagnosis: ${notes.diagnosis}

Clinical Notes: ${notes.clinicalNotes}

Prescriptions:
${prescriptionText || 'None prescribed'}

Follow-up Date: ${notes.followUpDate ? new Date(notes.followUpDate).toLocaleDateString() : 'No follow-up scheduled'}

Write a warm, clear patient summary that:
1. Explains the diagnosis in simple terms
2. Lists medications and WHEN to take them clearly
3. Mentions any important follow-up steps
4. Uses encouraging, non-scary language
5. Is 150-250 words maximum

Return ONLY the patient summary text, no JSON, no formatting markers.`

  const result = await model.generateContent(prompt)
  return { patientSummary: result.response.text().trim() }
}
