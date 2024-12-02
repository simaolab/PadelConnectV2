import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

@Component({
  selector: 'app-padel-rules',
  standalone: true,
  imports: [CommonModule, PageTopComponent, MainContentComponent],
  templateUrl: './padel-rules.component.html',
  styleUrl: './padel-rules.component.css'
})
export class PadelRulesComponent {
  aboutImageUrl = "assets/images/about/renith-r-A9VpotrPr1k-unsplash.jpg";
}
