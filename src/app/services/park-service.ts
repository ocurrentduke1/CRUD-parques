import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Park } from '../models/park';

@Injectable({
  providedIn: 'root',
})
export class ParkService {
  private apiUrl = `https://azuritaa33.sg-host.com/api/web/v1/parks`;


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ambu-public-key': 'AMBU-T-BXiqUTFtRg8PbWLc-57055915-n59AHW',
      'Ambu-Private-Key':
        'AMBU-fVN0VyresedITDPm7pvGrjnb2urUxlR0EKsS1qc86T4VEWP6-VFZ4N83UcrKS357V-T',
    });
  }

  getAllParks(): Observable<{ data: Park[]; status: string }> {
    return this.http.get<{ data: Park[]; status: string }>(this.apiUrl, {
      headers: this.getHeaders(),
    }).pipe(
      map(response => ({
        data: response.data.map(park => ({
          ...park,
          park_img_uri: `https://azuritaa33.sg-host.com/storage/${park.park_img_uri}`
        })),
        status: response.status
      }))
    );
  }

  getById(id: number): Observable<Park> {
    return this.http.get<{data: Park; status: string}>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      map(response => response.data)
    );
  }

  create(park: Park): Observable<Park> {
    return this.http.post<Park>(this.apiUrl, park, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, park: Park): Observable<Park> {
    return this.http.put<Park>(`${this.apiUrl}/${id}`, park, {
      headers: this.getHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
