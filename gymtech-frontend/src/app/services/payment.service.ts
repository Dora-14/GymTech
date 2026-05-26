import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, CreatePaymentRequest } from '../models/payment.model';

const API = 'http://localhost:5062/api/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  getByMember(memberId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API}/member/${memberId}`);
  }

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API}/all`);
  }

  create(data: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(API, data);
  }
}
