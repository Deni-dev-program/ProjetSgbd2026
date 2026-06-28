import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerPatientHandlers(prisma: PrismaClient): void {
  ipcMain.handle('patient:getAll', async () => {
    return prisma.patient.findMany({
      include: { _count: { select: { medicalRecords: true } } },
      orderBy: { lastName: 'asc' },
    });
  });

  ipcMain.handle('patient:getById', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: { doctor: { include: { department: true } } },
          orderBy: { date: 'desc' },
        },
        medicalRecords: {
          include: { prescriptions: { include: { medication: true } } },
          orderBy: { recordDate: 'desc' },
        },
      },
    });
  });

  ipcMain.handle('patient:create', async (
    _: IpcMainInvokeEvent,
    data: { firstName: string; lastName: string; email: string; phone?: string; dateOfBirth: string; address?: string }
  ) => {
    return prisma.patient.create({
      data: { ...data, dateOfBirth: new Date(data.dateOfBirth) },
    });
  });

  ipcMain.handle('patient:update', async (
    _: IpcMainInvokeEvent,
    id: number,
    data: { firstName?: string; lastName?: string; email?: string; phone?: string; dateOfBirth?: string; address?: string }
  ) => {
    const { dateOfBirth, ...rest } = data;
    return prisma.patient.update({
      where: { id },
      data: { ...rest, ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {}) },
    });
  });

  ipcMain.handle('patient:delete', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.patient.delete({ where: { id } });
  });
}
