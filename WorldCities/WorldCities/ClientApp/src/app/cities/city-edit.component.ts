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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string) { }

  ngOnInit() {
    this.form = new FormControl({
      name: new FormControl(),
      lat: new FormControl(),
      lon: new FormControl()
    });

    loadData() {
      // get ID from ID parameter in URL
      let id = +this.activatedRoute.snapshot.paramMap.get("id");

      // fetch city from server
      let url = this.baseUrl + "api/city/" + id;
      this.http.get<City>(url)
        .subscribe(result => {
          this.city = result;
          this.title = "Edit - " + this.city.name;
          this.form.patchValue(this.city);
        }, error => {
          console.error(error);
      });
    }

    onSubmit() {
      let city = this.city;

      city.name = this.form.get("name").value;
      city.lat = this.form.get("lat").value;
      city.lon = this.form.get("lon").value;

      // update city
      let url = this.baseUrl + "api/cities";
      this.http.put<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.name + " has been updated");

          // go back to cities view
          this.router.navigate(['/cities']);
        }, error => {
            console.error(error);
        })
    }
  }
}