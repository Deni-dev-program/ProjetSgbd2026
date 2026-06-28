import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerDoctorHandlers(prisma: PrismaClient): void {
  ipcMain.handle('doctor:getAll', async () => {
    return prisma.doctor.findMany({
      include: { department: true },
      orderBy: { lastName: 'asc' },
    });
  });

  ipcMain.handle('doctor:create', async (
    _: IpcMainInvokeEvent,
    data: { firstName: string; lastName: string; email: string; phone?: string; departmentId: number }
  ) => {
    return prisma.doctor.create({ data, include: { department: true } });
  });

  ipcMain.handle('doctor:update', async (
    _: IpcMainInvokeEvent,
    id: number,
    data: { firstName?: string; lastName?: string; email?: string; phone?: string; departmentId?: number }
  ) => {
    return prisma.doctor.update({
      where: { id },
      data,
      include: { department: true },
    });
  });

  ipcMain.handle('doctor:delete', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.doctor.delete({ where: { id } });
  });
}
