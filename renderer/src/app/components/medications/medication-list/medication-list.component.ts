import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MedicationService } from '../../../services/medication.service';
import type { Medication } from '../../../models';

@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './medication-list.component.html',
  styleUrl: './medication-list.component.scss',
})
export class MedicationListComponent implements OnInit {
  readonly medService  = inject(MedicationService);
  private readonly fb  = inject(FormBuilder);

  searchTerm  = '';
  showForm    = signal<boolean>(false);
  editingMed  = signal<Medication | null>(null);
  saving      = false;

  readonly filteredMedications = computed(() => {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.medService.medications();
    return this.medService.medications().filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.dosageForm.toLowerCase().includes(term) ||
        (m.description ?? '').toLowerCase().includes(term)
    );
  });

  form = this.fb.group({
    name:        ['', Validators.required],
    dosageForm:  ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.medService.loadAll();
  }

  openCreate(): void {
    this.form.reset();
    this.editingMed.set(null);
    this.showForm.set(true);
  }

  openEdit(med: Medication): void {
    this.form.patchValue({ name: med.name, dosageForm: med.dosageForm, description: med.description ?? '' });
    this.editingMed.set(med);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingMed.set(null);
    this.form.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    try {
      const val = this.form.value as { name: string; dosageForm: string; description: string };
      const data = { name: val.name, dosageForm: val.dosageForm, description: val.description || undefined };
      const existing = this.editingMed();
      if (existing) {
        await this.medService.update(existing.id, data);
      } else {
        await this.medService.create(data);
      }
      this.closeForm();
    } catch {
      alert('Erreur lors de la sauvegarde du médicament.');
    } finally {
      this.saving = false;
    }
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Supprimer ce médicament ?')) return;
    try {
      await this.medService.delete(id);
    } catch {
      alert('Impossible de supprimer ce médicament (il est utilisé dans des prescriptions).');
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeForm();
    }
  }
}
