import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
    this.isMenuOpen = false;
  }
}
