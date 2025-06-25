import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ModalComponent,
  ModalModule,
  PageTitleModule,
  TableModule,
  CardModule,
  ButtonModule,
} from 'ds2u-lib';
import { LicencaService } from '../../services/licenca.service';
import { Subject, takeUntil } from 'rxjs';
import { Licenca } from '../../product-selector/models/licenca.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tabela-licencas',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PageTitleModule,
    ModalModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './tabela-licencas.component.html',
  styleUrl: './tabela-licencas.component.scss',
})
export class TabelaLicencasComponent {
  //mensagem de aviso quando o modal 'motivo' não puder se aberto por causa do status diferente de 'reprovado(a)'
  mensagemAviso: string | null = null;

  //essas variaveis permitem abrir os modais do html que estão utilizando #modalAttributtes e #modalMotivo
  @ViewChild('modalAttributes') modalAttributes!: ModalComponent;
  @ViewChild('modalMotivo') modalMotivo!: ModalComponent;

  // Guarda a licença que o usuário selecionou para exibir detalhes
  licencaSelecionada!: Licenca | null;

  // Dados da licença formatados para exibir no modal (campo, valor)
  attributesTableData: { campo: string; valor: any }[] = [];

  //array de licencas, guarda a lista que vem do backend por meio do LicencaService, lista usada pra exibir os dados no ds-table
  licencas: Licenca[] = [];

  currentPage = 1; //pagina atual
  itemsPerPage = 5; //exibe as 5 primeiras licenças na pagina antes do botão "carregar mais"

  // subject usado para controlar o unsubscribe e evitar vazamento de memoria
  private destroy$ = new Subject<void>();

  //injeção do serviço criado para licenças e do router para navegação
  constructor(
    private router: Router,
    private licencaService: LicencaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // incrição no observable do serviço que emite a lista de licenças
    this.licencaService.licencas$
      .pipe(takeUntil(this.destroy$)) // unsubscribe automático ao destruir componente(ir para outra tela)
      .subscribe((lista) => {
        this.licencas = lista; // atualiza a lista local de licenças
      });
    /*
      licencaService.licencas$ é um Observable com as licenças.

      .subscribe(...) escuta as atualizações e guarda a lista na variável licencas.

      takeUntil(this.destroy$) faz com que a assinatura se encerre quando o componente for destruído, evitando vazamento de memória.

      >>>Usar takeUntil com um Subject como destroy$ é uma boa prática recomendada pelo Angular para componentes que fazem subscribe().
       */
  }

  ngOnDestroy(): void {
    this.destroy$.next(); //      avisa que o componente foi destruído
    this.destroy$.complete(); //  finaliza o observable destroy$
  }

  // Colunas da tabela principal de licenças
  tableColumns = [
    { header: 'Status', field: 'status' },
    { header: 'ID', field: 'id' },
    { header: 'CNPJ', field: 'cnpjFaturamento' },
    { header: 'Produto', field: 'produto' },
    { header: 'Token', field: 'token' },
  ];

  // Menu de ações por linha
  dropdownActions = [
    { text: 'Atributos', action: 'atributos', icon: 'mdi mdi-file-tree' },
    {
      text: 'Motivo de reprovação',
      action: 'motivo',
      icon: 'mdi mdi-list-status',
    },
    {
      text: 'Copiar',
      action: 'copiar',
      icon: 'mdi mdi-content-copy',
    },
  ];

  // colunas do modal que mostra os atributos da licença
  attributesTableColumns = [
    { header: 'Campo', field: 'campo' },
    { header: 'Valor', field: 'valor' },
  ];

  // retorna um recorte da lista de licenças conforme pagina atual
  get pagedLicencas() {
    return this.licencas.slice(0, this.currentPage * this.itemsPerPage);
  }

  // Verifica se há mais dados para mostrar
  hasMoreData(): boolean {
    return this.currentPage * this.itemsPerPage < this.licencas.length;
  }

