import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Park } from '../models/park';

@Injectable({
  providedIn: 'root', // El servicio es singleton y accesible en toda la app
})
export class ParkService {
  // URL base del endpoint de parques en el backend
  private apiUrl = `https://azuritaa33.sg-host.com/api/web/v1/parks`;

  constructor(private http: HttpClient) {}

  /**
   * Genera los headers necesarios para las peticiones al backend
   * Incluye content type y claves públicas/privadas de autenticación
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ambu-public-key': 'AMBU-T-BXiqUTFtRg8PbWLc-57055915-n59AHW',
      'Ambu-Private-Key':
        'AMBU-fVN0VyresedITDPm7pvGrjnb2urUxlR0EKsS1qc86T4VEWP6-VFZ4N83UcrKS357V-T',
    });
  }

  /**
   * Obtiene todos los parques desde el backend
   * @returns Observable con un objeto que contiene un arreglo de parques y el estado
   * Se mapea la URL de la imagen para que sea accesible desde el frontend
   */
  getAllParks(): Observable<{ data: Park[]; status: string }> {
    return this.http.get<{ data: Park[]; status: string }>(this.apiUrl, {
      headers: this.getHeaders(),
    }).pipe(
      map(response => ({
        data: response.data.map(park => ({
          ...park,
          // Convertir URI relativa a URL completa para mostrar imágenes
          park_img_uri: `https://azuritaa33.sg-host.com/storage/${park.park_img_uri}`
        })),
        status: response.status
      }))
    );
  }

  /**
   * Obtiene un parque por su ID
   * @param id ID del parque a consultar
   * @returns Observable con el parque correspondiente
   */
  getById(id: number): Observable<Park> {
    return this.http.get<{data: Park; status: string}>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Crea un nuevo parque en el backend
   * @param park Objeto Park con los datos a crear
   * @returns Observable con el parque creado
   */
  create(park: Park): Observable<Park> {
    return this.http.post<Park>(this.apiUrl, park, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Actualiza un parque existente
   * @param id ID del parque a actualizar
   * @param park Datos del parque a actualizar
   * @returns Observable con el parque actualizado
   */
  update(id: number, park: Park): Observable<Park> {
    return this.http.put<Park>(`${this.apiUrl}/${id}`, park, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Elimina un parque por su ID
   * @param id ID del parque a eliminar
   * @returns Observable vacío (void) al completarse la operación
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
