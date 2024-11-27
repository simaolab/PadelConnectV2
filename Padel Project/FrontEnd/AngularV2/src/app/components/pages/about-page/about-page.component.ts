import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

@Component({
  selector: 'about-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTopComponent,
    MainContentComponent
  ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {
  aboutImageUrl = "assets/images/about/renith-r-A9VpotrPr1k-unsplash.jpg";
}
