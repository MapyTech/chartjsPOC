import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

interface Condition {
  field: string;
  operator: string;
  value: any;
}

@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.scss']
})
export class DynamicChartComponent implements OnInit {
  fields = ['wbs', 'title', 'status', 'plannedmilestonepercentage', 'actualmilestonepercentage'];
  operators = ['==', '!=', '>', '<', '>=', '<='];
  chartTypes = ['bar', 'line', 'pie'];
  conditions: Condition[] = [{ field: '', operator: '==', value: '' }];
  chartType: string = 'bar';
  viewMode: 'chart' | 'table' = 'chart';
  data: any[] = [];
  filteredData: any[] = [];
  chartOptions: any = {}; // ECharts options

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getqSampleData().subscribe((data) => {
      this.data = data;
      // console.log(data,"hhhhhhhhhhhhhhhhhhh");
      
      this.runQuery();
    });
  }

  addCondition() {
    this.conditions.push({ field: '', operator: '==', value: '' });
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  runQuery() {
    this.filteredData = this.data.filter(item => 
      this.conditions.every(cond => this.applyCondition(item, cond))
    );
    this.updateChartOptions();
  }

  applyCondition(item: any, cond: Condition): boolean {
    const { field, operator, value } = cond;
    switch (operator) {
      case '==': return item[field] == value;
      case '!=': return item[field] != value;
      case '>': return item[field] > value;
      case '<': return item[field] < value;
      case '>=': return item[field] >= value;
      case '<=': return item[field] <= value;
      default: return false;
    }
  }

  updateChartOptions() {
    const labels = this.filteredData.map(item => item.title || 'no title');    
    const dataValues = this.filteredData.map(item => item.plannedmilestonepercentage);
    
    this.chartOptions = {
      xAxis: {
        type: 'category',
        labels:labels,
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: dataValues,
          type: this.chartType
        }
      ]
    };
  }
}
