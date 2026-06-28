import { Injectable, signal } from '@angular/core';
import type { Patient } from '../models';

@Injectable({ providedIn: 'root' })
export class PatientUiService {
  readonly showForm       = signal(false);
  readonly editingPatient = signal<Patient | null>(null);

  openCreate(): void {
    this.editingPatient.set(null);
    this.showForm.set(true);
  }

  openEdit(patient: Patient): void {
    this.editingPatient.set(patient);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingPatient.set(null);
  }
}
