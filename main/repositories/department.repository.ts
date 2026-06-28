import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerDepartmentHandlers(prisma: PrismaClient): void {
  ipcMain.handle('department:getAll', async () => {
    return prisma.department.findMany({
      include: { doctors: true },
      orderBy: { name: 'asc' },
    });
  });

  ipcMain.handle('department:create', async (
    _: IpcMainInvokeEvent,
    data: { name: string; description?: string }
  ) => {
    return prisma.department.create({ data });
  });

  ipcMain.handle('department:update', async (
    _: IpcMainInvokeEvent,
    id: number,
    data: { name?: string; description?: string }
  ) => {
    return prisma.department.update({ where: { id }, data });
  });

  ipcMain.handle('department:delete', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.department.delete({ where: { id } });
  });
}
