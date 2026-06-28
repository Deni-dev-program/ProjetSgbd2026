import { app, BrowserWindow } from 'electron';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { registerDepartmentHandlers } from './repositories/department.repository';
import { registerDoctorHandlers } from './repositories/doctor.repository';
import { registerPatientHandlers } from './repositories/patient.repository';
import { registerAppointmentHandlers } from './repositories/appointment.repository';
import { registerMedicalRecordHandlers } from './repositories/medical-record.repository';
import { registerMedicationHandlers } from './repositories/medication.repository';
import { registerPrescriptionHandlers } from './repositories/prescription.repository';
import { registerStatsHandlers } from './repositories/stats.repository';

// __dirname = dist/main/ → ../../ = project root
const dbPath = path.join(__dirname, '..', '..', 'prisma', 'dev.db');
process.env['DATABASE_URL'] = `file:${dbPath}`;

const prisma = new PrismaClient();
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'ClinicFlow',
    backgroundColor: '#f8fafc',
  });

  mainWindow.loadFile(
    path.join(__dirname, '../../renderer-dist/browser/index.html')
  );
}

app.whenReady().then(async () => {
  try {
    await prisma.$connect();
  } catch (err) {
    console.error('Erreur connexion Prisma:', err);
  }

  registerDepartmentHandlers(prisma);
  registerDoctorHandlers(prisma);
  registerPatientHandlers(prisma);
  registerAppointmentHandlers(prisma);
  registerMedicalRecordHandlers(prisma);
  registerMedicationHandlers(prisma);
  registerPrescriptionHandlers(prisma);
  registerStatsHandlers(prisma);

  createWindow();
});

app.on('window-all-closed', async () => {
  await prisma.$disconnect();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
