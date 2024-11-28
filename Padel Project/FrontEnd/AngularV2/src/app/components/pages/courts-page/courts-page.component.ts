import { Component } from '@angular/core';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';
import { CourtsCardComponent } from '../../utilities/courts-card/courts-card.component';

@Component({
  selector: 'courts-page',
  standalone: true,
  imports: [
    PageTopComponent,
    MainContentComponent,
    CourtsCardComponent
  ],
  templateUrl: './courts-page.component.html',
  styleUrl: './courts-page.component.css'
})
export class CourtsPageComponent {

}
