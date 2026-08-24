import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

// ─── Indian Seed Datasets ───────────────────────────────────────────────────

const FIRST_NAMES_MALE = [
  'Rajesh', 'Vikram', 'Amit', 'Suresh', 'Arjun', 'Rohit', 'Rahul', 'Vikas',
  'Deepak', 'Sanjay', 'Alok', 'Nitin', 'Sunil', 'Karan', 'Manish', 'Anil',
  'Praveen', 'Gaurav', 'Rishi', 'Abhishek', 'Vivek', 'Siddharth', 'Varun',
  'Tushar', 'Aditya', 'Rohan', 'Kunal', 'Ashish', 'Devendra', 'Sachin',
]

const FIRST_NAMES_FEMALE = [
  'Ananya', 'Priya', 'Elena', 'Neha', 'Kavita', 'Sneha', 'Anjali', 'Pooja',
  'Sunita', 'Swati', 'Meera', 'Ritu', 'Divya', 'Shweta', 'Nisha', 'Preeti',
  'Simran', 'Tanvi', 'Richa', 'Shruti', 'Archana', 'Aakanksha', 'Bhavna',
  'Deepika', 'Krutika', 'Pallavi', 'Rashmi', 'Sangeeta', 'Vidya', 'Yashasvi',
]

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Mehta', 'Rao', 'Malhotra', 'Agarwal', 'Kumar',
  'Iyer', 'Reddy', 'Deshmukh', 'Joshi', 'Gupta', 'Singh', 'Chowdhury', 'Shah',
  'Nair', 'Bhat', 'Kulkarni', 'Jain', 'Saxena', 'Kapoor', 'Trivedi', 'Pandey',
  'Mishra', 'Sen', 'Banerjee', 'Rathore', 'Shetty', 'Venkatesh',
]

const SPECIALIZATIONS = [
  { name: 'General Physician', degree: 'MBBS, MD - General Medicine', fee: 500 },
  { name: 'Cardiology', degree: 'MBBS, MD, DM - Cardiology', fee: 800 },
  { name: 'Dermatology', degree: 'MBBS, MD - Dermatology', fee: 600 },
  { name: 'Orthopedics', degree: 'MBBS, MS - Orthopedics', fee: 700 },
  { name: 'Pediatrics', degree: 'MBBS, MD - Pediatrics', fee: 500 },
  { name: 'Neurology', degree: 'MBBS, DM - Neurology', fee: 900 },
  { name: 'ENT', degree: 'MBBS, MS - ENT', fee: 550 },
  { name: 'Gynecology', degree: 'MBBS, MS - Obstetrics & Gynecology', fee: 650 },
  { name: 'Psychiatry', degree: 'MBBS, MD - Psychiatry', fee: 800 },
  { name: 'Oncology', degree: 'MBBS, DM - Medical Oncology', fee: 1000 },
  { name: 'Gastroenterology', degree: 'MBBS, DM - Gastroenterology', fee: 850 },
  { name: 'Ophthalmology', degree: 'MBBS, MS - Ophthalmology', fee: 500 },
  { name: 'Endocrinology', degree: 'MBBS, DM - Endocrinology', fee: 750 },
  { name: 'Pulmonology', degree: 'MBBS, DTCD, MD - Pulmonology', fee: 650 },
  { name: 'Nephrology', degree: 'MBBS, DM - Nephrology', fee: 900 },
]

const LANGUAGES_COMBOS = [
  'English, Hindi',
  'English, Hindi, Marathi',
  'English, Hindi, Gujarati',
  'English, Tamil, Telugu',
  'English, Hindi, Punjabi',
  'English, Bengali, Hindi',
  'English, Kannada, Hindi',
]

const DEFAULT_WORKING_HOURS = {
  monday: { start: '09:00', end: '17:00', available: true },
  tuesday: { start: '09:00', end: '17:00', available: true },
  wednesday: { start: '09:00', end: '17:00', available: true },
  thursday: { start: '09:00', end: '17:00', available: true },
  friday: { start: '09:00', end: '17:00', available: true },
  saturday: { start: '09:00', end: '13:00', available: true },
  sunday: { start: '09:00', end: '13:00', available: false },
}

