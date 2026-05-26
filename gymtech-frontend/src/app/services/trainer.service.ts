import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trainer, CreateTrainerRequest, AssignTrainerRequest } from '../models/trainer.model';

const API = 'http://localhost:5062/api/trainer';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(API);
  }

  getById(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${API}/${id}`);
  }

  create(data: CreateTrainerRequest): Observable<Trainer> {
    return this.http.post<Trainer>(API, data);
  }

  update(id: number, data: CreateTrainerRequest): Observable<Trainer> {
    return this.http.put<Trainer>(`${API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }

  assign(data: AssignTrainerRequest): Observable<void> {
    return this.http.post<void>(`${API}/assign`, data);
  }

  getMembersByTrainer(trainerId: number): Observable<import('../models/member.model').Member[]> {
    return this.http.get<import('../models/member.model').Member[]>(`${API}/${trainerId}/members`);
  }
}
