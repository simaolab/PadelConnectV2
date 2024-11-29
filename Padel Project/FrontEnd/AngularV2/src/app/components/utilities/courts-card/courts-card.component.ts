import { Component, Input, output } from '@angular/core';
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

  @Input() court: any;

  constructor(private router: Router) {}

    ngOnInit(): void {

    }

}
