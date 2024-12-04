import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourtsService } from '../../../services/courts.service';
import { PageTopComponent } from '../../utilities/page-top/page-top.component';

import { Court } from '../../../models/court';
import { Address } from '../../../models/address';


@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTopComponent,
  ],
  providers: [],
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {
  
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService
  ) {}

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  ngOnInit(): void {
    this.court_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getCourtDetails();
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

}
