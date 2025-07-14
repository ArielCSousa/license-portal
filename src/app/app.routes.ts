import { Routes } from '@angular/router';
import { TabelaLicencasComponent } from './pages/tabela-licencas/tabela-licencas.component';

export const routes: Routes = [
  {
    path: 'licencas',
    loadComponent: () =>
      import('./pages/tabela-licencas/tabela-licencas.component').then(
        (m) => m.TabelaLicencasComponent
      ),
  },
  {
    path: 'solicitar-licenca',
    loadComponent: () =>
      import('./solicitar-licenca/solicitar-licenca.component').then(
        (m) => m.SolicitarLicencaComponent
      ),
  },
  {
    path: 'product-selector',
    loadComponent: () =>
      import('./product-selector/product-selector.component').then(
        (m) => m.ProductSelectorComponent
      ),
  },

  {
    path: '',
    redirectTo: 'licencas',
    pathMatch: 'full',
  },
];
