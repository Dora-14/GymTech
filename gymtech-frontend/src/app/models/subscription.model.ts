export interface SubscriptionPlan {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  badge: string;
}

export interface Subscription {
  subscriptionId: number;
  type: string;
  price: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  memberId: number;
}

export interface CreateSubscriptionRequest {
  type: string;
  price: number;
  durationDays: number;
  startDate: string;
  memberId: number;
}
