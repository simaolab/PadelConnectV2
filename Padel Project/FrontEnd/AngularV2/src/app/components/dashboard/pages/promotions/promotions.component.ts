import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';

import { AddButtonComponent } from '../../utilities/add-button/add-button.component';

@Component({
  selector: 'promotions',
  standalone: true,
  imports: [
    TitlePageComponent,
    AddButtonComponent
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.css'
})
export class PromotionsComponent {

}
