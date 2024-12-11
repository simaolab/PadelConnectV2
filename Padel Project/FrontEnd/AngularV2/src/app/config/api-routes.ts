export const ApiRoutes = {
  //AUTH
  login: 'https://api.padelconnect.pt/api/login',
  logout: 'https://api.padelconnect.pt/api/logout',
  register: 'https://api.padelconnect.pt/api/register',

  //USERS
  users: 'https://api.padelconnect.pt/api/users/',
  userInfo: 'https://api.padelconnect.pt/api/user',
  client: 'https://api.padelconnect.pt/api/clients/',
  updatePassword: 'https://api.padelconnect.pt/api/user/update-password',

  //COURTS
  courts: 'https://api.padelconnect.pt/api/fields/',

  //COMPANIES
  companies: 'https://api.padelconnect.pt/api/companies/',

  //PROMOTIONS
  promotions: 'https://api.padelconnect.pt/api/promotions/',

  //NATIONALITIES
  nationalities: 'https://api.padelconnect.pt/api/nationalities/',

  //RESERVATIONS
  reservations: 'https://api.padelconnect.pt/api/reservations/',
  checkAvailability: 'https://api.padelconnect.pt/api/reservations/check-availability?',

  //ROLES
  roles: 'https://api.padelconnect.pt/api/roles/'
}
