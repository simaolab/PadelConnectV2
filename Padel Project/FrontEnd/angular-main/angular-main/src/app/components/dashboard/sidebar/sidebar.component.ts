import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LinksSidebarComponent } from '../utilities/links-sidebar/links-sidebar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    LinksSidebarComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // constructor(private router: Router) {}

  // isActive(route: string): boolean {
  //   return this.router.url === route;
  // }
}
