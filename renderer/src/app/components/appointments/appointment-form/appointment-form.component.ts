import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';
import type { Appointment, AppointmentStatus } from '../../../models';

function validAppointmentDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { invalidDate: true };
  }

  const year = date.getFullYear();
  if (year < 1900 || year > 2100) {
    return { invalidYear: true };
  }

  return null;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent implements OnInit {
  private readonly fb                  = inject(FormBuilder);
  private readonly appointmentService  = inject(AppointmentService);
  readonly patientService              = inject(PatientService);
  readonly doctorService               = inject(DoctorService);

  editing = input<Appointment | null>(null);
  saved   = output<Appointment>();
  cancel  = output<void>();

  saving   = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    patientId: ['', Validators.required],
    doctorId:  ['', Validators.required],
    date:      ['', [Validators.required, validAppointmentDate]],
    status:    ['SCHEDULED', Validators.required],
    notes:     [''],
  });

  ngOnInit(): void {
    if (this.patientService.patients().length === 0) this.patientService.loadAll();
    if (this.doctorService.doctors().length === 0)   this.doctorService.loadAll();

    const a = this.editing();
    if (a) {
      const localDate = new Date(a.date);
      const pad = (n: number): string => String(n).padStart(2, '0');
      const dateStr = `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;

      this.form.patchValue({ date: dateStr, status: a.status, notes: a.notes ?? '' });
      this.form.get('patientId')?.clearValidators();
      this.form.get('doctorId')?.clearValidators();
      this.form.get('patientId')?.updateValueAndValidity();
      this.form.get('doctorId')?.updateValueAndValidity();
    }
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      if (this.form.get('date')?.hasError('invalidDate') || this.form.get('date')?.hasError('invalidYear')) {
        this.errorMsg.set('Date invalide. Utilisez le calendrier et une année entre 1900 et 2100 (ex. 2026-05-31 11:11).');
      }
      return;
    }

    this.saving.set(true);
    this.errorMsg.set(null);
    try {
      const val = this.form.value as {
        patientId: string; doctorId: string;
        date: string; status: string; notes: string;
      };

      let appt: Appointment;
      const existing = this.editing();
      if (existing) {
        appt = await this.appointmentService.update(existing.id, {
          date: val.date,
          status: val.status as AppointmentStatus,
          notes: val.notes || undefined,
        });
      } else {
        appt = await this.appointmentService.create({
          patientId: Number(val.patientId),
          doctorId:  Number(val.doctorId),
          date:      val.date,
          status:    val.status as AppointmentStatus,
          notes:     val.notes || undefined,
        });
      }
      this.saved.emit(appt);
    } catch (err: unknown) {
      console.error('AppointmentForm onSubmit:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (/invalid date|Invalid Date|date/i.test(msg)) {
        this.errorMsg.set('Date invalide. Choisissez une date réaliste via le calendrier (année entre 1900 et 2100).');
      } else if (/Foreign key|foreign key|patientId|doctorId/i.test(msg)) {
        this.errorMsg.set('Patient ou médecin introuvable. Rechargez la page et réessayez.');
      } else {
        this.errorMsg.set('Erreur lors de la sauvegarde : ' + msg.slice(0, 120));
      }
    } finally {
      this.saving.set(false);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancel.emit();
    }
  }
}
