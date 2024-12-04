import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

interface CartItem {
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  pricePerHour: number;
  totalHours: number;
  totalPrice: number;
}

@Component({
  selector: 'cart-page',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    PageTopComponent,
    MainContentComponent
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    const cart = this.cookieService.get('cart');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      this.cartItems = parsedCart.items || [];
    }
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  clearCart(): void {
    this.cookieService.delete('cart');
    this.cartItems = [];
  }

  updateCart(): void {
    const updatedCart = {
      items: this.cartItems,
      totalPrice: this.getTotalPrice()
    };
    this.cookieService.set('cart', JSON.stringify(updatedCart), 1, '/');
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }
}
