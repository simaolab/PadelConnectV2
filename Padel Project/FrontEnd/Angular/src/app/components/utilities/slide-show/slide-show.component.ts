import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'; // Importando o estilo do Swiper

@Component({
  selector: 'slide-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit, AfterViewInit {

  // Array de dados com as imagens e informações
  fields = [
    { name: 'Campo 1', image: 'assets/images/slideshow/1.jpg', rating: 4.5 },
    { name: 'Campo 2', image: 'assets/images/slideshow/2.jpg', rating: 4.5 },
    { name: 'Campo 3', image: 'assets/images/slideshow/3.jpg', rating: 4.5 },
    { name: 'Campo 4', image: 'assets/images/slideshow/4.jpg', rating: 4.5 },
    { name: 'Campo 5', image: 'assets/images/slideshow/5.jpg', rating: 4.5 },
  ];

  swiper!: Swiper;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Não inicializamos o Swiper aqui, apenas preparamos os dados
  }

  ngAfterViewInit(): void {
    // Verifica se o código está a ser executado no browser
    if (isPlatformBrowser(this.platformId)) {
      // Inicialize o Swiper
      this.swiper = new Swiper('.slide-show-slider', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
    }
  }
}
