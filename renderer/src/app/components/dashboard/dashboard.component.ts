import { Component, OnInit, inject, computed } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  readonly statsService = inject(StatsService);

  readonly stats = computed(() => this.statsService.stats());

  ngOnInit(): void {
    this.statsService.loadDashboard();
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      SCHEDULED: 'Planifié',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
    };
    return labels[status] ?? status;
  }
}
