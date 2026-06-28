import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { DepartmentService } from '../../../services/department.service';
import type { Doctor } from '../../../models';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss',
})
export class DoctorFormComponent implements OnInit {
  private readonly fb            = inject(FormBuilder);
  private readonly doctorService = inject(DoctorService);
  readonly deptService           = inject(DepartmentService);

  editing = input<Doctor | null>(null);
  saved   = output<Doctor>();
  cancel  = output<void>();

  saving   = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    firstName:    ['', Validators.required],
    lastName:     ['', Validators.required],
    email:        ['', [Validators.required, Validators.email]],
    phone:        [''],
    departmentId: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.deptService.departments().length === 0) {
      this.deptService.loadAll();
    }
    const d = this.editing();
    if (d) {
      this.form.patchValue({
        firstName:    d.firstName,
        lastName:     d.lastName,
        email:        d.email,
        phone:        d.phone ?? '',
        departmentId: String(d.departmentId),
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.errorMsg.set(null);
    try {
      const val = this.form.value as {
        firstName: string; lastName: string; email: string;
        phone: string; departmentId: string;
      };
      const data = {
        firstName:    val.firstName,
        lastName:     val.lastName,
        email:        val.email,
        phone:        val.phone || undefined,
        departmentId: Number(val.departmentId),
      };

      let doctor: Doctor;
      const existing = this.editing();
      if (existing) {
        doctor = await this.doctorService.update(existing.id, data);
      } else {
        doctor = await this.doctorService.create(data);
      }
      this.saved.emit(doctor);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Unique constraint') || msg.includes('unique')) {
        this.errorMsg.set('Cet email est déjà utilisé par un autre médecin.');
      } else {
        this.errorMsg.set('Erreur lors de la sauvegarde. Vérifiez les champs et réessayez.');
      }
      console.error('DoctorForm onSubmit:', err);
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
