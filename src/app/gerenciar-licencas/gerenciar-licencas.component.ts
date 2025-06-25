import { Component } from '@angular/core';
import { LicencaService } from '../services/licenca.service';
import { FormsModule } from '@angular/forms';
import { TableModule, PageTitleModule } from 'ds2u-lib';
import { CommonModule } from '@angular/common';
import { Licenca } from '../product-selector/models/licenca.model';

@Component({
  selector: 'app-gerenciar-licencas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, PageTitleModule],
  templateUrl: './gerenciar-licencas.component.html',
  styleUrl: './gerenciar-licencas.component.scss',
})
export class GerenciarLicencasComponent {
  termoBusca: string = '';
  licencasFiltradas: Licenca[] = [];

  tableColumns = [
    { header: 'Status', field: 'status', class: 'statusClasse' },
    { header: 'ID', field: 'id' },
    { header: 'CNPJ', field: 'cnpjFaturamento' },
    { header: 'Produto', field: 'produto' },
    { header: 'Token', field: 'token' },
    { header: 'Pedido de Compra', field: 'pedidoCompra' },
  ];

  constructor(private licencaService: LicencaService) {}

  filtrarLicencas() {
    const termo = this.termoBusca.toLocaleLowerCase().trim();

    if (termo === '') {
      this.licencasFiltradas = [];
      return;
    }

    this.licencasFiltradas = this.licencaService.filtrarLicencas(termo);
  }

  limparBusca() {
    this.termoBusca = '';
    this.filtrarLicencas();
  }
}
