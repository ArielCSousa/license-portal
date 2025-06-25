import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  topBarProfileOptions: any[] = [
    {
      label: 'Logout',
      icon: 'fe-log-out',
      // action: () => this.logout(),
    },
  ];

  loggedInUserInfo: any = {
    avatar: '',
  };

  menuItems!: any[];

  ngOnInit(): void {
    this.buildMenu();
  }

  buildMenu() {
    this.menuItems = [
      {
        key: 'license-generator',
        label: 'Gerador de licenças',
        isTitle: false,
        icon: 'clipboard',
        link: '/license-generator',
      },
      {
        key: 'request',
        label: 'Suas licenças',
        isTitle: false,
        icon: 'clock',
        link: '/request',
      },
      {
        key: 'licenses',
        label: 'Gerenciador de licenças',
        isTitle: false,
        icon: 'clock',
        link: '/licenses',
      },
      {
        key: 'register',
        label: 'Cadastros',
        isTitle: true,
      },
      {
        key: 'product',
        label: 'Produtos',
        isTitle: false,
        icon: 'align-center',
        collapsed: true,
        children: [
          {
            key: 'product-list',
            label: 'Lista de produtos',
            parentKey: 'product',
            link: '/product',
          },
          {
            key: 'product-form',
            label: 'Cadastro de produtos',
            parentKey: 'product',
            link: '/product/new',
          },
        ],
      },
      {
        key: 'company',
        label: 'Company',
        isTitle: false,
        icon: 'briefcase',
        collapsed: true,
        children: [
          {
            key: 'company-list',
            label: 'Lista de empresas',
            parentKey: 'company',
            link: '/company',
          },
          {
            key: 'company-form',
            label: 'Cadastro de empresas',
            parentKey: 'company',
            link: '/company/new',
          },
        ],
      },
      {
        key: 'template',
        label: 'Templates',
        isTitle: false,
        icon: 'layout',
        collapsed: true,
        children: [
          {
            key: 'template-list',
            label: 'Lista de templates',
            parentKey: 'template',
            link: '/template',
          },
          {
            key: 'template-form',
            label: 'Cadastro de templates',
            parentKey: 'template',
            link: '/template/new',
          },
        ],
      },
    ];
  }

  // logout() {
  //   this.userService.logout();
  //   this.router.navigate(['/'], { replaceUrl: true });
  // }
}
