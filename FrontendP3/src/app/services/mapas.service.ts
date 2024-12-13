import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthGoogleService } from './auth-google.service';
import { Marcador } from '../models/marcador.model';

@Injectable({
  providedIn: 'root',
})
export class MapasService {
  private ubi: any = { lat: 0, lon: 0 };
  private lugar: string = '';

  private apiUrl = environment.BACKEND_URL + '/mapas/';

  constructor(
    private http: HttpClient,
    private authService: AuthGoogleService,
  ) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getTokenId();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluir el token Bearer en los encabezados
    });
  }

  setCoordenadas(lat: number, lon: number): void {
    this.ubi.lat = lat;
    this.ubi.lon = lon;
    console.log(this.ubi);
  }

  getCoordenadas(): any {
    return this.ubi;
  }

  setLugar(lugar: string): void {
    this.lugar = lugar;
    console.log(this.lugar);
  }

  getLugar(): any {
    return this.lugar;
  }

  searchByQuery(params: {
    query?: string;
    lat?: number;
    lon?: number;
  }): Observable<any> {
    let url = this.apiUrl;

    if (params.query) {
      url += `?q=${encodeURIComponent(params.query)}`;
    } else if (params.lat !== undefined && params.lon !== undefined) {
      url += `?lat=${params.lat}&lon=${params.lon}`;
    } else {
      throw new Error("Debe proporcionar una 'query' o 'lat' y 'lon'");
    }

    const headers = this.createAuthHeaders();
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al buscar ubicación:', error);
        return throwError(() => error);
      }),
    );
  }

  createMapa(mapaData: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(this.apiUrl, mapaData, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear el mapa', error);
        return throwError(() => error);
      }),
    );
  }

  createMarcador(data: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http
      .post(environment.BACKEND_URL + `/marcadores`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al crear el marcador', error);
          return throwError(() => error);
        }),
      );
  }

  updateMapa(id: string, mapaData: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}${id}`, mapaData, { headers }).pipe(
      catchError((error) => {
        console.error('Error al actualizar el mapa', error);
        return throwError(() => error);
      }),
    );
  }

  getMapaByEntradaId(entradaId: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}entrada/${entradaId}`, {
      headers,
    });
  }

  deleteMapa(id: string): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.apiUrl}${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar el mapa', error);
        return throwError(() => error);
      }),
    );
  }
}
