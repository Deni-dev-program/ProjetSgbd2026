import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerPrescriptionHandlers(prisma: PrismaClient): void {
  ipcMain.handle('prescription:create', async (
    _: IpcMainInvokeEvent,
    data: { medicalRecordId: number; medicationId: number; dosage: string; duration: string; instructions?: string }
  ) => {
    return prisma.prescription.create({
      data,
      include: { medication: true },
    });
  });

  ipcMain.handle('prescription:delete', async (
    _: IpcMainInvokeEvent,
    medicalRecordId: number,
    medicationId: number
  ) => {
    return prisma.prescription.delete({
      where: { medicalRecordId_medicationId: { medicalRecordId, medicationId } },
    });
  });
}
