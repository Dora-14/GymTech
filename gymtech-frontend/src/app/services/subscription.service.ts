import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription, CreateSubscriptionRequest, SubscriptionPlan } from '../models/subscription.model';

const API = 'http://localhost:5062/api/subscription';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${API}/plans`);
  }

  getAll(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(API);
  }

  getByMember(memberId: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${API}/member/${memberId}`);
  }

  create(data: CreateSubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(API, data);
  }
}
