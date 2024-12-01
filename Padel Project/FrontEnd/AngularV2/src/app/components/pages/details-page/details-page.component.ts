import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourtsService } from '../../../services/courts.service';
import { PageTopComponent } from '../../utilities/page-top/page-top.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt';
import { Court } from '../../../models/court';
import { Address } from '../../../models/address';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTopComponent,
    FullCalendarModule
  ],
  providers: [],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {

  calendarOptions: any;

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
  }

    addressObj: Address = {
      addressPort: '',
      postalCode: '',
      locality: '',
    }

  court_id: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService
  ) {}

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      locale: ptLocale,
      events: [
        { title: 'event 1', date: '2024-12-01' },
        { title: 'event 2', date: '2024-12-02' }
      ],
      buttonText: {
        today:    'Hoje',    // Botão "Hoje"
        month:    'Mês',     // Botão "Mês"
        week:     'Semana',  // Botão "Semana"
        day:      'Dia',     // Botão "Dia"
        list:     'Agenda'   // Botão "Agenda" (se usar a visão de lista)
      },
      datesSet: () => {
        // A função será chamada quando as datas do calendário forem definidas
        this.changeTitleColor();
        this.changeButtonStyles();
      }
    };

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
    })
  }

  changeTitleColor(): void {
    const calendarTitle = document.querySelector('.fc-toolbar-title');
    if (calendarTitle) {
      (calendarTitle as HTMLElement).style.color = '#57cc99'; // Altere para a cor que deseja
    }
  }

  changeButtonStyles(): void {
    const prevButton = document.querySelector('.fc-prev-button');
    const nextButton = document.querySelector('.fc-next-button');
    const todayButton = document.querySelector('.fc-today-button');
    const allFcButtons = document.querySelectorAll('.fc-button');

    if (prevButton) {
      (prevButton as HTMLElement).style.backgroundColor = '#57cc99'; // Cor de fundo do botão anterior
      (prevButton as HTMLElement).style.color = '#ffffff'; // Cor do texto
    }
    if (nextButton) {
      (nextButton as HTMLElement).style.backgroundColor = '#57cc99'; // Cor de fundo do botão próximo
      (nextButton as HTMLElement).style.color = '#ffffff'; // Cor do texto
    }
    if (todayButton) {
      (todayButton as HTMLElement).style.backgroundColor = '#57cc99'; // Cor de fundo do botão "Hoje"
      (todayButton as HTMLElement).style.color = '#ffffff'; // Cor do texto
    }
    allFcButtons.forEach(button => {
      (button as HTMLElement).style.border = 'none';
    });
  }

}
