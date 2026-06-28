import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerMedicationHandlers(prisma: PrismaClient): void {
  ipcMain.handle('medication:getAll', async () => {
    return prisma.medication.findMany({ orderBy: { name: 'asc' } });
  });

  ipcMain.handle('medication:create', async (
    _: IpcMainInvokeEvent,
    data: { name: string; description?: string; dosageForm: string }
  ) => {
    return prisma.medication.create({ data });
  });

  ipcMain.handle('medication:update', async (
    _: IpcMainInvokeEvent,
    id: number,
    data: { name?: string; description?: string; dosageForm?: string }
  ) => {
    return prisma.medication.update({ where: { id }, data });
  });

  ipcMain.handle('medication:delete', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.medication.delete({ where: { id } });
  });
}
