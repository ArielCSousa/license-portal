import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarLicencaComponent } from './solicitar-licenca.component';

describe('SolicitarLicencaComponent', () => {
  let component: SolicitarLicencaComponent;
  let fixture: ComponentFixture<SolicitarLicencaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarLicencaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarLicencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
