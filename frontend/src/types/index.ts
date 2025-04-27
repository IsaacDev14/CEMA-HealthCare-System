export interface Program {
    id: number;
    name: string;
    description?: string;
  }
  
  export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
  }
  
  export interface Enrollment {
    id: number;
    clientId: number;
    programId: number;
    enrolledAt: string;
  }
  
  export interface EnrollmentStat {
    name: string;
    count: number;
  }