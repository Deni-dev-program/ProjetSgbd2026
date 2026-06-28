import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./components/patients/patient-list/patient-list.component').then(
        (m) => m.PatientListComponent
      ),
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('./components/doctors/doctor-list/doctor-list.component').then(
        (m) => m.DoctorListComponent
      ),
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./components/appointments/appointment-list/appointment-list.component').then(
        (m) => m.AppointmentListComponent
      ),
  },
  {
    path: 'departments',
    loadComponent: () =>
      import('./components/departments/department-list/department-list.component').then(
        (m) => m.DepartmentListComponent
      ),
  },
  {
    path: 'medications',
    loadComponent: () =>
      import('./components/medications/medication-list/medication-list.component').then(
        (m) => m.MedicationListComponent
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
