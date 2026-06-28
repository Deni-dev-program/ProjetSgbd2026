import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import type { Patient } from '../../../models';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
})
export class PatientFormComponent implements OnInit {
  private readonly fb             = inject(FormBuilder);
  private readonly patientService = inject(PatientService);

  editing = input<Patient | null>(null);
  saved   = output<Patient>();
  cancel  = output<void>();

  saving      = signal(false);
  errorMsg    = signal<string | null>(null);
  formTouched = false;

  get btnLabel(): string {
    if (this.saving()) return 'Enregistrement…';
    return this.editing() ? 'Mettre à jour' : 'Créer';
  }

  form = this.fb.group({
    firstName:   ['', Validators.required],
    lastName:    ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    phone:       [''],
    dateOfBirth: ['', Validators.required],
    address:     [''],
  });

  ngOnInit(): void {
    this.form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
    });

    const p = this.editing();
    if (p) {
      this.form.patchValue({
        firstName:   p.firstName,
        lastName:    p.lastName,
        email:       p.email,
        phone:       p.phone ?? '',
        dateOfBirth: p.dateOfBirth.slice(0, 10),
        address:     p.address ?? '',
      });
    }
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    this.formTouched = true;
    this.errorMsg.set(null);

    if (this.form.invalid) {
      this.errorMsg.set('Remplissez tous les champs obligatoires (*).');
      return;
    }

    if (!window.electronAPI) {
      this.errorMsg.set('API non disponible — lancez l\'app via "npm start" et non via un navigateur.');
      return;
    }

    this.saving.set(true);
    try {
      const val = this.form.getRawValue();
      const data = {
        firstName:   val.firstName!.trim(),
        lastName:    val.lastName!.trim(),
        email:       val.email!.trim(),
        phone:       val.phone?.trim() || undefined,
        dateOfBirth: val.dateOfBirth!,
        address:     val.address?.trim() || undefined,
      };

      let patient: Patient;
      const existing = this.editing();
      if (existing) {
        patient = await this.patientService.update(existing.id, data);
      } else {
        patient = await this.patientService.create(data);
      }

      await this.patientService.loadAll();
      this.saved.emit(patient);
    } catch (err: unknown) {
      console.error('[PatientForm] Erreur création:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (/unique|Unique|UNIQUE|already exists/i.test(msg)) {
        this.errorMsg.set('Cet email est déjà utilisé. Choisissez un autre email.');
      } else if (msg.includes('electronAPI') || msg.includes('undefined') || msg.includes('invoke')) {
        this.errorMsg.set('Connexion Electron perdue. Lancez l\'app avec « npm start » (fenêtre Electron, pas le navigateur).');
      } else {
        this.errorMsg.set('Erreur lors de la sauvegarde : ' + msg.slice(0, 120));
      }
    } finally {
      this.saving.set(false);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
