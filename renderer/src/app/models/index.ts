export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Department {
  id: number;
  name: string;
  description?: string | null;
  doctors?: Doctor[];
  createdAt: string;
}

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  departmentId: number;
  department?: Department;
  appointments?: Appointment[];
  createdAt: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth: string;
  address?: string | null;
  appointments?: Appointment[];
  medicalRecords?: MedicalRecord[];
  _count?: { medicalRecords: number };
  createdAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  status: AppointmentStatus;
  notes?: string | null;
  patient?: Patient;
  doctor?: Doctor;
  createdAt: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  diagnosis: string;
  notes?: string | null;
  recordDate: string;
  patient?: Patient;
  prescriptions?: Prescription[];
}

export interface Medication {
  id: number;
  name: string;
  description?: string | null;
  dosageForm: string;
  prescriptions?: Prescription[];
}

export interface Prescription {
  medicalRecordId: number;
  medicationId: number;
  dosage: string;
  duration: string;
  instructions?: string | null;
  medication?: Medication;
  medicalRecord?: MedicalRecord;
}

export interface DashboardStats {
  patientCount: number;
  doctorCount: number;
  appointmentCount: number;
  departmentCount: number;
  medicationCount: number;
  todayAppointments: number;
  appointmentsByStatus: Array<{
    status: AppointmentStatus;
    _count: { status: number };
  }>;
  recentPatients: Patient[];
}
