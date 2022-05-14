import { Component, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';

import { CountryService } from './country.service';
import { Country } from './country';

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
    private countryService: CountryService) {}

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
    this.countryService.getData<Country>(
      event.pageIndex,
      event.pageSize,
      typeof this.sort === "undefined" ? "" : this.sort.active,
      typeof this.sort === "undefined" ? "" : this.sort.direction,
      this.defaultFilterColumn,
      this.filterQuery
    ).subscribe(
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
