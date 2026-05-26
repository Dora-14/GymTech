export interface Payment {
  paymentId: number;
  amount: number;
  date: string;
  method: string;
  memberId: number;
}

export interface CreatePaymentRequest {
  amount: number;
  method: string;
  memberId: number;
}
