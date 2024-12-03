import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [RouterModule], // Importa RouterModule
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent {
  error: string = '';
  message: string = '';
  src: string = '';
  href: string = '';
  hrefP: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.error = params['error'];
      this.message = params['message'];
      this.src = params['src'];
      this.href = params['href'];
      this.hrefP = params['hrefP'];
    });
  }
}
