import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { City } from './city';

@Component({
  selector: "app-city-edit",
  templateUrl: "./city-edit.component.html",
  styleUrls: ["./city-edit.component.css"]
})
export class CityEditComponent {
  // view title
  public title: string;

  // form model
  public form: FormGroup;

  // data model to update
  public city: City;

  // the city ID; null if creating new
  public id?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string) { }

  public ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(),
      lat: new FormControl(),
      lon: new FormControl()
    });
    this.loadData();
  }

  public loadData() {
    // get ID from ID parameter in URL
    this.id = +this.activatedRoute.snapshot.paramMap.get("id")!;

    console.log(this.id);

    if (this.creatingNewCity()) {
      this.title = "Creating New City";
      this.city = <City>{};
    }
    else {
      // fetch city from server
      let url = this.baseUrl + "api/cities/" + this.id;
      this.http.get<City>(url)
        .subscribe(result => {
          this.city = result;
          this.title = "Edit - " + this.city.name;
          this.form.patchValue(this.city);
        }, error => {
          console.error(error);
        });
    }
  }

  public onSubmit() {
    let city = this.city;

    city.name = this.form.get("name")?.value;
    city.lat = this.form.get("lat")?.value;
    city.lon = this.form.get("lon")?.value;

    if (this.creatingNewCity()) {
      let url = this.baseUrl + "api/cities";
      this.http.post<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.name + " has been created");
          this.navigateToMainCityView();
        }, error => {
          console.error(error);
        });
    }
    else {
      // updating city
      let url = this.baseUrl + "api/cities/" + city.id;
      this.http.put<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.name + " has been updated");
          this.navigateToMainCityView();
        }, error => {
          console.error(error);
        });
    }
  }

  private creatingNewCity(): boolean {
    if (this.id)
      return false;
    return true;
  }

  private navigateToMainCityView(): void {
    this.router.navigate(['/cities']);
  }

  public showLoadingIcon(): boolean {
    if (!this.city && this.id)
      return true;
    return false;
  }
}
