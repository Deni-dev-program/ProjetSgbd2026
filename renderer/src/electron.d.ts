import type {
  Department, Doctor, Patient, Appointment,
  MedicalRecord, Medication, Prescription, DashboardStats,
} from './app/models';

declare global {
  interface Window {
    electronAPI: {
      getAllDepartments(): Promise<Department[]>;
      createDepartment(data: Omit<Department, 'id' | 'createdAt' | 'doctors'>): Promise<Department>;
      updateDepartment(id: number, data: Partial<Omit<Department, 'id' | 'createdAt' | 'doctors'>>): Promise<Department>;
      deleteDepartment(id: number): Promise<Department>;

      getAllDoctors(): Promise<Doctor[]>;
      createDoctor(data: Omit<Doctor, 'id' | 'createdAt' | 'department' | 'appointments'>): Promise<Doctor>;
      updateDoctor(id: number, data: Partial<Omit<Doctor, 'id' | 'createdAt' | 'department' | 'appointments'>>): Promise<Doctor>;
      deleteDoctor(id: number): Promise<Doctor>;

      getAllPatients(): Promise<Patient[]>;
      getPatientById(id: number): Promise<Patient>;
      createPatient(data: Omit<Patient, 'id' | 'createdAt' | 'appointments' | 'medicalRecords' | '_count'>): Promise<Patient>;
      updatePatient(id: number, data: Partial<Omit<Patient, 'id' | 'createdAt' | 'appointments' | 'medicalRecords' | '_count'>>): Promise<Patient>;
      deletePatient(id: number): Promise<Patient>;

      getAllAppointments(): Promise<Appointment[]>;
      createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'patient' | 'doctor'>): Promise<Appointment>;
      updateAppointment(id: number, data: Partial<Pick<Appointment, 'date' | 'status' | 'notes'>>): Promise<Appointment>;
      deleteAppointment(id: number): Promise<Appointment>;

      getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
      createMedicalRecord(data: Omit<MedicalRecord, 'id' | 'recordDate' | 'patient' | 'prescriptions'>): Promise<MedicalRecord>;
      deleteMedicalRecord(id: number): Promise<MedicalRecord>;

      getAllMedications(): Promise<Medication[]>;
      createMedication(data: Omit<Medication, 'id' | 'prescriptions'>): Promise<Medication>;
      updateMedication(id: number, data: Partial<Omit<Medication, 'id' | 'prescriptions'>>): Promise<Medication>;
      deleteMedication(id: number): Promise<Medication>;

      createPrescription(data: Omit<Prescription, 'medication' | 'medicalRecord'>): Promise<Prescription>;
      deletePrescription(medicalRecordId: number, medicationId: number): Promise<Prescription>;

      getDashboardStats(): Promise<DashboardStats>;
    };
  }
}
