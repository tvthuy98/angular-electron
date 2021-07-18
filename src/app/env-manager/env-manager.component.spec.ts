import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvManagerComponent } from './env-manager.component';

describe('EnvManagerComponent', () => {
  let component: EnvManagerComponent;
  let fixture: ComponentFixture<EnvManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
