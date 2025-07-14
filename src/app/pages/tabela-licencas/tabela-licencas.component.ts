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
  // mensagemAviso: string | null = null;
  mensagemModalStatus: string = '';

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
    this.licencaService.licencas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lista) => {
        this.licencas = lista.map((licenca) => {
          const statusLower = licenca.status.toLowerCase();
          let emoji = '';
          if (statusLower.includes('aprovado')) emoji = '🟢';
          else if (statusLower.includes('pendente')) emoji = '🟡';
          else if (statusLower.includes('reprovado')) emoji = '🔴';

          return {
            ...licenca,
            statusOriginal: licenca.status, // mantém o status original para lógica
            statusExibicao: `${emoji} ${licenca.status}`, // campo novo para mostrar na tabela
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); //      avisa que o componente foi destruído
    this.destroy$.complete(); //  finaliza o observable destroy$
  }

  // Colunas da tabela principal de licenças
  tableColumns = [
    { header: 'Status', field: 'statusExibicao' },
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

      if (status === 'reprovada' || status === 'reprovado') {
        this.mensagemModalStatus =
          'Motivo da reprovação: ' +
          (row.dados?.motivo || 'Motivo não informado');
        this.modalMotivo.open();
        return;
      }

      if (status === 'pendente') {
        this.mensagemModalStatus = '⏳ Aguarde análise da sua solicitação.';
      } else if (status === 'aprovada' || status === 'aprovado') {
        this.mensagemModalStatus =
          '✔️ Opção disponível apenas para licenças reprovadas.';
      } else {
        this.mensagemModalStatus = 'Status desconhecido.';
      }

      this.modalMotivo.open();
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
