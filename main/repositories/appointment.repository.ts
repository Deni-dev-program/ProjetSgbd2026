import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { PrismaClient } from '@prisma/client';

type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

function parseDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error('Date invalide');
  const year = parsed.getFullYear();
  if (year < 1900 || year > 2100) throw new Error('Année invalide (entre 1900 et 2100)');
  return parsed;
}

export function registerAppointmentHandlers(prisma: PrismaClient): void {
  ipcMain.handle('appointment:getAll', async () => {
    return prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: { include: { department: true } },
      },
      orderBy: { date: 'desc' },
    });
  });

  ipcMain.handle('appointment:create', async (
    _: IpcMainInvokeEvent,
    data: { patientId: number; doctorId: number; date: string; status?: AppointmentStatus; notes?: string }
  ) => {
    const date = parseDate(data.date);
    return prisma.appointment.create({
      data: { ...data, date },
      include: { patient: true, doctor: { include: { department: true } } },
    });
  });

  ipcMain.handle('appointment:update', async (
    _: IpcMainInvokeEvent,
    id: number,
    data: { date?: string; status?: AppointmentStatus; notes?: string }
  ) => {
    const { date, ...rest } = data;
    const parsedDate = date ? parseDate(date) : undefined;
    return prisma.appointment.update({
      where: { id },
      data: { ...rest, ...(parsedDate ? { date: parsedDate } : {}) },
      include: { patient: true, doctor: true },
    });
  });

  ipcMain.handle('appointment:delete', async (
    _: IpcMainInvokeEvent,
    id: number
  ) => {
    return prisma.appointment.delete({ where: { id } });
  });
}
