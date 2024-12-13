import { Component } from '@angular/core';
import { LogService } from '../../services/log.service';
import { JsonPipe } from '@angular/common';
import { BotonAtrasComponent } from '../boton-atras/boton-atras.component';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [JsonPipe, BotonAtrasComponent],
  templateUrl: './log.component.html'
})
export class LogComponent {
  //En este componente se hara el log, el cual se mostrara haciendo una peticion get a la base de datos en la coleccion de usuarios
  logs: any

  constructor(
    private logService: LogService,
  ) {}
  
  ngOnInit(): void {
    this.obtenerLog();
    
  }
  
  obtenerLog(): void {
    this.logService.getLog().subscribe({
      next: (logs) => {
        this.logs = logs;
        console.log(this.logs["users"]);
      },
      error: (error) => {
        console.error("Error al obtener el log:", error);
      }
    });
  }
}
