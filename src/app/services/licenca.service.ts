import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { nanoid } from 'nanoid'; // Importa nanoid para gerar IDs
import { Licenca } from '../product-selector/models/licenca.model';

@Injectable({
  providedIn: 'root',
})
export class LicencaService {
  // Lista de licenças que pode ser observada por outros componentes
  private licencasSubject = new BehaviorSubject<Licenca[]>([]);
  licencas$ = this.licencasSubject.asObservable(); // observable exposta publicamente

  // Guarda a cópia da licença temporariamente
  private copiaLicenca: Licenca | null = null;

  constructor() {
    this.carregarLicencasDoLocalStorage(); // carrega licenças ao iniciar o serviço
  }

  // Carrega as licenças salvas no localStorage
  private carregarLicencasDoLocalStorage() {
    const dados = localStorage.getItem('licencas');
    if (dados) {
      this.licencasSubject.next(JSON.parse(dados));
    }
  }

  // Salva as licenças no localStorage
  private salvarLicencasNoLocalStorage() {
    localStorage.setItem(
      'licencas',
      JSON.stringify(this.licencasSubject.value)
    );
  }

  // Método para adicionar nova licença na lista e salvar no localStorage
  adicionarLicenca(novaLicenca: Licenca) {
    //gerar id unico de 8 caracterer com o nanoid para cada licença
    const licencaComId: Licenca = { id: nanoid(8), ...novaLicenca };

    const atual = this.licencasSubject.value;
    this.licencasSubject.next([licencaComId, ...atual]); // adiciona no início da lista
    this.salvarLicencasNoLocalStorage(); // salva sempre que adiciona
  }

  //método para filtrar licencas pelo status
  filtrarLicencas(termo: string): Licenca[] {
    const termoNormalizado = termo.toLowerCase().trim();

    return this.licencasSubject.value.filter(
      (licenca) =>
        (licenca.id ? licenca.id.toString().toLowerCase() : '').includes(
          termoNormalizado
        ) ||
        licenca.id?.toString().includes(termoNormalizado) ||
        licenca.status.toLowerCase().includes(termoNormalizado) ||
        licenca.produto.toLowerCase().includes(termoNormalizado) ||
        Object.values(licenca.dados || {}).some((valor) =>
          valor.toLowerCase().includes(termoNormalizado)
        ) ||
        (licenca.pedidoCompra?.toLowerCase().includes(termoNormalizado) ??
          false)
    );
  }

  // Pega todas as licenças atuais
  obterLicencas(): Licenca[] {
    return this.licencasSubject.value;
  }

  // Limpa todas as licenças da memória e do localStorage
  limparLicencas() {
    this.licencasSubject.next([]);
    localStorage.removeItem('licencas');
  }

  // metodo para usar no condicionamento do dropdown
  filtrarPorStatus(status: string): Licenca[] {
    return this.licencasSubject.value.filter(
      (licenca) => licenca.status.toLowerCase() === status.toLowerCase()
    );
  }

  /*============ ↓ Métodos para cópia temporária ↓ =================*/

  // Armazena temporariamente uma licença que será copiada
  setLicencaParaCopia(licenca: Licenca) {
    this.copiaLicenca = { ...licenca }; // cria uma cópia para evitar mutações
  }

  // Retorna a licença copiada
  getLicencaParaCopia(): Licenca | null {
    return this.copiaLicenca;
  }

  // Limpa a licença copiada da memória
  limparLicencaTemporaria() {
    this.copiaLicenca = null;
  }
}
