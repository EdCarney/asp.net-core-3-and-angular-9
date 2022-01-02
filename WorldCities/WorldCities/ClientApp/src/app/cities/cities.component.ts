import { Component, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';

import { City } from './city';
import { ApiResult } from '../apiResult';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities: City[];
  public dataSource: MatTableDataSource<City>;

  private readonly defaultPageIndex: number = 0;
  private readonly defaultPageSize: number = 10;
  public readonly defaultSortColumn: string = "";
  public readonly defaultSortOrder: SortDirection = "" as SortDirection;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData(): void {
    let pageEvent: PageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  public getData(event: PageEvent): void {
    let url: string = this.baseUrl + "api/cities";
    let params: HttpParams = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", this.sort ? this.sort.active : this.defaultSortColumn)
      .set("sortOrder", this.sort ? this.sort.direction : this.defaultSortOrder);

    this.http.get<ApiResult<City>>(url, { params })
      .subscribe(
        result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.cities = result.data;
          this.dataSource = new MatTableDataSource(this.cities);
        },
        error => console.error(error)
    );
  }

  public citiesLoaded(): boolean {
    return this.cities && this.cities.length > 0;
  }
}
