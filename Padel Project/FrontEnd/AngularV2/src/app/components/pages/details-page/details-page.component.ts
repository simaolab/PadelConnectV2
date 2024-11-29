import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourtsService } from '../../../services/courts.service';
import { PageTopComponent } from '../../utilities/page-top/page-top.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptLocale from '@fullcalendar/core/locales/pt';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    PageTopComponent,
    FullCalendarModule
  ],
  providers: [],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {

  calendarOptions: any;

  courtObj = {
    name: '',
    company_name: '',
    price_hour: 0,
    type_floor: '',
    illumination: 0,
    status: '',
    cover: 0,
    address: ''
  }

  court_id: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService
  ) {}

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
          company_name: field.company.name,
          price_hour: field.price_hour,
          type_floor: field.type_floor,
          illumination: field.illumination,
          status: field.status,
          cover: field.cover,
          address: field.company.address
        };

        console.log(this.courtObj)
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
  }

}
