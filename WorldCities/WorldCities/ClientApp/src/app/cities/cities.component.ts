import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';

import { CityService } from './city.service';
import { City } from './city';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'countryName'];
  public cities: City[];
  public dataSource: MatTableDataSource<City>;

  private readonly defaultPageIndex: number = 0;
  private readonly defaultPageSize: number = 10;
  private readonly defaultFilterColumn: string = "name";
  public readonly defaultSortColumn: string = "";
  public readonly defaultSortOrder: SortDirection = "" as SortDirection;
  private filterQuery: string = "";
  private filteringEventCount: number = 0;

  constructor(
    private cityService: CityService) {}

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
    this.cityService.getData<City>(
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