const COMMON_SYMPTOMS = [
  { chief: 'Persistent high fever (102°F), severe headache, and joint pains', duration: '3 days', severity: 7, urgency: 'HIGH', dx: 'Dengue Fever / Viral Febrile Illness', rx: [{ drugName: 'Paracetamol', dosage: '650mg', frequency: '3x daily after meals', durationDays: 5 }] },
  { chief: 'Acidity, chest burning sensation after meals, and nausea', duration: '2 weeks', severity: 5, urgency: 'MEDIUM', dx: 'Gastroesophageal Reflux Disease (GERD)', rx: [{ drugName: 'Pantoprazole', dosage: '40mg', frequency: '1x daily before breakfast', durationDays: 14 }] },
  { chief: 'Throbbing right-sided headache with sensitivity to light and sound', duration: '1 day', severity: 8, urgency: 'HIGH', dx: 'Acute Migraine Episode', rx: [{ drugName: 'Naproxen', dosage: '500mg', frequency: '2x daily as needed', durationDays: 3 }] },
  { chief: 'Dry itchy skin patches on elbow and knees with redness', duration: '1 month', severity: 4, urgency: 'LOW', dx: 'Atopic Dermatitis (Eczema)', rx: [{ drugName: 'Desonide Cream 0.05%', dosage: 'Apply thin layer', frequency: '2x daily', durationDays: 10 }] },
  { chief: 'Frequent urination, excessive thirst, and feeling tired', duration: '3 weeks', severity: 6, urgency: 'MEDIUM', dx: 'Type 2 Diabetes Mellitus (Initial Evaluation)', rx: [{ drugName: 'Metformin', dosage: '500mg', frequency: '2x daily with meals', durationDays: 30 }] },
  { chief: 'Right knee joint pain during stairs climbing and walking', duration: '2 months', severity: 5, urgency: 'LOW', dx: 'Osteoarthritis Right Knee (Grade I)', rx: [{ drugName: 'Glucosamine Sulfate', dosage: '1500mg', frequency: '1x daily', durationDays: 30 }] },
  { chief: 'Nasal congestion, continuous sneezing, and watery eyes', duration: '5 days', severity: 3, urgency: 'LOW', dx: 'Acute Allergic Rhinitis', rx: [{ drugName: 'Levocetirizine', dosage: '5mg', frequency: '1x daily at bedtime', durationDays: 7 }] },
]

