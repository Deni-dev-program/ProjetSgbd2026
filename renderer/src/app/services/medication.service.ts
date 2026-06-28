import { Injectable, signal, computed } from '@angular/core';
import type { Medication } from '../models';

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private readonly _medications = signal<Medication[]>([]);
  private readonly _loading     = signal<boolean>(false);
  private readonly _error       = signal<string | null>(null);

  readonly medications = this._medications.asReadonly();
  readonly loading     = this._loading.asReadonly();
  readonly error       = this._error.asReadonly();

  readonly medicationCount = computed(() => this._medications().length);

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await window.electronAPI.getAllMedications();
      this._medications.set(data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des médicaments');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  async create(data: Omit<Medication, 'id' | 'prescriptions'>): Promise<Medication> {
    try {
      const med = await window.electronAPI.createMedication(data);
      this._medications.update((list) => [...list, med]);
      return med;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: number, data: Partial<Omit<Medication, 'id' | 'prescriptions'>>): Promise<Medication> {
    try {
      const updated = await window.electronAPI.updateMedication(id, data);
      this._medications.update((list) =>
        list.map((m) => (m.id === id ? { ...m, ...updated } : m))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await window.electronAPI.deleteMedication(id);
      this._medications.update((list) => list.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
