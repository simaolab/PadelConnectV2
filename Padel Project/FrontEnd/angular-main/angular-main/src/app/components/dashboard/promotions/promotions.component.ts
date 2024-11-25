import { Component } from '@angular/core';
import { TitlePageComponent } from '../utilities/title-page/title-page.component';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.css'
})
export class PromotionsComponent {

}
