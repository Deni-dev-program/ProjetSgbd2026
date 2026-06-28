import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PatientFormComponent } from './components/patients/patient-form/patient-form.component';
import { PatientService } from './services/patient.service';
import { PatientUiService } from './services/patient-ui.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PatientFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly patientUi      = inject(PatientUiService);
  private readonly patientService = inject(PatientService);

  sidebarOpen = signal<boolean>(true);

  readonly navItems: NavItem[] = [
    { path: '/dashboard',    label: 'Tableau de bord', icon: '📊' },
    { path: '/patients',     label: 'Patients',         icon: '🧑‍⚕️' },
    { path: '/doctors',      label: 'Médecins',         icon: '👨‍⚕️' },
    { path: '/appointments', label: 'Rendez-vous',      icon: '📅' },
    { path: '/departments',  label: 'Départements',     icon: '🏥' },
    { path: '/medications',  label: 'Médicaments',      icon: '💊' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  async onPatientSaved(): Promise<void> {
    await this.patientService.loadAll();
    this.patientUi.closeForm();
  }
}
