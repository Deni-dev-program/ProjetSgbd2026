import { Injectable, signal, computed } from '@angular/core';
import type { Patient } from '../models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly _patients = signal<Patient[]>([]);
  private readonly _loading  = signal<boolean>(false);
  private readonly _error    = signal<string | null>(null);

  readonly patients = this._patients.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  readonly patientCount = computed(() => this._patients().length);

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await window.electronAPI.getAllPatients();
      this._patients.set(data.map((p) => this.normalize(p)));
    } catch (err) {
      this._error.set('Erreur lors du chargement des patients');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  private normalize(p: Patient): Patient {
    return {
      ...p,
      dateOfBirth: p.dateOfBirth ? String(p.dateOfBirth).slice(0, 10) : '',
    };
  }

  async create(data: Omit<Patient, 'id' | 'createdAt' | 'appointments' | 'medicalRecords' | '_count'>): Promise<Patient> {
    try {
      const patient = this.normalize(await window.electronAPI.createPatient(data));
      this._patients.update((list) => [...list, patient]);
      return patient;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: number, data: Partial<Omit<Patient, 'id' | 'createdAt' | 'appointments' | 'medicalRecords' | '_count'>>): Promise<Patient> {
    try {
      const updated = this.normalize(await window.electronAPI.updatePatient(id, data));
      this._patients.update((list) =>
        list.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await window.electronAPI.deletePatient(id);
      this._patients.update((list) => list.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