async function seed() {
  console.log('🚀 Starting Large Indian Healthcare Database Seeding (120+ Doctors, 50+ Patients)...')

  const passwordHash = await hashPassword('MediCare#Secure2026!')

  // 1. Admin Account
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
  console.log('✅ Admin Account Verified:', adminUser.email)

  // 2. Curated Mockup Doctors (Dr. Ananya Sharma & Dr. Rohit Verma)
  const mockupDoctors = [
    {
      name: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@healthcare.com',
      specialization: 'General Physician',
      bio: 'Dr. Ananya Sharma is a dedicated General Physician with over 8 years of experience in providing compassionate and comprehensive healthcare.',
      experienceYears: 8,
      fee: 500,
      rating: 4.8,
      totalReviews: 120,
      languages: 'English, Hindi',
    },
    {
      name: 'Dr. Rohit Verma',
      email: 'rohit.verma@healthcare.com',
      specialization: 'General Physician',
      bio: 'Senior physician with 10+ years of experience in internal medicine, preventative health screenings, and fever care.',
      experienceYears: 10,
      fee: 500,
      rating: 4.6,
      totalReviews: 98,
      languages: 'English, Hindi',
    },
    {
      name: 'Dr. Priya Mehta',
      email: 'priya.mehta@healthcare.com',
      specialization: 'General Physician',
      bio: 'Specialist in family health, preventive care, and adult immunization.',
      experienceYears: 6,
      fee: 450,
      rating: 4.7,
      totalReviews: 76,
      languages: 'English, Hindi, Gujarati',
    },
  ]

  const createdDoctorRecords: Array<{ id: string; name: string; specialization: string }> = []

  for (const doc of mockupDoctors) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        name: doc.name,
        email: doc.email,
        passwordHash,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialization: doc.specialization,
            bio: doc.bio,
            phone: `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`,
            slotDuration: 30,
            experienceYears: doc.experienceYears,
            fee: doc.fee,
            rating: doc.rating,
            totalReviews: doc.totalReviews,
            languages: doc.languages,
            workingHours: DEFAULT_WORKING_HOURS,
          },
        },
      },
      include: { doctor: true },
    })
    if (user.doctor) {
      createdDoctorRecords.push({ id: user.doctor.id, name: user.name, specialization: user.doctor.specialization })
    }
  }

  // 3. Generate 120+ Additional Indian Doctors across 15 Specializations
  console.log('⏳ Generating 120+ Indian Doctor profiles...')

  for (let i = 1; i <= 120; i++) {
    const isFemale = i % 2 === 0
    const firstName = isFemale
      ? FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length]
      : FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length]
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length]
    const doctorName = `Dr. ${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@healthcare.com`

    const specObj = SPECIALIZATIONS[i % SPECIALIZATIONS.length]
    const exp = 4 + (i % 22) // 4 to 25 years experience
    const rating = Number((4.2 + (i % 8) * 0.1).toFixed(1))
    const reviews = 35 + (i * 7) % 200
    const languages = LANGUAGES_COMBOS[i % LANGUAGES_COMBOS.length]
    const fee = specObj.fee + (i % 4) * 50

    const bio = `${doctorName} is a highly respected ${specObj.name} with ${exp} years of clinical experience. Holds ${specObj.degree}. Specializes in patient-centered care and advanced diagnostic procedures.`

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: doctorName,
        email,
        passwordHash,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialization: specObj.name,
            bio,
            phone: `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`,
            slotDuration: specObj.name === 'Neurology' ? 45 : 30,
            experienceYears: exp,
            fee,
            rating,
            totalReviews: reviews,
            languages,
            workingHours: DEFAULT_WORKING_HOURS,
          },
        },
      },
      include: { doctor: true },
    })

    if (user.doctor) {
      createdDoctorRecords.push({ id: user.doctor.id, name: user.name, specialization: user.doctor.specialization })
    }
  }
  console.log(`✅ Total Doctors Created: ${createdDoctorRecords.length}`)

  // 4. Create 50+ Indian Patient Profiles
  console.log('⏳ Generating 50+ Indian Patient profiles...')
  const createdPatientRecords: Array<{ id: string; name: string; email: string }> = []

  // Primary Test Patient (John Doe / Rahul Sharma)
  const primaryPatientUser = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'patient@example.com',
      passwordHash,
      role: 'PATIENT',
      patient: {
        create: {
          bloodGroup: 'O+',
          phone: '+91-9876543210',
        },
      },
    },
    include: { patient: true },
  })
  if (primaryPatientUser.patient) {
    createdPatientRecords.push({ id: primaryPatientUser.patient.id, name: primaryPatientUser.name, email: primaryPatientUser.email })
  }

  for (let i = 1; i <= 50; i++) {
    const isFemale = i % 2 === 0
    const firstName = isFemale
      ? FIRST_NAMES_FEMALE[(i + 5) % FIRST_NAMES_FEMALE.length]
      : FIRST_NAMES_MALE[(i + 5) % FIRST_NAMES_MALE.length]
    const lastName = LAST_NAMES[(i * 2) % LAST_NAMES.length]
    const patientName = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`
    const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-']

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: patientName,
        email,
        passwordHash,
        role: 'PATIENT',
        patient: {
          create: {
            bloodGroup: bloodGroups[i % bloodGroups.length],
            phone: `+91-97${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
        },
      },
      include: { patient: true },
    })

    if (user.patient) {
      createdPatientRecords.push({ id: user.patient.id, name: user.name, email: user.email })
    }
  }
  console.log(`✅ Total Patients Created: ${createdPatientRecords.length}`)

  // 5. Generate 150+ Appointments (Past, Today, Future) with Symptoms, AI Summaries, Visit Notes, Rx & Reminders
  console.log('⏳ Generating 150+ Appointments & Medical Records...')

  let appointmentCount = 0

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00']

  // Seed appointments across last 30 days and next 15 days
  for (let i = 0; i < 150; i++) {
    const doctor = createdDoctorRecords[i % createdDoctorRecords.length]
    const patient = createdPatientRecords[i % createdPatientRecords.length]
    const slotTime = timeSlots[i % timeSlots.length]

    // Determine Date: past (-30 to -1 days), today (0), or future (+1 to +15 days)
    const dayOffset = (i % 45) - 30
    const dateObj = new Date()
    dateObj.setDate(dateObj.getDate() + dayOffset)
    dateObj.setHours(0, 0, 0, 0)

    const isPast = dayOffset < 0
    const isToday = dayOffset === 0
    const isFuture = dayOffset > 0

    const status = isPast
      ? 'COMPLETED'
      : isToday
      ? i % 2 === 0
        ? 'CONFIRMED'
        : 'COMPLETED'
      : 'CONFIRMED'

    const endMinutes =
      parseInt(slotTime.split(':')[0]) * 60 +
      parseInt(slotTime.split(':')[1]) +
      30
    const endTime = `${Math.floor(endMinutes / 60)
      .toString()
      .padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        date: dateObj,
        startTime: slotTime,
        endTime: endTime,
        status: status as 'CONFIRMED' | 'COMPLETED',
        notes: `Patient consultation scheduled for ${doctor.specialization}.`,
      },
    })
    appointmentCount++

    const symptomTemplate = COMMON_SYMPTOMS[i % COMMON_SYMPTOMS.length]

    // Create Symptoms & AI Summaries for Today & Future & Past
    const symptom = await prisma.symptom.create({
      data: {
        appointmentId: appointment.id,
        chiefComplaint: symptomTemplate.chief,
        duration: symptomTemplate.duration,
        severity: symptomTemplate.severity,
        previousConditions: 'None reported',
        currentMedicines: 'None',
      },
    })

    await prisma.symptomSummary.create({
      data: {
        symptomId: symptom.id,
        urgency: symptomTemplate.urgency,
        chiefComplaint: symptomTemplate.chief,
        doctorQuestions: [
          'How long have you experienced these exact symptoms?',
          'Have you noticed any triggers or worsening factors?',
          'Are you currently taking any OTC medications for relief?',
        ],
        status: 'COMPLETED',
      },
    })

    // For Completed appointments, generate Visit Notes & Prescriptions & Reminders
    if (status === 'COMPLETED') {
      const visitNote = await prisma.visitNote.create({
        data: {
          appointmentId: appointment.id,
          clinicalNotes: `Patient examined. Vital signs stable. Diagnosed with ${symptomTemplate.dx}. Advised complete rest and hydration.`,
          diagnosis: symptomTemplate.dx,
          followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          patientSummary: `You have been diagnosed with ${symptomTemplate.dx}. Please follow the prescribed medication dosage and stay well hydrated.`,
        },
      })

      for (const rx of symptomTemplate.rx) {
        const prescription = await prisma.prescription.create({
          data: {
            visitNoteId: visitNote.id,
            drugName: rx.drugName,
            dosage: rx.dosage,
            frequency: rx.frequency,
            durationDays: rx.durationDays,
          },
        })

        // Medication Reminders
        for (let d = 0; d < 3; d++) {
          const remTime = new Date()
          remTime.setDate(remTime.getDate() + d)
          remTime.setHours(9, 0, 0, 0)

          await prisma.medicationReminder.create({
            data: {
              prescriptionId: prescription.id,
              patientId: patient.id,
              scheduledAt: remTime,
              status: d === 0 ? 'SENT' : 'PENDING',
              sentAt: d === 0 ? new Date() : null,
            },
          })
        }
      }
    }
  }

  console.log(`✅ Total Appointments Created: ${appointmentCount}`)

  // 6. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { action: 'SEED_DATABASE', entityType: 'System', entityId: 'seed-01', metadata: { totalDoctors: 123, totalPatients: 51 } },
      { action: 'CREATE_DOCTOR', entityType: 'Doctor', entityId: createdDoctorRecords[0].id, metadata: { name: createdDoctorRecords[0].name } },
      { action: 'BOOK_APPOINTMENT', entityType: 'Appointment', entityId: 'seed-apt-100', metadata: { status: 'CONFIRMED' } },
    ],
  })

  console.log('\n🎉 Massive Indian Healthcare Database Seeding Complete!')
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
