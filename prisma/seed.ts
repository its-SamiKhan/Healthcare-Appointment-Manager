import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

const DEFAULT_WORKING_HOURS = {
  monday: { start: '09:00', end: '17:00', available: true },
  tuesday: { start: '09:00', end: '17:00', available: true },
  wednesday: { start: '09:00', end: '17:00', available: true },
  thursday: { start: '09:00', end: '17:00', available: true },
  friday: { start: '09:00', end: '17:00', available: true },
  saturday: { start: '09:00', end: '13:00', available: false },
  sunday: { start: '09:00', end: '13:00', available: false },
}

async function seed() {
  console.log('🌱 Starting comprehensive database seeding...')

  const passwordHash = await hashPassword('Password123!')

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@healthcare.com',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log('✅ Created Admin:', adminUser.email)

  // 2. Create Doctors (8 doctors across specializations)
  const doctorsData = [
    {
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.jenkins@healthcare.com',
      specialization: 'Cardiology',
      bio: 'Board-certified cardiologist with 12+ years of experience in preventative heart health and arrhythmia treatment.',
      phone: '+1-555-0192',
      slotDuration: 30,
    },
    {
      name: 'Dr. Marcus Vance',
      email: 'marcus.vance@healthcare.com',
      specialization: 'Dermatology',
      bio: 'Specialist in clinical dermatology, skin cancer screening, and acne management.',
      phone: '+1-555-0144',
      slotDuration: 30,
    },
    {
      name: 'Dr. Elena Rostova',
      email: 'elena.rostova@healthcare.com',
      specialization: 'General Physician',
      bio: 'Primary care specialist focusing on holistic wellness, chronic disease management, and family medicine.',
      phone: '+1-555-0177',
      slotDuration: 20,
    },
    {
      name: 'Dr. Rajesh Patel',
      email: 'rajesh.patel@healthcare.com',
      specialization: 'Orthopedics',
      bio: 'Orthopedic surgeon specializing in sports injuries, joint replacements, and spine wellness.',
      phone: '+1-555-0188',
      slotDuration: 30,
    },
    {
      name: 'Dr. Amanda Chen',
      email: 'amanda.chen@healthcare.com',
      specialization: 'Neurology',
      bio: 'Expert neurologist specialized in migraine management, neuropathy, and brain health.',
      phone: '+1-555-0155',
      slotDuration: 45,
    },
    {
      name: 'Dr. David Miller',
      email: 'david.miller@healthcare.com',
      specialization: 'Pediatrics',
      bio: 'Compassionate pediatrician focusing on child growth, developmental milestones, and vaccinations.',
      phone: '+1-555-0166',
      slotDuration: 30,
    },
    {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@healthcare.com',
      specialization: 'Gynecology',
      bio: 'Specialist in women’s health, prenatal care, and reproductive medicine.',
      phone: '+1-555-0133',
      slotDuration: 30,
    },
    {
      name: 'Dr. James Wilson',
      email: 'james.wilson@healthcare.com',
      specialization: 'ENT',
      bio: 'Ear, Nose & Throat surgeon specializing in sinus treatment, hearing care, and allergy therapy.',
      phone: '+1-555-0122',
      slotDuration: 20,
    },
  ]

  const createdDoctors: Array<{ id: string; name: string; specialization: string; userId: string }> = []

  for (const docData of doctorsData) {
    const user = await prisma.user.upsert({
      where: { email: docData.email },
      update: {},
      create: {
        name: docData.name,
        email: docData.email,
        passwordHash,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialization: docData.specialization,
            bio: docData.bio,
            phone: docData.phone,
            slotDuration: docData.slotDuration,
            workingHours: DEFAULT_WORKING_HOURS,
          },
        },
      },
      include: { doctor: true },
    })
    if (user.doctor) {
      createdDoctors.push({
        id: user.doctor.id,
        name: user.name,
        specialization: user.doctor.specialization,
        userId: user.id,
      })
    }
  }
  console.log(`✅ Created ${createdDoctors.length} Doctors`)

  // 3. Create Patients (6 Patients)
  const patientsData = [
    { name: 'John Doe', email: 'patient@example.com', bloodGroup: 'O+', phone: '+1-555-0199' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', bloodGroup: 'A+', phone: '+1-555-0211' },
    { name: 'Robert Taylor', email: 'robert.taylor@example.com', bloodGroup: 'B+', phone: '+1-555-0222' },
    { name: 'Emily Watson', email: 'emily.watson@example.com', bloodGroup: 'AB+', phone: '+1-555-0233' },
    { name: 'Michael Brown', email: 'michael.brown@example.com', bloodGroup: 'O-', phone: '+1-555-0244' },
    { name: 'Sophia Martinez', email: 'sophia.martinez@example.com', bloodGroup: 'A-', phone: '+1-555-0255' },
  ]

  const createdPatients: Array<{ id: string; name: string; email: string; userId: string }> = []

  for (const patData of patientsData) {
    const user = await prisma.user.upsert({
      where: { email: patData.email },
      update: {},
      create: {
        name: patData.name,
        email: patData.email,
        passwordHash,
        role: 'PATIENT',
        patient: {
          create: {
            bloodGroup: patData.bloodGroup,
            phone: patData.phone,
          },
        },
      },
      include: { patient: true },
    })
    if (user.patient) {
      createdPatients.push({
        id: user.patient.id,
        name: user.name,
        email: user.email,
        userId: user.id,
      })
    }
  }
  console.log(`✅ Created ${createdPatients.length} Patients`)

  // 4. Create Doctor Leave Records
  const doctor1 = createdDoctors[0] // Dr. Sarah Jenkins
  if (doctor1) {
    const leaveStartDate = new Date()
    leaveStartDate.setDate(leaveStartDate.getDate() + 10)
    const leaveEndDate = new Date(leaveStartDate)
    leaveEndDate.setDate(leaveEndDate.getDate() + 3)

    await prisma.doctorLeave.create({
      data: {
        doctorId: doctor1.id,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: 'Attending Cardiology Conference in Chicago',
      },
    })
    console.log('✅ Created Doctor Leave record')
  }

  // 5. Create Today's, Past, and Future Appointments with Symptoms, AI Summaries, Visit Notes & Prescriptions
  const todayStr = new Date().toISOString().split('T')[0]
  const todayDate = new Date(`${todayStr}T00:00:00.000Z`)

  const pastDate1 = new Date()
  pastDate1.setDate(pastDate1.getDate() - 5)

  const pastDate2 = new Date()
  pastDate2.setDate(pastDate2.getDate() - 12)

  const futureDate1 = new Date()
  futureDate1.setDate(futureDate1.getDate() + 2)

  const futureDate2 = new Date()
  futureDate2.setDate(futureDate2.getDate() + 5)

  // Appointments configuration
  const appointmentsToSeed = [
    // Today's urgent appointment (Cardiology)
    {
      doctorId: createdDoctors[0].id,
      patientId: createdPatients[0].id,
      date: todayDate,
      startTime: '09:30',
      endTime: '10:00',
      status: 'CONFIRMED' as const,
      notes: 'Patient reported sudden chest tightness after light exercise.',
      symptoms: {
        chiefComplaint: 'Chest tightness, mild shortness of breath, and palpitations',
        duration: '2 hours',
        severity: 8,
        previousConditions: 'Hypertension',
        currentMedicines: 'Amlodipine 5mg',
        summary: {
          urgency: 'HIGH',
          chiefComplaint: 'Acute chest tightness with palpitations',
          doctorQuestions: [
            'Does the tightness radiate to your left arm or jaw?',
            'Did you experience dizziness or nausea?',
            'When did you last take your blood pressure medication?',
          ],
        },
      },
    },
    // Today's medium urgency appointment (General Physician)
    {
      doctorId: createdDoctors[2].id,
      patientId: createdPatients[1].id,
      date: todayDate,
      startTime: '10:00',
      endTime: '10:20',
      status: 'CONFIRMED' as const,
      notes: 'Persistent fever and sore throat.',
      symptoms: {
        chiefComplaint: 'High fever (101°F), sore throat, body aches for 3 days',
        duration: '3 days',
        severity: 6,
        previousConditions: 'None',
        currentMedicines: 'Paracetamol 500mg as needed',
        summary: {
          urgency: 'MEDIUM',
          chiefComplaint: 'Acute febrile illness with pharyngitis symptoms',
          doctorQuestions: [
            'Have you had difficulty swallowing fluids?',
            'Are any lymph nodes tender in your neck?',
          ],
        },
      },
    },
    // Today's low urgency appointment (Dermatology)
    {
      doctorId: createdDoctors[1].id,
      patientId: createdPatients[2].id,
      date: todayDate,
      startTime: '11:00',
      endTime: '11:30',
      status: 'CONFIRMED' as const,
      notes: 'Routine skin lesion check.',
      symptoms: {
        chiefComplaint: 'Dry itchy patch on left elbow and forearm',
        duration: '2 weeks',
        severity: 3,
        previousConditions: 'Eczema history',
        currentMedicines: 'Moisturizing cream',
        summary: {
          urgency: 'LOW',
          chiefComplaint: 'Localized dry pruritic rash on left forearm',
          doctorQuestions: [
            'Have you started using any new soap or detergent?',
            'Does the itching flare up at night?',
          ],
        },
      },
    },
    // Today's completed appointment (Orthopedics)
    {
      doctorId: createdDoctors[3].id,
      patientId: createdPatients[3].id,
      date: todayDate,
      startTime: '09:00',
      endTime: '09:30',
      status: 'COMPLETED' as const,
      notes: 'Right knee pain during running.',
      visitNote: {
        clinicalNotes: 'Physical exam shows mild lateral knee tenderness. Range of motion intact. No ligamentous instability.',
        diagnosis: 'Patellofemoral Pain Syndrome (Runner’s Knee)',
        followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        patientSummary: 'You have mild strain in your knee tendon from running. Rest, ice after workouts, and do quad strengthening exercises.',
        prescriptions: [
          { drugName: 'Ibuprofen', dosage: '400mg', frequency: '2x daily after meals', durationDays: 5 },
          { drugName: 'Topical Pain Relief Gel', dosage: 'Apply thin layer', frequency: '3x daily', durationDays: 7 },
        ],
      },
    },
    // Past completed appointment 1 (Cardiology)
    {
      doctorId: createdDoctors[0].id,
      patientId: createdPatients[0].id,
      date: pastDate1,
      startTime: '14:00',
      endTime: '14:30',
      status: 'COMPLETED' as const,
      notes: 'Routine annual cardiac review.',
      visitNote: {
        clinicalNotes: 'BP 125/82. ECG demonstrates normal sinus rhythm. Cholesterol levels mild elevation.',
        diagnosis: 'Mild Essential Hypertension - Well Controlled',
        followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        patientSummary: 'Your heart review looks great! Keep up with your low-salt diet and morning walks.',
        prescriptions: [
          { drugName: 'Atorvastatin', dosage: '10mg', frequency: '1x daily at night', durationDays: 30 },
        ],
      },
    },
    // Past completed appointment 2 (General Physician)
    {
      doctorId: createdDoctors[2].id,
      patientId: createdPatients[4].id,
      date: pastDate2,
      startTime: '11:00',
      endTime: '11:20',
      status: 'COMPLETED' as const,
      notes: 'Follow-up for seasonal allergies.',
      visitNote: {
        clinicalNotes: 'Nasal mucosa clear. Lung fields clear bilaterally.',
        diagnosis: 'Allergic Rhinitis',
        followUpDate: null,
        patientSummary: 'Allergy symptoms resolved. Use antihistamines as needed during spring season.',
        prescriptions: [
          { drugName: 'Cetirizine', dosage: '10mg', frequency: '1x daily', durationDays: 10 },
        ],
      },
    },
    // Future appointment 1 (Neurology)
    {
      doctorId: createdDoctors[4].id,
      patientId: createdPatients[5].id,
      date: futureDate1,
      startTime: '10:00',
      endTime: '10:45',
      status: 'CONFIRMED' as const,
      notes: 'Frequent migraine consultation.',
      symptoms: {
        chiefComplaint: 'Throbbing headaches on right side, sensitive to light',
        duration: '4 weeks',
        severity: 7,
        previousConditions: 'None',
        currentMedicines: 'Over-the-counter pain relievers',
        summary: {
          urgency: 'MEDIUM',
          chiefComplaint: 'Recurrent unilateral headache with photophobia',
          doctorQuestions: [
            'How many days per week do you experience these headaches?',
            'Is there any aura or visual blurriness before onset?',
          ],
        },
      },
    },
    // Future appointment 2 (Pediatrics)
    {
      doctorId: createdDoctors[5].id,
      patientId: createdPatients[1].id,
      date: futureDate2,
      startTime: '15:30',
      endTime: '16:00',
      status: 'CONFIRMED' as const,
      notes: 'Child wellness checkup.',
    },
  ]

  for (const aptData of appointmentsToSeed) {
    const apt = await prisma.appointment.create({
      data: {
        doctorId: aptData.doctorId,
        patientId: aptData.patientId,
        date: aptData.date,
        startTime: aptData.startTime,
        endTime: aptData.endTime,
        status: aptData.status,
        notes: aptData.notes,
      },
    })

    // Seed symptoms & AI summary if defined
    if (aptData.symptoms) {
      const sym = await prisma.symptom.create({
        data: {
          appointmentId: apt.id,
          chiefComplaint: aptData.symptoms.chiefComplaint,
          duration: aptData.symptoms.duration,
          severity: aptData.symptoms.severity,
          previousConditions: aptData.symptoms.previousConditions,
          currentMedicines: aptData.symptoms.currentMedicines,
        },
      })

      if (aptData.symptoms.summary) {
        await prisma.symptomSummary.create({
          data: {
            symptomId: sym.id,
            urgency: aptData.symptoms.summary.urgency,
            chiefComplaint: aptData.symptoms.summary.chiefComplaint,
            doctorQuestions: aptData.symptoms.summary.doctorQuestions,
            status: 'COMPLETED',
          },
        })
      }
    }

    // Seed visit note & prescriptions if defined
    if (aptData.visitNote) {
      const vn = await prisma.visitNote.create({
        data: {
          appointmentId: apt.id,
          clinicalNotes: aptData.visitNote.clinicalNotes,
          diagnosis: aptData.visitNote.diagnosis,
          followUpDate: aptData.visitNote.followUpDate,
          patientSummary: aptData.visitNote.patientSummary,
        },
      })

      for (const rx of aptData.visitNote.prescriptions) {
        const pres = await prisma.prescription.create({
          data: {
            visitNoteId: vn.id,
            drugName: rx.drugName,
            dosage: rx.dosage,
            frequency: rx.frequency,
            durationDays: rx.durationDays,
          },
        })

        // Generate sample medication reminders
        const now = new Date()
        for (let d = 0; d < 3; d++) {
          const remTime = new Date(now)
          remTime.setDate(remTime.getDate() + d)
          remTime.setHours(9, 0, 0, 0)

          await prisma.medicationReminder.create({
            data: {
              prescriptionId: pres.id,
              patientId: aptData.patientId,
              scheduledAt: remTime,
              status: d === 0 ? 'SENT' : 'PENDING',
              sentAt: d === 0 ? new Date() : null,
            },
          })
        }
      }
    }

    // Seed notification log for each appointment
    const patUser = createdPatients.find((p) => p.id === aptData.patientId)
    if (patUser) {
      await prisma.notificationLog.create({
        data: {
          recipient: patUser.email,
          type: 'BOOKING_CONFIRMATION',
          status: 'SENT',
          attempts: 1,
          payload: { appointmentId: apt.id, date: apt.date, startTime: apt.startTime },
        },
      })
    }
  }
  console.log('✅ Created Appointments, Symptoms, AI Summaries, Visit Notes & Prescriptions')

  // 6. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { action: 'CREATE_DOCTOR', entityType: 'Doctor', entityId: createdDoctors[0].id, metadata: { name: createdDoctors[0].name } },
      { action: 'BOOK_APPOINTMENT', entityType: 'Appointment', entityId: 'seed-apt-1', metadata: { doctorId: createdDoctors[0].id } },
      { action: 'CREATE_DOCTOR_LEAVE', entityType: 'DoctorLeave', entityId: 'seed-leave-1', metadata: { doctorId: createdDoctors[0].id, reason: 'Conference' } },
    ],
  })
  console.log('✅ Created Audit Logs')

  console.log('\n🎉 Comprehensive database seeding complete!')
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