  // Carrega próxima "página" da tabela
  loadMore() {
    if (this.hasMoreData()) {
      this.currentPage++;
      console.log('Carregando página:', this.currentPage);
      console.log('Dados renderizados:', this.pagedLicencas);
    }
  }

  // Redireciona para seleção de produtos
  irParaSelecaoProdutos() {
    this.router.navigate(['/product-selector']);
  }

  // Abre modal de atributos
  openAtributesModal() {
    this.modalAttributes.open();
  }

  // condicionarDropdown(licenca: Licenca) {
  //   const status = licenca.status.toLowerCase();
  //   const motivoExiste = this.dropdownActions.some(
  //     (opcao) => opcao.action === 'motivo'
  //   );

  //   if (status === 'reprovada' || status === 'reprovado') {
  //     if (!motivoExiste) {
  //       this.dropdownActions.push({
  //         text: 'Motivo de reprovação',
  //         action: 'motivo',
  //         icon: 'mdi mdi-list-status',
  //       });
  //     }
  //   } else {
  //     if (motivoExiste) {
  //       this.dropdownActions = this.dropdownActions.filter(
  //         (opcao) => opcao.action !== 'motivo'
  //       );
  //     }
  //   }
  // }

  // Handler para ações da tabela
  handleAction(event: { action: string; row: any }) {
    const { action, row } = event; // extraindo propriedade de um objeto

    // // Atualiza as ações disponíveis conforme o status da linha
    // this.condicionarDropdown(row.status);

    if (action === 'atributos') {
      this.licencaSelecionada = row;

      // array de objetos { campo,valor } para exibir no modal de atributos
      const atributosArray = [
        // primeira os atributos fixos que poderão ser padrão de todas as licenças
        { campo: 'Status', valor: row.status },
        { campo: 'ID', valor: row.id },
        { campo: 'Produto', valor: row.produto },
        { campo: 'CNPJ Faturamento', valor: row.cnpjFaturamento },
        // Adiciona dinamicamente os campos correspondentes da licença selecionada
        ...Object.entries(row.dados || {}).map(([chave, valor]) => ({
          campo: this.formatarCampo(chave), // formata nomes das chaves para ficar mais amigável na exibição para o usuário
          valor: valor,
        })),
      ];

      // atualiza os dados que a tabela do modal vai mostrar
      this.attributesTableData = atributosArray;

      //abre o modal e exibe as informações da licença
      this.modalAttributes.open();
      //
      //
    } else if (action === 'motivo') {
      const status = row.status.toLowerCase();

      if (status !== 'reprovada' && status !== 'reprovado') {
        this.mostrarAviso();

        // // Oculta a mensagem depois de 3 segundos
        // setTimeout(() => {
        //   this.mensagemAviso = null;
        // }, 3000);

        return;
      }

      this.modalMotivo.open();

      //
    } else if (action === 'copiar') {
      // Copia produto e CNPJ
      const texto = `Produto: ${row.produto}\nCNPJ: ${row.cnpjFaturamento}`;
      navigator.clipboard
        .writeText(texto)
        .then(() => {
          console.log('Produto e CNPJ copiados com sucesso!');
        })
        .catch((err) => {
          console.error('Erro ao copiar:', err);
        });

      // 1° Armazena a licença da linha selecionada no serviço
      this.licencaService.setLicencaParaCopia(row);

      // 2° Redireciona para o fluxo de solicitação de nova licença
      this.router.navigate(['/product-selector']);
    }
  }

  mostrarAviso() {
    this.toastr.error(
      'Essa opção funciona apenas com licenças reprovadas',
      'Aviso'
    );
  }

  formatarCampo(chave: string): string {
    const nomesFormatados: Record<string, string> = {
      macPC: 'MAC do PC',
      macIHM: 'MAC da IHM',
      pedidoCompra: 'Nº do Pedido de Compras',
      // adicione mais chaves se quiser
    };
    return nomesFormatados[chave] || chave;
  }

  limparTabela() {
    this.licencaService.limparLicencas();
  }
}
