import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ButtonModule, FormModule } from 'ds2u-lib';
import { FormField } from '../product-selector/models/form-field.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LicencaService } from '../services/licenca.service';

@Component({
  selector: 'app-solicitar-licenca',
  templateUrl: './solicitar-licenca.component.html',
  styleUrls: ['./solicitar-licenca.component.scss'],
  standalone: true,
  imports: [CommonModule, FormModule, FormsModule, ButtonModule],
})
export class SolicitarLicencaComponent implements OnInit {
  constructor(private router: Router, private licencaService: LicencaService) {}

  // @Input() cnpjFaturamento: string = '';
  @Input() produto!: string; // usado apenas quando vem do card
  @Output() licencaEnviada = new EventEmitter<any>();

  @Input() cnpjFaturamento: string = ''; // agora pode vir como input
  @Input() dadosCopia: Record<string, string> = {}; // os dados preenchidos (formulário)

  // cnpjFaturamento: string = '';

  atributosDaLicenca: any[] = [];
  formulario: any = {};

  atributosPorProduto: Record<string, any[]> = {
    ATM: [
      { label: 'MAC do PC', campo: 'macPC', required: true, tipo: 'text' },
      {
        label: 'Número do Pedido de Compras(Opcional)',
        campo: 'pedidoCompra',
        required: false,
        tipo: 'text',
      },
    ],
    'CB+': [
      { label: 'MAC da IHM', campo: 'macIHM', required: true, tipo: 'text' },
      {
        label: 'Número do Pedido de Compras(Opcional)',
        campo: 'pedidoCompra',
        required: false,
        tipo: 'text',
      },
    ],
    'Decision Maker': [
      { label: 'MAC do PC', campo: 'macPC', required: true, tipo: 'text' },
      { label: 'MAC da IHM', campo: 'macIHM', required: true, tipo: 'text' },
      {
        label: 'Nº do Pedido de Compras (Opcional)',
        campo: 'pedidoCompra',
        required: false,
        tipo: 'text',
      },
    ],
  };

  ngOnInit(): void {
    this.atualizarAtributos();

    if (this.dadosCopia) {
      this.formulario = { ...this.dadosCopia };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['produto']) {
      this.atualizarAtributos();
      this.formulario = {}; // Limpa o formulário quando o produto muda
    }
  }

  private atualizarAtributos() {
    this.atributosDaLicenca = this.produto
      ? this.atributosPorProduto[this.produto] || []
      : [];
  }

  enviarLicenca() {
    const dadosLicenca = {
      status: 'Pendente',
      produto: this.produto,
      cnpjFaturamento: this.cnpjFaturamento,
      dados: { ...this.formulario },
    };

    this.licencaEnviada.emit(dadosLicenca);
    this.licencaService.adicionarLicenca(dadosLicenca); // adiciona a licenca na lista exibida na tabela
    this.router.navigate(['/licencas']); //redireciona para a tabela de licencas
  }
}
