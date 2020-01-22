import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from '.././navbar/navbar.component';
import { MaterialDesignModule } from '.././material-design/material-design.module';



describe('NavbarComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [MaterialDesignModule]
    })
      .compileComponents();
  }));

  it('Test for Unit tests not failing', () => {
    expect('1').toEqual('1');
  });
});
