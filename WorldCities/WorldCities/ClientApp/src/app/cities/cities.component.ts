import { Component, Inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from './city';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent {
  @ViewChild('paginator') paginator: MatPaginator;

  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities: City[];
  public dataSource: MatTableDataSource<City>;

  public citiesLoaded(): boolean {
    return this.cities && this.cities.length > 0;
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit() {
    this.http.get<City[]>(this.baseUrl + 'api/cities')
      .subscribe(
        result => {
          this.cities = result;
          this.dataSource = new MatTableDataSource(this.cities);
          this.dataSource.paginator = this.paginator;
        },
        error => console.error(error)
    );
  }
}
