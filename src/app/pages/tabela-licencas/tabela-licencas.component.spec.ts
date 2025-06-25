import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLicencasComponent } from './tabela-licencas.component';

describe('TabelaLicencasComponent', () => {
  let component: TabelaLicencasComponent;
  let fixture: ComponentFixture<TabelaLicencasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaLicencasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaLicencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
