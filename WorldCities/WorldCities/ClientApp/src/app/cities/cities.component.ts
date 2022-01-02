import { Component, Inject, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';

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
  private readonly defaultFilterColumn: string = "name";
  private filterQuery: string = "";
  private filteringEventCount: number = 0;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData(event: Event | null = null): void {
    let pageEvent: PageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;

    if (event !== null) {
      this.filterQuery = (event?.target as HTMLInputElement).value;
      this.incrementFilterCount();
    }

    this.getData(pageEvent);
  }

  public getData(event: PageEvent): void {
    let url: string = this.baseUrl + "api/cities";
    let params: HttpParams = this.getHttpParams(event);

    this.http.get<ApiResult<City>>(url, { params })
      .subscribe(
        result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.cities = result.data;
          this.dataSource = new MatTableDataSource(this.cities);
          this.decrementFilterCount();
        },
        error => {
          console.error(error);
          this.decrementFilterCount()
        }
    );
  }

  private getHttpParams(pageEvent: PageEvent): HttpParams {
    let params: HttpParams = new HttpParams()
      .set("pageIndex", pageEvent.pageIndex.toString())
      .set("pageSize", pageEvent.pageSize.toString())

    if (this.sort) {
      params = params.set("sortColumn", this.sort.active)
        .set("sortOrder", this.sort.direction);
    }

    if (this.filterQuery !== "") {
      params = params.set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", this.filterQuery as string);
    }

    return params;
  }

  private citiesLoaded(): boolean {
    if (this.cities)
      return true;
    return false;
  }

  private incrementFilterCount(): void {
    ++this.filteringEventCount;
  }

  private decrementFilterCount(): void {
    this.filteringEventCount = this.filteringEventCount > 0 ? this.filteringEventCount - 1 : 0;
  }

  public showLoadingIcon(): boolean {
    return !this.citiesLoaded() || this.filteringEventCount > 0;
  }
}
