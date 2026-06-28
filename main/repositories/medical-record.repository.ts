import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerMedicalRecordHandlers(prisma: PrismaClient): void {
  ipcMain.handle('medicalRecord:getByPatient', async (
    _: IpcMainInvokeEvent,
    patientId: number
  ) => {
    return prisma.medicalRecord.findMany({
      where: { patientId },
      include: { prescriptions: { include: { medication: true } } },
      orderBy: { recordDate: 'desc' },
    });
  });

  ipcMain.handle('medicalRecord:create', async (
    _: IpcMainInvokeEvent,
    data: { patientId: number; diagnosis: string; notes?: string }
  ) => {
    return prisma.medicalRecord.create({ data });
  });

  ipcMain.handle('medicalRecord:delete', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.medicalRecord.delete({ where: { id } });
  });
}
