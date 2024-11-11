import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueryChartComponent } from './dynamic-query-chart.component';

describe('DynamicQueryChartComponent', () => {
  let component: DynamicQueryChartComponent;
  let fixture: ComponentFixture<DynamicQueryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQueryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQueryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
