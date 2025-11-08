import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificacionesComponent } from './admin-notificaciones.component';

describe('AdminNotificacionesComponent', () => {
  let component: AdminNotificacionesComponent;
  let fixture: ComponentFixture<AdminNotificacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNotificacionesComponent]
    });
    fixture = TestBed.createComponent(AdminNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
