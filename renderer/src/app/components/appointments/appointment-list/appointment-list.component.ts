import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import type { Appointment, AppointmentStatus } from '../../../models';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [FormsModule, AppointmentFormComponent],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
})
export class AppointmentListComponent implements OnInit {
  readonly appointmentService = inject(AppointmentService);

  statusFilter = '';
  showForm     = signal<boolean>(false);
  editingAppt  = signal<Appointment | null>(null);

  readonly filteredAppointments = computed(() => {
    const filter = this.statusFilter as AppointmentStatus | '';
    if (!filter) return this.appointmentService.appointments();
    return this.appointmentService.appointments().filter((a) => a.status === filter);
  });

  constructor() {
    effect(() => {
      const count = this.filteredAppointments().length;
      console.log(`[ClinicFlow] Rendez-vous affichés : ${count}`);
    });
  }

  ngOnInit(): void {
    this.appointmentService.loadAll();
  }

  openCreate(): void {
    this.editingAppt.set(null);
    this.showForm.set(true);
  }

  openEdit(appt: Appointment): void {
    this.editingAppt.set(appt);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingAppt.set(null);
  }

  async onSaved(): Promise<void> {
    await this.appointmentService.loadAll();
    this.closeForm();
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await this.appointmentService.delete(id);
    } catch {
      alert('Impossible de supprimer ce rendez-vous.');
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('fr-BE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  statusLabel(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      SCHEDULED: 'Planifié',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
    };
    return labels[status];
  }
}
