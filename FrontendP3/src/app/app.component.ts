import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import type { AuthGoogleService } from "./services/auth-google.service.ts";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent { }
