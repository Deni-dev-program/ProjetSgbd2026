import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import type { Department } from '../../../models';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit {
  readonly deptService = inject(DepartmentService);
  private readonly fb  = inject(FormBuilder);

  showForm     = signal<boolean>(false);
  editingDept  = signal<Department | null>(null);
  saving       = false;

  form = this.fb.group({
    name:        ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.deptService.loadAll();
  }

  openCreate(): void {
    this.form.reset();
    this.editingDept.set(null);
    this.showForm.set(true);
  }

  openEdit(dept: Department): void {
    this.form.patchValue({ name: dept.name, description: dept.description ?? '' });
    this.editingDept.set(dept);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingDept.set(null);
    this.form.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    try {
      const val = this.form.value as { name: string; description: string };
      const data = { name: val.name, description: val.description || undefined };
      const existing = this.editingDept();
      if (existing) {
        await this.deptService.update(existing.id, data);
      } else {
        await this.deptService.create(data);
      }
      this.closeForm();
    } catch {
      alert('Erreur lors de la sauvegarde du département.');
    } finally {
      this.saving = false;
    }
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Supprimer ce département ? (Impossible s\'il contient des médecins)')) return;
    try {
      await this.deptService.delete(id);
    } catch {
      alert('Impossible de supprimer ce département : il contient des médecins.');
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeForm();
    }
  }
}
