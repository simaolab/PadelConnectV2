document.addEventListener("DOMContentLoaded", function() {

  if(window.location.pathname.includes('/dashboard')) {
    function formatDate(date) {
      const options = { day: '2-digit', month: 'long' };
      return new Intl.DateTimeFormat('pt-PT', options).format(date);
    }

    function formatTime(date) {
      const options = { hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('pt-PT', options).format(date);
    }

    function updateDateTime() {
      const now = new Date();

      const dateElement = document.getElementById("date");
      dateElement.textContent = formatDate(now);

      const hourElement = document.getElementById("hour");
      hourElement.textContent = formatTime(now);
    }
    
    updateDateTime();

    setInterval(updateDateTime, 1000);
  }
})
