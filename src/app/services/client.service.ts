import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientProfile, UpdateClientProfileRequest } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {
    console.log('ClientService initialized with baseUrl:', this.baseUrl);
  }

  getClientProfile(clientId: number): Observable<ClientProfile> {
    const url = `${this.baseUrl}/${clientId}/profile`;
    console.log('Getting client profile from:', url);
    return this.http.get<ClientProfile>(url);
  }

  updateClientProfile(clientId: number, request: UpdateClientProfileRequest): Observable<ClientProfile> {
    const url = `${this.baseUrl}/${clientId}/profile`;
    console.log('Updating client profile at:', url, 'with data:', request);
    return this.http.put<ClientProfile>(url, request);
  }
}
