import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

@Component({
  selector: 'cart-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTopComponent,
    MainContentComponent
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {

}
