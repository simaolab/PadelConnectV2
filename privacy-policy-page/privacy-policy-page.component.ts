import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [ CommonModule,
    PageTopComponent,
    MainContentComponent],
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.css'
})
export class PrivacyPolicyPageComponent {
  aboutImageUrl = "assets/images/about/renith-r-A9VpotrPr1k-unsplash.jpg";
}
