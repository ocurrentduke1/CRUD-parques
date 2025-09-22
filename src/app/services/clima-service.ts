import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // El servicio será singleton y accesible en toda la aplicación
})
export class ClimaService {

  // API Key de OpenWeatherMap (debe reemplazarse por tu propia clave)
  private apiKey = '607762f623ea5db49963a487d0a77642';
  
  // URL base para la API de clima
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el clima actual de una ubicación específica usando latitud y longitud.
   * @param lat Latitud de la ubicación
   * @param lon Longitud de la ubicación
   * @returns Observable con la respuesta de la API de OpenWeatherMap
   */
  getClima(lat: number, lon: number): Observable<any> {
    // Construir URL con parámetros de latitud, longitud, API Key, unidades métricas y lenguaje español
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`;

    // Realizar petición HTTP GET y devolver observable
    return this.http.get(url);
  }
}
