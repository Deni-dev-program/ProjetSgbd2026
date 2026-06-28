import { Injectable, signal, computed } from '@angular/core';
import type { Appointment, AppointmentStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _loading      = signal<boolean>(false);
  private readonly _error        = signal<string | null>(null);

  readonly appointments = this._appointments.asReadonly();
  readonly loading      = this._loading.asReadonly();
  readonly error        = this._error.asReadonly();

  readonly appointmentCount = computed(() => this._appointments().length);

  readonly scheduledCount = computed(
    () => this._appointments().filter((a) => a.status === 'SCHEDULED').length
  );

  readonly completedCount = computed(
    () => this._appointments().filter((a) => a.status === 'COMPLETED').length
  );

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await window.electronAPI.getAllAppointments();
      this._appointments.set(data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des rendez-vous');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  async create(data: Omit<Appointment, 'id' | 'createdAt' | 'patient' | 'doctor'>): Promise<Appointment> {
    try {
      const appt = await window.electronAPI.createAppointment(data);
      this._appointments.update((list) => [appt, ...list]);
      return appt;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: number, data: { date?: string; status?: AppointmentStatus; notes?: string }): Promise<Appointment> {
    try {
      const updated = await window.electronAPI.updateAppointment(id, data);
      this._appointments.update((list) =>
        list.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await window.electronAPI.deleteAppointment(id);
      this._appointments.update((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
