import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule  } from '@angular/router';

@Component({
  selector: 'add-button',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.css'
})
export class AddButtonComponent {
  @Input() href: string = '';

  constructor(private router: Router) {}
}
