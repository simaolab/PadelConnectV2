if (window.location.pathname.includes('/dashboard')) {

  function toggleSideBar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContainer = document.querySelector('.main-container');
    const nameSite = document.querySelector('.site-name');
    const imgLogo = document.querySelector('.logo-img');
    const ps = document.querySelectorAll('.p-sidebar');

    sidebar.classList.toggle('closed');

    if (sidebar.classList.contains('closed')) {
        mainContainer.style.marginLeft = '110px';
        mainContainer.classList.add('maximized');
        nameSite.style.display = 'none';
        imgLogo.style.width = '65px';
        imgLogo.style.height = '65px';
        ps.forEach(p => {
          p.classList.add('minimized');
        });
    } else {
        mainContainer.style.marginLeft = '270px';
        nameSite.style.display = 'flex';
        imgLogo.style.width = '80px';
        imgLogo.style.height = '80px';
        mainContainer.classList.remove('maximized');
        ps.forEach(p => {
          p.classList.remove('minimized');
        });
    }
  }

  const menuIcon = document.querySelector('.menu-icon');
  menuIcon.addEventListener('click', toggleSideBar);

  window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 674) {
        sidebar.classList.add('show-sidebar');
    } else {
        sidebar.classList.remove('show-sidebar');
    }
  });
}
