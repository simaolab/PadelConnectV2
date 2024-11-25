import { Component, OnInit } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router  } from '@angular/router';
import { NavbarComponent } from './components/master/navbar/navbar.component';
import { FooterComponent } from './components/master/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';

@Component({
  selector: 'app',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  // title = 'Angular';

  showHeaderFooter: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url = event.url as string;
        this.showHeaderFooter = !(url === '/login' || url.startsWith('/dashboard'));
      }
    });
  }
}
