import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'courts-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courts-card.component.html',
  styleUrl: './courts-card.component.css'
})
export class CourtsCardComponent {

  reservations = [
    {
      id: 1,
      title: 'Campo de Padel 1',
      image: 'assets/images/slideshow/1.jpg',
      price: '10€/h',
      stars: 4
    },
    {
      id: 2,
      title: 'Campo de Padel 2',
      image: 'assets/images/slideshow/2.jpg',
      price: '12€/h',
      stars: 4
    },
    {
      id: 3,
      title: 'Campo de Padel 3',
      image: 'assets/images/slideshow/3.jpg',
      price: '15€/h',
      stars: 5
    },
    {
      id: 4,
      title: 'Campo de Padel 4',
      image: 'assets/images/slideshow/4.jpg',
      price: '15€/h',
      stars: 5
    },
    {
      id: 5,
      title: 'Campo de Padel 5',
      image: 'assets/images/slideshow/5.jpg',
      price: '15€/h',
      stars: 5
    },
    {
      id: 6,
      title: 'Campo de Padel 6',
      image: 'assets/images/slideshow/6.jpg',
      price: '15€/h',
      stars: 5
    },
  ];
  
  constructor(private router: Router) {}
}
