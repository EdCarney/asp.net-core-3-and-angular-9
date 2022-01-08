import { Component, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Country } from '../countries/country';
import { City } from './city';
import { ApiResult } from '../apiResult';

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

  // list of countries for city
  public countries: Country[];

  // the city ID; null if creating new
  public id?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string) { }

  public ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDuplicateCity());
    this.loadCity();
    this.loadCountries();
  }

  private isDuplicateCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key:string]:any} | null> => {

      let city = <City> {};
      city.id = this.id ? this.id : 0;
      city.name = this.form.get("name")?.value;
      city.lat = this.form.get("lat")?.value;
      city.lon = this.form.get("lon")?.value;
      city.countryId = this.form.get("countryId")?.value;

      let url = this.baseUrl + "api/cities/checkAlreadyExists";
      return this.http.post<boolean>(url, city)
        .pipe(map(result => {
          return (result === true ? { isDuplicateCity: true } : null);
        }))
    }
  }

  public loadCity(): void {
    // get ID from ID parameter in URL
    this.id = +this.activatedRoute.snapshot.paramMap.get("id")!;

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

  private loadCountries(): void {
    let url = this.baseUrl + "api/countries";
    let params = new HttpParams()
      .set("pageSize", "10000")
      .set("sortColumn", "name")
      .set("sortOrder", "ASC");

    this.http.get<ApiResult<Country>>(url, { params })
      .subscribe(result => {
        this.countries = result.data;
      }, error => {
        console.error(error);
      })
  }

  public onSubmit() {
    let city = this.city;

    city.name = this.form.get("name")?.value;
    city.lat = +this.form.get("lat")?.value;
    city.lon = +this.form.get("lon")?.value;
    city.countryId = +this.form.get("countryId")?.value;

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

  public formFieldIsInvalid(fieldName: string): boolean {
      let field = this.form.get(fieldName);
      if (field?.invalid && (field?.dirty || field?.touched)) {
        return true;
      }
      return false;
  }

  public formFieldHasRequiredError(fieldName: string): boolean {
    let field = this.form.get(fieldName);
    if (field?.errors?.required)
      return true;
    return false;
  }

  public showDuplicateCityError() {
    if (this.form.invalid && this.form.errors?.isDuplicateCity)
      return true;
    return false;
  }
}
