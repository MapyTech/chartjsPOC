import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

interface Condition {
  field: string;
  operator: string;
  value: any;
}

@Component({
  selector: 'app-dynamic-query-chart',
  templateUrl: './dynamic-query-chart.component.html',
  styleUrls: ['./dynamic-query-chart.component.scss']
})
export class DynamicQueryChartComponent implements OnInit {
  fields = ['wbs', 'title', 'status', 'plannedmilestonepercentage', 'actualmilestonepercentage', 'task_type', 'activePercentage'];
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
    // Fetch the data from the backend (or simulate)
    this.dataService.getqSampleData().subscribe((data) => {
      this.data = data;
      this.runQuery(); // Run default query on load
    });
  }

  addCondition() {
    this.conditions.push({ field: '', operator: '==', value: '' });
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  runQuery() {
    const query = this.buildQuery();
    this.filteredData = this.applyQuery(query);
    this.updateChartOptions();
  }

  // Build query based on conditions
  buildQuery() {
    return this.conditions.map(cond => ({
      field: cond.field,
      operator: cond.operator,
      value: cond.value
    }));
  }

  // Apply query to filter data
  applyQuery(query: any[]) {
    return this.data.filter(item => 
      query.every(cond => this.applyCondition(item, cond))
    );
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

  // updateChartOptions() {
  //   const labels = this.filteredData.map(item => item.title || 'no title');
  //   const dataValues = this.filteredData.map(item => item.plannedmilestonepercentage);
    
  //   this.chartOptions = {
  //     xAxis: {
  //       type: 'category',
  //       data: labels
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [
  //       {
  //         data: dataValues,
  //         type: this.chartType
  //       }
  //     ]
  //   };
  // }

  updateChartOptions() {
    const labels = this.filteredData.map(item => item.title || 'no title');
    const dataValues = this.filteredData.map(item => ({
      name: item.title || 'no title',
      value: item.plannedmilestonepercentage
    }));
  
    if (this.chartType === 'pie') {
      // Pie chart configuration with labels near data
      this.chartOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: 'Planned Milestone Percentage',
            type: 'pie',
            radius: '55%',
            data: dataValues,
            label: {
              position: 'outside', // Position label outside the pie slice
              formatter: '{b}: {c} ({d}%)', // Display name, value, and percentage
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            }
          }
        ]
      };
    } else {
      // Bar and line chart configuration
      this.chartOptions = {
        xAxis: {
          type: 'category',
          data: labels
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.filteredData.map(item => item.plannedmilestonepercentage),
            type: this.chartType
          }
        ]
      };
    }
  }
  
}
