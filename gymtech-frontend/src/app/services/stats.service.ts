import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stats } from '../models/stats.model';

const API = 'http://localhost:5062/api/stats';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient) {}

  get(): Observable<Stats> {
    return this.http.get<Stats>(API);
  }
}
