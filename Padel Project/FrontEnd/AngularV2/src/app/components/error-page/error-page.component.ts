import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})

export class ErrorPageComponent {
  error: string = '';
  message: string = '';
  src: string = '';

  constructor(private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      this.error = params['error'];
      this.message = params['message'];
      this.src = params['src'];
    });
  }


}
