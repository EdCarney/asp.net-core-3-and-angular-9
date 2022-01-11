import { Component, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';

import { Country } from './country';
import { ApiResult } from '../apiResult';

@Component({
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.css"]
})
export class CountriesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totalCities'];
  public countries: Country[];
  public dataSource: MatTableDataSource<Country>;

  private readonly defaultPageIndex: number = 0;
  private readonly defaultPageSize: number = 10;
  private readonly defaultFilterColumn: string = "name";
  public readonly defaultSortColumn: string = "";
  public readonly defaultSortOrder: SortDirection = "" as SortDirection;
  private filterQuery: string = "";
  private filteringEventCount: number = 0;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

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
    let url: string = this.baseUrl + "api/countries";
    let params: HttpParams = this.getHttpParams(event);

    this.http.get<ApiResult<Country>>(url, { params })
      .subscribe(
        result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.countries = result.data;
          this.dataSource = new MatTableDataSource(this.countries);
          this.decrementFilterCount();
        },
        error => {
          console.error(error);
          this.decrementFilterCount();
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

  private countriesLoaded(): boolean {
    if (this.countries)
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
    return !this.countriesLoaded() || this.filteringEventCount > 0;
  }
}
