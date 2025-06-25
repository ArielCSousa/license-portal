import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DetachedModule } from 'ds2u-lib';
import { LicencaService } from '../../services/licenca.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, DetachedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() loggedInUserInfo: any = { avatar: './avatardefault.jpg' };
  @Output() logoutClicked = new EventEmitter<void>();

  constructor(private licencaService: LicencaService) {}

  topBarProfileOptions = [
    {
      label: 'Meu Perfil',
      icon: 'fe-user',
      redirectTo: '',
    },
    {
      label: 'Logout',
      icon: 'fe-log-out',
      action: () => {
        this.limparTabela(); // Chama a função de limpar
        this.logoutClicked.emit(); // Emite o logout para o componente pai
      },
    },
  ];

  menuItems = [
    {
      key: 'license-generator',
      label: 'Gerador de licenças',
      isTitle: false,
      icon: 'clipboard',
      link: '/product-selector',
    },
    {
      key: 'request',
      label: 'Suas licenças',
      isTitle: false,
      icon: 'clock',
      link: '',
    },
    {
      key: 'licenses',
      label: 'Gerenciador de licenças',
      isTitle: false,
      icon: 'clock',
      link: '/gerenciar-licencas',
    },

    {},
    {},
    {},
    {
      key: 'logout',
      label: 'Logout',
      isTitle: false,
      icon: 'log-out',
      link: '/',
    },
  ];

  limparTabela() {
    this.licencaService.limparLicencas();
  }
}
