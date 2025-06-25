import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, PageTitleModule } from 'ds2u-lib';
import { SolicitarLicencaComponent } from '../solicitar-licenca/solicitar-licenca.component';
import { LicencaService } from '../services/licenca.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-selector',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SolicitarLicencaComponent,
    ButtonModule,
    FormsModule,
    PageTitleModule,
  ],
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss'],
})
export class ProductSelectorComponent implements OnInit {
  produtos = ['ATM', 'CB+', 'Decision Maker'];
  // produtos: string[] = ['ATM', 'CB+', 'Decision Maker'];
  produtoSelecionado: string | null = null;
  cnpjFaturamento: string = '';
  dadosCopia: Record<string, string> = {};

  constructor(private licencaService: LicencaService) {}

  ngOnInit(): void {
    const copia = this.licencaService.getLicencaParaCopia();
    if (copia) {
      this.produtoSelecionado = copia.produto;
      this.cnpjFaturamento = copia.cnpjFaturamento;
      this.dadosCopia = copia.dados;

      this.licencaService.limparLicencaTemporaria();
    }
  }

  onProdutoChange() {
    // Limpa o formulário quando o produto é alterado
    this.produtoSelecionado = this.produtoSelecionado;
  }

  selecionarProduto(produto: string) {
    this.produtoSelecionado = produto;
  }

  handleLicencaEnviada(dados: any) {
    console.log('Licença enviada:', dados);
  }
}
