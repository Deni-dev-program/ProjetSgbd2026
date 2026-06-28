import { Component, input, output } from '@angular/core';
import type { Patient } from '../../../models';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss',
})
export class PatientCardComponent {
  patient = input.required<Patient>();

  edit   = output<Patient>();
  delete = output<number>();

  initials(): string {
    const first = this.patient()?.firstName?.charAt(0) ?? '';
    const last  = this.patient()?.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || '?';
  }

  birthDate(): string {
    const dob = this.patient()?.dateOfBirth;
    if (!dob) return '—';
    return String(dob).slice(0, 10);
  }
}
