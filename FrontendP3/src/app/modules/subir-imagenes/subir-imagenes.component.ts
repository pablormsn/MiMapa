import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubirImagenesService } from './../../services/subir-imagenes.service';
import { environment } from '../../../environments/environment';
import { AuthGoogleService } from '../../services/auth-google.service';

@Component({
  selector: 'app-subir-imagenes',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './subir-imagenes.component.html',
})
export class SubirImagenesComponent {
  public url: string = '';
  selectedFile: File | null = null;
  mensaje: string = '';

  constructor(
    private http: HttpClient,
    private imageUrl: SubirImagenesService,
    private authService: AuthGoogleService,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('archivo', this.selectedFile);

      try {
        const response = await fetch(
          environment.BACKEND_URL + '/archivos/subir',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.authService.getTokenId()}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al subir la imagen');
        }

        const data = await response.json();
        console.log(data['url']);
        this.mensaje = data.mensaje;
        this.imageUrl.setUrl(data['url']);
      } catch (error) {
        if (error instanceof Error) {
          this.mensaje = error.message;
        } else {
          this.mensaje = 'Error desconocido al subir la imagen';
        }
      }
    }
  }
}
