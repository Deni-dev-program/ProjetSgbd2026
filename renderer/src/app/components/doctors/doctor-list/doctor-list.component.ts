import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';
import type { Doctor } from '../../../models';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [FormsModule, DoctorFormComponent],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent implements OnInit {
  readonly doctorService = inject(DoctorService);

  searchTerm     = '';
  showForm       = signal<boolean>(false);
  editingDoctor  = signal<Doctor | null>(null);

  readonly filteredDoctors = computed(() => {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.doctorService.doctors();
    return this.doctorService.doctors().filter(
      (d) =>
        d.firstName.toLowerCase().includes(term) ||
        d.lastName.toLowerCase().includes(term) ||
        d.email.toLowerCase().includes(term) ||
        (d.department?.name ?? '').toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.doctorService.loadAll();
  }

  openCreate(): void {
    this.editingDoctor.set(null);
    this.showForm.set(true);
  }

  openEdit(doctor: Doctor): void {
    this.editingDoctor.set(doctor);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingDoctor.set(null);
  }

  async onSaved(): Promise<void> {
    await this.doctorService.loadAll();
    this.closeForm();
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Supprimer ce médecin ?')) return;
    try {
      await this.doctorService.delete(id);
    } catch {
      alert('Impossible de supprimer ce médecin (il a peut-être des rendez-vous associés).');
    }
  }
}
