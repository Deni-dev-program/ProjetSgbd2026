import { Injectable, signal, computed } from '@angular/core';
import type { Doctor } from '../models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly _doctors  = signal<Doctor[]>([]);
  private readonly _loading  = signal<boolean>(false);
  private readonly _error    = signal<string | null>(null);

  readonly doctors  = this._doctors.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  readonly doctorCount = computed(() => this._doctors().length);

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await window.electronAPI.getAllDoctors();
      this._doctors.set(data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des médecins');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  async create(data: Omit<Doctor, 'id' | 'createdAt' | 'department' | 'appointments'>): Promise<Doctor> {
    try {
      const doctor = await window.electronAPI.createDoctor(data);
      this._doctors.update((list) => [...list, doctor]);
      return doctor;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: number, data: Partial<Omit<Doctor, 'id' | 'createdAt' | 'department' | 'appointments'>>): Promise<Doctor> {
    try {
      const updated = await window.electronAPI.updateDoctor(id, data);
      this._doctors.update((list) =>
        list.map((d) => (d.id === id ? { ...d, ...updated } : d))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await window.electronAPI.deleteDoctor(id);
      this._doctors.update((list) => list.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
