import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router,RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'link-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './links-sidebar.component.html',
  styleUrl: './links-sidebar.component.css'
})
export class LinksSidebarComponent {

  @Input() href: string = "";
  @Input() icon: string = "";
  @Input() p: string = "";
  @Output() click = new EventEmitter<void>();

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  onClick() {
    this.click.emit();
  }
}
