import { PageTopComponent } from './../page-top/page-top.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    PageTopComponent
  ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {
  aboutImageUrl = "src/assets/images/about/renith-r-A9VpotrPr1k-unsplash.jpg";
}
