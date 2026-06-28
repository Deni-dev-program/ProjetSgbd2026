import { Injectable, signal } from '@angular/core';
import type { DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly _stats   = signal<DashboardStats | null>(null);
  private readonly _loading = signal<boolean>(false);

  readonly stats   = this._stats.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadDashboard(): Promise<void> {
    this._loading.set(true);
    try {
      const data = await window.electronAPI.getDashboardStats();
      this._stats.set(data);
    } catch (err) {
      console.error('Erreur stats dashboard:', err);
    } finally {
      this._loading.set(false);
    }
  }
}
