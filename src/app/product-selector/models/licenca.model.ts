// Estrutura da licença
export interface Licenca {
  id?: string | number;
  status: string;
  produto: string;
  cnpjFaturamento: string;
  dados: Record<string, string>; // aqui ficam os campos dinâmicos da licença
  pedidoCompra?: string;
}
