import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarLicencasComponent } from './gerenciar-licencas.component';

describe('GerenciarLicencasComponent', () => {
  let component: GerenciarLicencasComponent;
  let fixture: ComponentFixture<GerenciarLicencasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarLicencasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarLicencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
