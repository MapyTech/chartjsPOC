import { Component, OnInit, Query } from '@angular/core';
import { DataService } from 'src/services/data.service';
import * as echarts from 'echarts';
import { EChartOption } from "echarts";
import { Observable, of, Subject } from "rxjs";
import * as moment from "moment";
import { map, switchMap } from 'rxjs/operators';

interface ChartData {
  xAxisData: string[],
  seriesData: number[][],
  seriesLabels: string[]
}

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss']
})
export class SalesChartComponent implements OnInit {
  chartOption: any;
  isLoading = true;
  resultSet;

  qisLoading = true;
  queryedData: any;
  qchartData: any[] = [];
  qchartLabels: string[] = [];
  qchartOptions: any;
  qchartColors = [{ backgroundColor: ['#42A5F5', '#66BB6A'] }];
  qchartType: string = 'bar';

  sampleData = [
    {
      wbs: "1",
      title: "Program : Quantum Leap",
      phase: "Program : Quantum Leap",
      workpackage: "",
      parentphase: "",
      parentworkpackage: "",
      plannedStartDate: "2024-04-29",
      plannedEndDate: "2026-10-30",
      actualStartDate: "2024-04-29",
      actualEndDate: "",
      status: "",
      plannedmilestonepercentage: 93.39,
      actualmilestonepercentage: 33.02103598686316,
      plannedcustomermilestonepercentage: 0,
      actualcustomermilestonepercentage: 0,
      task_type: "Program/Project",
      activePercentage: 36.76929
    },
    {
      wbs: "1.1",
      title: "Wave 0 - Global Prepare",
      phase: "",
      workpackage: "Wave 0 - Global Prepare",
      parentphase: "Program : Quantum Leap",
      parentworkpackage: "Wave 0 - Global Prepare",
      plannedStartDate: "2024-04-29",
      plannedEndDate: "2024-12-18",
      actualStartDate: "2024-04-29",
      actualEndDate: "",
      status: "",
      plannedmilestonepercentage: 1.819,
      actualmilestonepercentage: 1.819,
      plannedcustomermilestonepercentage: 0,
      actualcustomermilestonepercentage: 0,
      task_type: "Wave",
      activePercentage: 100
    },
    // additional items...
  ];

  responseData;

  // Filter options and selected values
  taskTypeOptions: string[] = ['Program/Project', 'Wave', 'Phase', 'Milestone', 'Activity'];
  statusOptions: string[] = ['Completed', 'In progress', 'Pending', 'Not Started'];
  selectedTaskType: string = 'Program/Project';
  selectedStatus: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getPSampleData().subscribe(data => {
      // console.log(data,"lllll");
      this.resultSet =  data
      this.chartLabels = data.wbs
      this.resultChanged(this.resultSet)
      
      this.chartOption = {
        title: {
          text: 'Chart'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: data.wbs
        },
        yAxis: {
          type: 'value',
          data: data.title
        },
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: data.wbs
          }
        ]
      };
      this.isLoading = false;

