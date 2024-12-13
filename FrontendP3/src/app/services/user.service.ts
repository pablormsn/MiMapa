import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthGoogleService } from './auth-google.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.BACKEND_URL + '/usuarios/';

  constructor(
    private http: HttpClient,
    private authService: AuthGoogleService,
  ) {}

  crearUsuario(usuarioData: any): Observable<any> {
    console.log('URL de la API: ', this.apiUrl);
    console.log(usuarioData);
    console.log('Token de autenticación: ', this.authService.getTokenId());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getTokenId()}`,
    });
    return this.http.post(this.apiUrl, usuarioData, { headers });
  }

  user: User | null = null;

  setUser(user: User) {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }

  // Métodos para obtener y establecer el nombre de usuario

  setGoogleId(id: string) {
    if (this.user) {
      this.user.googleId = id;
    }
  }

  getGoogleId() {
    return this.user?.googleId;
  }

  // Métodos para obtener y establecer el timestamp del token del usuario

  setTimestamp(timestamp: number) {
    if (this.user) {
      this.user.timestamp = timestamp;
    }
  }

  getTimestamp() {
    return this.user?.timestamp;
  }

  // Métodos para obtener y establecer la caducidad del token del usuario

  setToken(token: string) {
    if (this.user) {
      this.user.token = token;
    }
  }

  getToken() {
    return this.user?.token;
  }

  // Métodos para obtener y establecer la caducidad del token del usuario

  setCaducidad(caducidad: number) {
    if (this.user) this.user.caducidad = caducidad;
  }

  getCaducidad() {
    return this.user?.caducidad;
  }

  // Métodos para obtener y establecer el correo electrónico del usuario

  setUserEmail(emailUsuario: string) {
    if (this.user) this.user.email = emailUsuario;
  }

  getUserEmail() {
    return this.user?.email;
  }

  clearUserProfile() {
    this.user = null;
  }
}
