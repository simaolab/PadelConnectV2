document.addEventListener('DOMContentLoaded', function () {
  const nextButton = document.querySelector('.swiper-button-next');
  const prevButton = document.querySelector('.swiper-button-prev');

  if (nextButton && prevButton) {
    nextButton.addEventListener('click', function () {
      const swiperInstance = document.querySelector('.slide-show-slider').swiper;
      swiperInstance.slideNext();
    });

    prevButton.addEventListener('click', function () {
      const swiperInstance = document.querySelector('.slide-show-slider').swiper;
      swiperInstance.slidePrev();
    });
  }
});
