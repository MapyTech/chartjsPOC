import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesChartComponent } from '../components/sales-chart/sales-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartsModule } from "ng2-charts";
import * as echarts from "echarts";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DynamicChartComponent } from '../components/dynamic-chart/dynamic-chart.component';
import { DynamicQueryChartComponent } from '../components/dynamic-query-chart/dynamic-query-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SalesChartComponent,
    DynamicChartComponent,
    DynamicQueryChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule,
    ChartsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
