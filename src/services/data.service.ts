import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private apiUrl = './assets/sample.json';
  private apiUrl = './assets/generated_items.json';

  constructor(private http: HttpClient) {}

  // Fetch data and transform it for echarts
  getPSampleData(): Observable<{ wbs: string[]; title?: string[] }> {
    return this.http.get<{ wbs: string; title?: string }[]>(this.apiUrl)
      .pipe(
        map(data => {
          const wbs = data.map(item => item.wbs);
          const title = data.map(item => item.title || ''); // Provide a default empty string if 'title' is missing
          return { wbs, title };
        })
      );
  }

  getqSampleData() {
    return this.http.get<[]>(this.apiUrl)
      .pipe(
        map(data => { // Provide a default empty string if 'title' is missing
          return data;
        })
      );
  }
}
