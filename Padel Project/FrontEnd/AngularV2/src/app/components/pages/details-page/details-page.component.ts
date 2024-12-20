import { ReservationsService } from './../../../services/reservations.service';
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

  courtObj = {
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
    file_path: '',
  };

  schedules: {
    weekdays: any[];
    saturday: any | null;
    sunday: any | null;
  } = {
    weekdays: [],
    saturday: null,
    sunday: null,
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
    private reservationsService: ReservationsService
  ) {}

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  ngOnInit(): void {
    this.court_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getCourtDetails();
  }

  formatHour(hour: string): string {
    if (hour) {
      const parts = hour.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return hour;
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
          file_path: field.file_path
        };

        console.log(this.courtObj)

        this.schedules = {
          weekdays: court.schedules.weekdays || [],
          saturday: court.schedules.saturday || null,
          sunday: court.schedules.sunday || null,
        };

        if (this.schedules.weekdays.length > 0) {
          this.schedules.weekdays.forEach(schedule => {
            schedule.opening_time = this.formatHour(schedule.opening_time);
            schedule.closing_time = this.formatHour(schedule.closing_time);
          });
        }

        if (this.schedules.saturday) {
          this.schedules.saturday.opening_time = this.formatHour(this.schedules.saturday.opening_time);
          this.schedules.saturday.closing_time = this.formatHour(this.schedules.saturday.closing_time);
        }

        if (this.schedules.sunday) {
          this.schedules.sunday.opening_time = this.formatHour(this.schedules.sunday.opening_time);
          this.schedules.sunday.closing_time = this.formatHour(this.schedules.sunday.closing_time);
        }

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

  getCourtImage(filePath: string): string {
    return this.courtsService.getCourtImage(filePath);
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
        this.modalComponent?.showModal(
          'Erro',
          'A data de fim deve ser posterior à data de início.'
        );
      }
    }
  }

  addToCart(): void {
    if (!this.startDate || !this.endDate || this.totalPrice === 0) {
      this.modalComponent?.showModal(
        'Erro',
        'Por favor, preencha datas válidas antes de adicionar ao carrinho'
      );
      return;
    }

    // Verifica se a data de início não é anterior à data atual
    const today = new Date();
    if (new Date(this.startDate) < today) {
      this.modalComponent?.showModal(
        'Erro',
        'A data de início não pode ser inferior à data atual.'
      );
      return;
    }

    // Verifica se a hora de início e de término são múltiplos de hora cheia (ex: 18:00, 19:00)
    const startDateObj = new Date(this.startDate);
    const endDateObj = new Date(this.endDate);

    if (startDateObj.getMinutes() !== 0) {
      this.modalComponent?.showModal(
        'Erro',
        'A hora de início deve ser um valor completo, como 18:00 ou 19:00.'
      );
      return;
    }

    if (endDateObj.getMinutes() !== 0) {
      this.modalComponent?.showModal(
        'Erro',
        'A hora de término deve ser um valor completo, como 18:00 ou 19:00.'
      );
      return;
    }

    let cart: Cart = this.cookieService.get('cart')
      ? JSON.parse(this.cookieService.get('cart'))
      : { items: [], totalPrice: 0 };

    const isDuplicate = cart.items.some((item: CartItem) =>
      item.startDate === this.startDate && item.endDate === this.endDate && item.fieldId === this.court_id
    );

    if (isDuplicate) {
      this.modalComponent?.showModal(
        'Erro',
        'Já existe uma reserva com as mesmas datas no carrinho.'
      );
      return;
    }

    const formatDateToPT = (date: any) => {
      const formattedDate = new Date(date);
      const day = String(formattedDate.getDate()).padStart(2, '0');
      const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
      const year = formattedDate.getFullYear();
      const hours = String(formattedDate.getHours()).padStart(2, '0');
      const minutes = String(formattedDate.getMinutes()).padStart(2, '0');
      const seconds = String(formattedDate.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const availabilityParams = {
      start_date: formatDateToPT(this.startDate),
      end_date: formatDateToPT(this.endDate),
      field: this.court_id,
    };

    this.reservationsService.checkAvailability(availabilityParams).subscribe({
      next: (response: any) => {
        if (response.available) {
          const reservationItem: CartItem = {
            fieldId: this.court_id,
            name: this.courtObj.name,
            address: this.address,
            startDate: this.startDate,
            endDate: this.endDate,
            pricePerHour: this.courtObj.price_hour,
            totalPrice: this.totalPrice,
            totalHours: (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 60 * 60),
          };

          if (!Array.isArray(cart.items)) {
            cart.items = [];
          }

          cart.items.push(reservationItem);

          cart.totalPrice = cart.items.reduce((total, item: CartItem) => {
            return total + item.totalPrice;
          }, 0);

          this.cookieService.set('cart', JSON.stringify(cart), 1, '/');

          this.modalComponent?.showModal(
            'Sucesso',
            `${reservationItem.name} adicionado ao carrinho`
          );
        } else {
          this.modalComponent?.showModal(
            'Erro',
            response.message || 'As datas selecionadas não estão disponíveis.'
          );
        }
      },
      error: (err: any) => {
        this.modalComponent?.showModal(
          'Erro',
          err.error.message
        );
      },
    });
  }



}
