export interface Member {
  memberId: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  registrationDate: string;
  memberTrainers?: {
    trainer: { trainerId: number; fullName: string; speciality: string; phone: string; };
  }[];
}

export interface CreateMemberRequest {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}
