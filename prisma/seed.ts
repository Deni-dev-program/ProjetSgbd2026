import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Peuplement de la base de données...');

  // Départements
  const cardio = await prisma.department.upsert({
    where: { name: 'Cardiologie' },
    update: {},
    create: { name: 'Cardiologie', description: 'Maladies cardiovasculaires' },
  });
  const pediatrie = await prisma.department.upsert({
    where: { name: 'Pédiatrie' },
    update: {},
    create: { name: 'Pédiatrie', description: 'Soins des enfants et adolescents' },
  });
  const urgences = await prisma.department.upsert({
    where: { name: 'Urgences' },
    update: {},
    create: { name: 'Urgences', description: 'Soins d\'urgence 24h/24' },
  });
  const neurologie = await prisma.department.upsert({
    where: { name: 'Neurologie' },
    update: {},
    create: { name: 'Neurologie', description: 'Maladies du système nerveux' },
  });

  console.log('✅ Départements créés');

  // Médecins
  const dr1 = await prisma.doctor.upsert({
    where: { email: 'martin.dupont@clinicflow.be' },
    update: {},
    create: {
      firstName: 'Martin', lastName: 'Dupont',
      email: 'martin.dupont@clinicflow.be', phone: '+32 2 123 45 67',
      departmentId: cardio.id,
    },
  });
  const dr2 = await prisma.doctor.upsert({
    where: { email: 'sophie.lambert@clinicflow.be' },
    update: {},
    create: {
      firstName: 'Sophie', lastName: 'Lambert',
      email: 'sophie.lambert@clinicflow.be', phone: '+32 2 234 56 78',
      departmentId: pediatrie.id,
    },
  });
  const dr3 = await prisma.doctor.upsert({
    where: { email: 'jean.moreau@clinicflow.be' },
    update: {},
    create: {
      firstName: 'Jean', lastName: 'Moreau',
      email: 'jean.moreau@clinicflow.be', phone: '+32 2 345 67 89',
      departmentId: urgences.id,
    },
  });
  const dr4 = await prisma.doctor.upsert({
    where: { email: 'claire.leroy@clinicflow.be' },
    update: {},
    create: {
      firstName: 'Claire', lastName: 'Leroy',
      email: 'claire.leroy@clinicflow.be',
      departmentId: neurologie.id,
    },
  });

  console.log('✅ Médecins créés');

  // Patients
  const p1 = await prisma.patient.upsert({
    where: { email: 'alice.martin@email.com' },
    update: {},
    create: {
      firstName: 'Alice', lastName: 'Martin',
      email: 'alice.martin@email.com', phone: '+32 470 11 22 33',
      dateOfBirth: new Date('1985-03-15'), address: 'Rue de la Paix 12, 1000 Bruxelles',
    },
  });
  const p2 = await prisma.patient.upsert({
    where: { email: 'bob.durand@email.com' },
    update: {},
    create: {
      firstName: 'Bob', lastName: 'Durand',
      email: 'bob.durand@email.com', phone: '+32 470 44 55 66',
      dateOfBirth: new Date('1972-07-22'),
    },
  });
  const p3 = await prisma.patient.upsert({
    where: { email: 'carla.petit@email.com' },
    update: {},
    create: {
      firstName: 'Carla', lastName: 'Petit',
      email: 'carla.petit@email.com',
      dateOfBirth: new Date('1995-11-08'), address: 'Avenue Louise 45, 1050 Bruxelles',
    },
  });
  const p4 = await prisma.patient.upsert({
    where: { email: 'david.simon@email.com' },
    update: {},
    create: {
      firstName: 'David', lastName: 'Simon',
      email: 'david.simon@email.com', phone: '+32 470 77 88 99',
      dateOfBirth: new Date('2010-01-30'),
    },
  });

  console.log('✅ Patients créés');

  // Rendez-vous
  const now = new Date();
  await prisma.appointment.createMany({
    data: [
      {
        patientId: p1.id, doctorId: dr1.id,
        date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        status: 'SCHEDULED', notes: 'Contrôle annuel cardiaque',
      },
      {
        patientId: p2.id, doctorId: dr1.id,
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: 'COMPLETED', notes: 'Suivi hypertension',
      },
      {
        patientId: p3.id, doctorId: dr3.id,
        date: new Date(),
        status: 'SCHEDULED',
      },
      {
        patientId: p4.id, doctorId: dr2.id,
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'SCHEDULED', notes: 'Consultation pédiatrique annuelle',
      },
      {
        patientId: p1.id, doctorId: dr4.id,
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        status: 'CANCELLED',
      },
    ],
  });

  console.log('✅ Rendez-vous créés');

  // Médicaments
  const med1 = await prisma.medication.upsert({
    where: { name: 'Amoxicilline 500mg' },
    update: {},
    create: { name: 'Amoxicilline 500mg', description: 'Antibiotique à large spectre', dosageForm: 'Gélule' },
  });
  const med2 = await prisma.medication.upsert({
    where: { name: 'Ibuprofène 400mg' },
    update: {},
    create: { name: 'Ibuprofène 400mg', description: 'Anti-inflammatoire non stéroïdien', dosageForm: 'Comprimé' },
  });
  const med3 = await prisma.medication.upsert({
    where: { name: 'Lisinopril 10mg' },
    update: {},
    create: { name: 'Lisinopril 10mg', description: 'Inhibiteur de l\'ECA pour hypertension', dosageForm: 'Comprimé' },
  });
  const med4 = await prisma.medication.upsert({
    where: { name: 'Paracétamol 1g' },
    update: {},
    create: { name: 'Paracétamol 1g', description: 'Analgésique et antipyrétique', dosageForm: 'Comprimé' },
  });
  const med5 = await prisma.medication.upsert({
    where: { name: 'Metformine 850mg' },
    update: {},
    create: { name: 'Metformine 850mg', description: 'Antidiabétique oral', dosageForm: 'Comprimé' },
  });

  console.log('✅ Médicaments créés');

  // Dossiers médicaux + prescriptions
  const record1 = await prisma.medicalRecord.create({
    data: {
      patientId: p2.id,
      diagnosis: 'Hypertension artérielle essentielle',
      notes: 'Tension systolique élevée (150/95). Recommande régime pauvre en sel.',
    },
  });
  await prisma.prescription.create({
    data: {
      medicalRecordId: record1.id, medicationId: med3.id,
      dosage: '10mg/jour', duration: '3 mois',
      instructions: 'Prendre le matin à jeun',
    },
  });

  const record2 = await prisma.medicalRecord.create({
    data: {
      patientId: p1.id,
      diagnosis: 'Infection respiratoire haute',
      notes: 'Pharyngite bactérienne. Fièvre 38.5°C.',
    },
  });
  await prisma.prescription.createMany({
    data: [
      {
        medicalRecordId: record2.id, medicationId: med1.id,
        dosage: '500mg 3x/jour', duration: '7 jours',
        instructions: 'Prendre pendant les repas',
      },
      {
        medicalRecordId: record2.id, medicationId: med4.id,
        dosage: '1g toutes les 6h', duration: '5 jours',
        instructions: 'En cas de douleur ou fièvre > 38.5°C',
      },
    ],
  });

  console.log('✅ Dossiers médicaux et prescriptions créés');
  console.log('🏥 Base de données peuplée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du peuplement:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
