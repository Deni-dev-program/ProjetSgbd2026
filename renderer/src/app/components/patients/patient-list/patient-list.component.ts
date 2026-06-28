import { Component, OnInit, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { PatientUiService } from '../../../services/patient-ui.service';
import { PatientCardComponent } from '../patient-card/patient-card.component';
import type { Patient } from '../../../models';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [FormsModule, PatientCardComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent implements OnInit {
  readonly patientService = inject(PatientService);
  private readonly patientUi = inject(PatientUiService);

  searchTerm = '';

  readonly filteredPatients = computed(() => {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.patientService.patients();
    return this.patientService.patients().filter(
      (p) =>
        p.firstName.toLowerCase().includes(term) ||
        p.lastName.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.patientService.loadAll();
  }

  openCreate(): void {
    this.patientUi.openCreate();
  }

  openEdit(patient: Patient): void {
    this.patientUi.openEdit(patient);
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Supprimer ce patient ? Ses rendez-vous et dossiers seront aussi supprimés.')) return;
    try {
      await this.patientService.delete(id);
    } catch {
      alert('Impossible de supprimer ce patient.');
    }
  }
}
