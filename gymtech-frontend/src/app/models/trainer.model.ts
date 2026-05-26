export interface Trainer {
  trainerId: number;
  fullName: string;
  speciality: string;
  phone: string;
  memberTrainers?: TrainerMember[];
}

export interface TrainerMember {
  memberId: number;
  trainerId: number;
  member?: {
    memberId: number;
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface CreateTrainerRequest {
  fullName: string;
  speciality: string;
  phone: string;
}

export interface AssignTrainerRequest {
  memberId: number;
  trainerId: number;
}
