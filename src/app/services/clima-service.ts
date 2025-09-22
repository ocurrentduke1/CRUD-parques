import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private apiKey = '607762f623ea5db49963a487d0a77642'; // coloca aquí tu API Key
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  getClima(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`
    );
  }
  
}