      this.majorCategoriesByGender = this.formatBarChartData()
    });

    // this.querySubject = new Subject();
    // this.resultChanged = this.resultChanged.bind(this);
    // this.cubejs
    //   .watch(this.querySubject)
    //   .subscribe(this.resultChanged, (err) => console.log("HTTP Error", err));

    // this.querySubject.next(this.query);

    // this.resultChanged(this.resultSet)

    this.dataService.getqSampleData().subscribe(data => {
      // console.log(data,"kkkkkkkkkkkkkk");
      this.sampleData = data
      this.responseData = data
    

    of(this.sampleData)
      .pipe(
        map(data =>
          // Query operation: filter or map the data based on your criteria
          // data.filter(item => item.task_type === 'Program/Project')
          data.filter(item => item.status === '')
        )
      )
      .subscribe(result => {
        // Assign the queried data to the queryedData variable
        this.queryedData = result;
        console.log('Queried Data:', this.queryedData);
      });
      this.loadChartData(this.queryedData);  
    });
  }

  applyFilters() {
    this.qisLoading = true
    of(this.responseData)
      .pipe(
        map(data =>
          // data.filter(item => item.status === this.selectedStatus)
          // data.filter(item => item.task_type === this.selectedTaskType)
          data.filter(item =>
            (item.task_type === this.selectedTaskType) ||
            (item.status === this.selectedStatus)
          )
        )
      )
      .subscribe(result => {
        this.queryedData = result;
        this.loadChartData(result);
        this.qisLoading = false;
      });
  }

  loadChartData(data: any[]) {
    this.qchartLabels = data.map(item => `Plan${item.plannedmilestonepercentage} vs Actual ${item.actualmilestonepercentage}`);
    this.qchartData = [
      {
        label: 'Planned',
        data: data.map(item => item.plannedmilestonepercentage)
      },
      {
        label: 'Actual',
        data: data.map(item => item.actualmilestonepercentage)
      }
    ];

    this.qchartOptions = {
      responsive: true,
      scales: {
        xAxes: [{ scaleLabel: { display: true, labelString: 'Projects' } }],
        yAxes: [{ scaleLabel: { display: true, labelString: 'Percentage' }, ticks: { beginAtZero: true } }]
      },
      legend: { position: 'top' },
      title: { display: true, text: 'Planned vs Actual Milestones' }
    };

    this.qisLoading = false;
  }

  public chartData;
  public chartLabels;
  public chartOptions: any = {
    legend: {
      position: "bottom",
      align: "start"
    }
  };

  majorCategoriesByGender;

  // majorCategoriesByGender$ = this.getChartOptions(
  //   {
  //     'measures': ['WomenStem.women', 'WomenStem.men', 'WomenStem.total'],
  //     'dimensions': ['WomenStem.majorCategory']
  //   },
  //   'Graduates per Major Category by Gender',
  //   'Major Categories',
  //   'Number of Graduates'
  // );

  // private getChartOptions(query: any, title = '', xAxisLabel = '', yAxisLabel = '') {
  //    this.chartOptions = this.formatBarChartData(title, xAxisLabel, yAxisLabel)
  //    return this.chartOptions
  // }

  chartType = 'bar'

  public chartColors: any = [
    {
      borderColor: "#feebe2",
      backgroundColor: "#feebe2"
    },
    {
      borderColor: "#fbb4b9",
      backgroundColor: "#fbb4b9"
    },
    {
      borderColor: "#f768a1",
      backgroundColor: "#f768a1"
    },
    {
      borderColor: "#ae017e",
      backgroundColor: "#ae017e"
    }
  ];

  private querySubject;
  private ready = false;

  private dateFormatter = ({ x }) => moment(x).format("MMMM");

  //Transform data for visualization
  commonSetup(resultSet) {
    // this.chartLabels = resultSet.chartPivot().map(this.dateFormatter);
    // this.chartData = resultSet.seriesNames().map(({ key, title }) => ({
    //   data: resultSet.chartPivot().map((element) => element[key]),
    //   label: title
    // }));
    // this.chartLabels = [
    //   "xlabeldemo","xlabeldemo","xlabeldemo"
    // ]
    
    this.chartData = [
      {
      "backgroundColor"
      : 
      "#feebe2",
      "borderColor"
      : 
      "#feebe2",
        data: [
        40000
        ],
        label
        : 
        "Orders Count"
      }
    ]
  }

  resultChanged(resultSet) {

    resultSet = {
      "loadResponse": {
          "query": {
              "timeDimensions": [],
              "timezone": "UTC",
              "dimensions": [],
              "limit": 10000,
              "measures": [
                  "orders.count"
              ],
              "filters": [],
              "rowLimit": 10000
          },
          "data": [
              {
                  "orders.count": "40000"
              }
          ],
          "lastRefreshTime": "2024-11-04T08:38:48.000Z",
          "annotation": {
              "measures": {
                  "orders.count": {
                      "title": "Orders Count",
                      "shortTitle": "Count",
                      "type": "number",
                      "drillMembers": [],
                      "drillMembersGrouped": {
                          "measures": [],
                          "dimensions": []
                      }
                  }
              },
              "dimensions": {},
              "segments": {},
              "timeDimensions": {}
          },
          "dataSource": "default",
          "dbType": "duckdb",
          "extDbType": "cubestore",
          "external": true,
          "slowQuery": false,
          "total": null
      },
      "backwardCompatibleData": [
          {
              "orders.count": "40000"
          }
      ]
    }

    this.commonSetup(resultSet);
    this.ready = true;
  }

  private formatBarChartData(title = '', xAxisLabel = '', yAxisLabel = '') {

    let chartData = this.chartOption

    let options: EChartOption = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        title: { text: title, show: true },
        xAxis: { type: 'category', data: chartData.xAxis.data, name: chartData.xAxis.data, axisTick: { alignWithLabel: true } },
        series: [
          // {
          //   name: 'Sales',
          //   type: 'bar',
          //   data: chartData.xAxis.data
          // }
        ],
        yAxis: { type: 'value', name: chartData.xAxis.data||"" },
        // legend: { data: chartData.seriesLabels }
        legend: {
          // position: "bottom",
          align: "auto"
        }
    };

    chartData.series.forEach((series, index) => {
        if (options.series && Array.isArray(options.series)) {
        options.series.push({
            type: 'bar',
            data:  chartData.series[index].data,
            name: chartData.series[index].name,
            label: { show: true, rotate: 45, align: 'right', verticalAlign: 'middle', position: 'insideBottom', distance: 15, formatter: '{a} → {c}', fontSize: 14 }
        });
        }
    });

    return options
    
  }
}

