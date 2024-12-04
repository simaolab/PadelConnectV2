import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isScrolled = false;
  isNavbarActive = false;

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  ngOnInit(): void {
    this.handleNavbarScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.handleNavbarScroll();
  }

  handleNavbarScroll(): void {
    const scrollPosition = window.scrollY || window.pageYOffset;
    this.isScrolled = scrollPosition > 100;
  }

  toggleNavbar(): void {
    this.isNavbarActive = !this.isNavbarActive;
  }

  closeNavbar(): void {
    this.isNavbarActive = false;
  }

}
