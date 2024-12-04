import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourtsService } from '../../../services/courts.service';
import { CookieService } from 'ngx-cookie-service';
import { ModalComponent } from '../../utilities/modal/modal.component';
import { Court } from '../../../interfaces/court';
import { Address } from '../../../interfaces/address';
import { CartItem, Cart } from '../../../interfaces/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

import { PageTopComponent } from '../../utilities/page-top/page-top.component';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageTopComponent,
    ModalComponent
  ],
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;

  courtObj: Court = {
    name: '',
    company_id: 0,
    price_hour: 0,
    type_floor: '',
    status: '',
    illumination: 0,
    cover: 0,
    last_maintenance: '',
    shower_room: 0,
    lockers: 0,
    rent_equipment: 0,
  };

  addressObj: Address = {
    addressPort: '',
    postalCode: '',
    locality: '',
  };

  court_id: number = 0;
  startDate: string = '';
  endDate: string = '';
  totalPrice: number = 0;
  today: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService,
    private cookieService: CookieService,
  ) {}

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  ngOnInit(): void {
    this.court_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getCourtDetails();
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  getCourtDetails(): void {
    this.courtsService.show(this.court_id).subscribe({
      next: (court: any) => {
        const field = court.field;

        this.courtObj = {
          name: field.name,
          company_id: field.company.name,
          price_hour: field.price_hour,
          type_floor: field.type_floor,
          illumination: field.illumination,
          status: field.status,
          cover: field.cover,
          last_maintenance: field.last_maintenance,
          shower_room: field.shower_room,
          lockers: field.lockers,
          rent_equipment: field.rent_equipment,
        };

        if (field.company.address) {
          const addressParts = field.company.address.split(', ');
          if (addressParts.length === 3) {
            this.addressObj = {
              addressPort: addressParts[0],
              postalCode: addressParts[1],
              locality: addressParts[2],
            };
          }
        }
      }
    });
  }

  calculatePrice(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (end > start) {
        const diffInMs = end.getTime() - start.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        this.totalPrice = diffInHours * this.courtObj.price_hour;
      } else {
        this.totalPrice = 0;
        alert('A data de fim deve ser posterior à data de início.');
      }
    }
  }

  addToCart(): void {
    if (!this.startDate || !this.endDate || this.totalPrice === 0) {
      alert('Por favor, preencha datas válidas antes de adicionar ao carrinho.');
      return;
    }

    const reservationItem: CartItem = {
      name: this.courtObj.name,
      address: this.address,
      startDate: this.startDate,
      endDate: this.endDate,
      pricePerHour: this.courtObj.price_hour,
      totalPrice: this.totalPrice,
      totalHours: (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 60 * 60),
    };

    let cart: Cart = this.cookieService.get('cart') ? JSON.parse(this.cookieService.get('cart')) : { items: [], totalPrice: 0 };

    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    cart.items.push(reservationItem);

    cart.totalPrice = cart.items.reduce((total, item: CartItem) => {
      return total + item.totalPrice;
    }, 0);

    this.cookieService.set('cart', JSON.stringify(cart), 1, '/');

    this.modalComponent?.showModal(
      'Success',
      `${reservationItem.name} adicionado ao carrinho`
    );
  }
}
