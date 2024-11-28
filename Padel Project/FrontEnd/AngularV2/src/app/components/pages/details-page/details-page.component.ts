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
  imports: [PageTopComponent, 
    FullCalendarModule
  ],
  providers: [],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {

  calendarOptions: any;

  court: any; // Variável para armazenar os detalhes do campo

  constructor(
    private route: ActivatedRoute, 
    private courtsService: CourtsService // Injete o serviço aqui
  ) {}

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],  // Registrando o plugin dayGrid
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

    const courtId = this.route.snapshot.paramMap.get('id'); // Obtendo o ID da URL
    if (courtId) {
      this.getCourtDetails(courtId); // Chame o método para buscar os detalhes do campo
    }
  }

  // Método para buscar os detalhes do campo
  getCourtDetails(id: string): void {
    this.courtsService.index().subscribe(courts => {
      // Encontrar o campo específico com base no ID
      this.court = courts.find((court: any) => court.id === id);
    });
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
