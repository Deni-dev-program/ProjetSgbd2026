import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Départements ────────────────────────────────────
  getAllDepartments: () =>
    ipcRenderer.invoke('department:getAll'),
  createDepartment: (data: { name: string; description?: string }) =>
    ipcRenderer.invoke('department:create', data),
  updateDepartment: (id: number, data: { name?: string; description?: string }) =>
    ipcRenderer.invoke('department:update', id, data),
  deleteDepartment: (id: number) =>
    ipcRenderer.invoke('department:delete', id),

  // ── Médecins ─────────────────────────────────────────
  getAllDoctors: () =>
    ipcRenderer.invoke('doctor:getAll'),
  createDoctor: (data: unknown) =>
    ipcRenderer.invoke('doctor:create', data),
  updateDoctor: (id: number, data: unknown) =>
    ipcRenderer.invoke('doctor:update', id, data),
  deleteDoctor: (id: number) =>
    ipcRenderer.invoke('doctor:delete', id),

  // ── Patients ──────────────────────────────────────────
  getAllPatients: () =>
    ipcRenderer.invoke('patient:getAll'),
  getPatientById: (id: number) =>
    ipcRenderer.invoke('patient:getById', id),
  createPatient: (data: unknown) =>
    ipcRenderer.invoke('patient:create', data),
  updatePatient: (id: number, data: unknown) =>
    ipcRenderer.invoke('patient:update', id, data),
  deletePatient: (id: number) =>
    ipcRenderer.invoke('patient:delete', id),

  // ── Rendez-vous ───────────────────────────────────────
  getAllAppointments: () =>
    ipcRenderer.invoke('appointment:getAll'),
  createAppointment: (data: unknown) =>
    ipcRenderer.invoke('appointment:create', data),
  updateAppointment: (id: number, data: unknown) =>
    ipcRenderer.invoke('appointment:update', id, data),
  deleteAppointment: (id: number) =>
    ipcRenderer.invoke('appointment:delete', id),

  // ── Dossiers médicaux ─────────────────────────────────
  getMedicalRecordsByPatient: (patientId: number) =>
    ipcRenderer.invoke('medicalRecord:getByPatient', patientId),
  createMedicalRecord: (data: unknown) =>
    ipcRenderer.invoke('medicalRecord:create', data),
  deleteMedicalRecord: (id: number) =>
    ipcRenderer.invoke('medicalRecord:delete', id),

  // ── Médicaments ───────────────────────────────────────
  getAllMedications: () =>
    ipcRenderer.invoke('medication:getAll'),
  createMedication: (data: unknown) =>
    ipcRenderer.invoke('medication:create', data),
  updateMedication: (id: number, data: unknown) =>
    ipcRenderer.invoke('medication:update', id, data),
  deleteMedication: (id: number) =>
    ipcRenderer.invoke('medication:delete', id),

  // ── Prescriptions ─────────────────────────────────────
  createPrescription: (data: unknown) =>
    ipcRenderer.invoke('prescription:create', data),
  deletePrescription: (medicalRecordId: number, medicationId: number) =>
    ipcRenderer.invoke('prescription:delete', medicalRecordId, medicationId),

  // ── Statistiques ──────────────────────────────────────
  getDashboardStats: () =>
    ipcRenderer.invoke('stats:getDashboard'),
});
