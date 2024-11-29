import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';

import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  clientObj = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    nif: 0,
    contact: 0,
    gender: '',
    nationality: '',
    birthday: ''
  };

  client_id: number = 0;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.userInfo();
  }

  clientInfo(client_id: number): void {
    this.usersService.clientInfo(client_id).subscribe({
      next: (res: any) => {
        if (res && res.client) {
          const client = res.client;

          this.clientObj = {
            first_name: client.first_name || '',
            last_name: client.last_name || '',
            username: client.user?.username || '',
            email: client.user?.email || '',
            nif: client.user?.nif || 0,
            contact: client.contact || 0,
            gender: client.gender || '',
            nationality: client.nationality || '',
            birthday: client.user?.birthday || ''
          };

          console.log(this.clientObj);
        } else {
          console.error('A resposta não contém o objeto "client".', res);
        }
      },
      error: (err: any) => {
        console.error('Erro ao obter informações do cliente:', err);
      }
    });
  }

  userInfo(): void {
    this.usersService.userInfo().subscribe({
      next: (res: any) => {
        this.client_id = res.user.id
        this.clientInfo(this.client_id);
      }
    })
  }
}
