import { Injectable, signal, computed } from '@angular/core';
import type { Department } from '../models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly _departments = signal<Department[]>([]);
  private readonly _loading    = signal<boolean>(false);
  private readonly _error      = signal<string | null>(null);

  readonly departments = this._departments.asReadonly();
  readonly loading     = this._loading.asReadonly();
  readonly error       = this._error.asReadonly();

  readonly departmentCount = computed(() => this._departments().length);

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await window.electronAPI.getAllDepartments();
      this._departments.set(data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des départements');
      console.error(err);
    } finally {
      this._loading.set(false);
    }
  }

  async create(data: { name: string; description?: string }): Promise<Department> {
    try {
      const dept = await window.electronAPI.createDepartment(data);
      this._departments.update((list) => [...list, dept]);
      return dept;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: number, data: { name?: string; description?: string }): Promise<Department> {
    try {
      const updated = await window.electronAPI.updateDepartment(id, data);
      this._departments.update((list) =>
        list.map((d) => (d.id === id ? { ...d, ...updated } : d))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await window.electronAPI.deleteDepartment(id);
      this._departments.update((list) => list.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
