import { CommonModule, JsonPipe, NgIf, NgFor } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../../services/auth-google.service';
import { UserService } from '../../services/user.service';
import { MapasComponent } from '../mapas/mapas.component';
import { MapasService } from '../../services/mapas.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Coordenadas } from '../../models/coords.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe, NgIf, NgFor, MapasComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  profile: any;
  user: any;
  mapaForm: FormGroup;
  marcadorForm: FormGroup;
  // token: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthGoogleService,
    private router: Router,
    private userService: UserService,
    private mapasService: MapasService,
    private http: HttpClient,
  ) {
    this.profile = this.authService.profile;
    effect(() => {
      if (this.profile) {
        console.log('Profile: ', this.profile());
        const { email, sub, jti, exp } = this.profile();
        this.userService.setUser({
          token: jti,
          email,
          timestamp: Date.now(),
          caducidad: exp,
          googleId: sub,
        });
        this.user = this.userService.getUser();
      }
      console.log;
      this.userService.crearUsuario(this.user).subscribe((res) => {
        console.log(res);
      });
    });

    this.mapaForm = this.fb.group({
      mapa: this.fb.group({
        ubicacion: this.fb.group({
          lat: [''],
          lon: [''],
        }),
      }),
    });

    this.marcadorForm = this.fb.group({
      lugar: [''], // Asegúrate de que el control 'lugar' esté definido aquí
    });
  }

  ngOnInit(): void {
    // this.profile.subscribe((profile: any) => {
    //   if (profile) {
    //     console.log(profile);
    //     const { name, email, picture, sub } = profile;
    //     this.userService.setUser({
    //       name,
    //       email,
    //       imagen: picture,
    //       googleId: sub,
    //     });
    //   }
    // });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toProfile() {
    this.router.navigate(['/profile']);
  }

  onSubmit() {
    const lugar = this.marcadorForm.get('lugar')?.value;
    if (lugar) {
      this.getCoordinates(lugar).subscribe((coords: Coordenadas) => {
        const marcador = {
          email: this.user.email,
          lat: coords.lat,
          lon: coords.lon,
        };
        this.mapasService.createMarcador(marcador).subscribe((res) => {
          console.log('Marcador añadido:', res);
        });
      });
    }
  }

  getCoordinates(address: string): Observable<Coordenadas> {
    return this.http
      .get<any>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          addressdetails: '1',
        },
      })
      .pipe(
        map((response) => {
          const coords = response[0];
          return { lat: parseFloat(coords.lat), lon: parseFloat(coords.lon) };
        }),
      );
  }

  // cargarMapa() {
  //   this.mapasService.searchByQuery().subscribe({
  //     next: (mapa) => {

  //     },
  //     error: (err) => {
  //       console.error("Error al obtener el mapa:", err);
  //     },
  //   });
  // }
}
