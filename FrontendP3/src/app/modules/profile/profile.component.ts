import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { BotonAtrasComponent } from '../boton-atras/boton-atras.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [BotonAtrasComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    console.log(this.user);
  }
}
