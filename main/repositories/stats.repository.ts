import { ipcMain } from 'electron';
import { PrismaClient } from '@prisma/client';

export function registerStatsHandlers(prisma: PrismaClient): void {
  ipcMain.handle('stats:getDashboard', async () => {
    const [patientCount, doctorCount, appointmentCount, departmentCount, medicationCount] =
      await Promise.all([
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.appointment.count(),
        prisma.department.count(),
        prisma.medication.count(),
      ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: { date: { gte: today, lt: tomorrow } },
    });

    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const recentPatients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      patientCount,
      doctorCount,
      appointmentCount,
      departmentCount,
      medicationCount,
      todayAppointments,
      appointmentsByStatus,
      recentPatients,
    };
  });
}
