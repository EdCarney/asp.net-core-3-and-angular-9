import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormEditComponent } from '../base.form-edit.component';

import { Country } from './country';

@Component({
  selector: "app-country-edit",
  templateUrl: "./country-edit.component.html",
  styleUrls: ["./country-edit.component.css"]
})
export class CountryEditComponent extends BaseFormEditComponent {

  // data model to update
  public country: Country;

  // the country ID; null if creating new
  public id?: number;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string) {
      super();
    }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      name: [
        '',
        Validators.required,
        this.isDuplicateField("name")
      ],
      iso2: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z]{2}')],
        this.isDuplicateField("iso2")
      ],
      iso3: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z]{3}')],
        this.isDuplicateField("iso3")
      ]
    });

    this.loadData()
  }

  public isDuplicateField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key:string]:any} | null> => {
      let params = new HttpParams()
        .set("countryId", this.id ? this.id : 0)
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);

      let url = this.baseUrl + "api/countries/checkFieldAlreadyExists";
      return this.http.post<boolean>(url, null, { params })
        .pipe(map(result => {
          return (result === true ? { isDuplicateField: true } : null);
        }));
    }
  }

  private loadData(): void {
    // get ID from ID parameter in URL
    this.id = +this.activatedRoute.snapshot.paramMap.get("id")!;

    if (this.creatingNewCountry()) {
      this.title = "Creating New Country";
      this.country = <Country>{};
    }
    else {
      // fetch city from server
      let url = this.baseUrl + "api/countries/" + this.id;
      this.http.get<Country>(url)
        .subscribe(result => {
          this.country = result;
          this.title = "Edit - " + this.country.name;
          this.form.patchValue(this.country);
        }, error => {
          console.error(error);
        });
    }

    let url = this.baseUrl + "api/country"
  }

  public onSubmit(): void {
    let country = this.country;

    country.name = this.form.get("name")?.value;
    country.iso2 = this.form.get("iso2")?.value;
    country.iso3 = this.form.get("iso3")?.value;

    if (this.creatingNewCountry()) {
      let url = this.baseUrl + "api/countries";
      this.http.post<Country>(url, country)
        .subscribe(result => {
          console.log("Country " + country.name + " has been created");
          this.navigateToMainCountryView();
        }, error => {
          console.error(error);
        })
    }
    else {
      // updating country
      let url = this.baseUrl + "api/countries/" + this.id;
      this.http.put<Country>(url, country)
        .subscribe(result => {
          console.log("Country " + country.name + " has been updated");
          this.navigateToMainCountryView();
        }, error => {
          console.error(error);
        })
    }
  }

  private creatingNewCountry(): boolean {
    if (this.id)
      return false;
    return true;
  }

  private navigateToMainCountryView(): void {
    this.router.navigate(['/countries']);
  }

  public showLoadingIcon(): boolean {
    if (!this.country && this.id)
      return true;
    return false;
  }

  public formFieldAlreadyExists(fieldName: string): string | null {
    let field = this.getControl(fieldName);
    if (field?.errors?.isDuplicateField) {
      return this.getFieldLabel(fieldName) + " already exists; please choose another";
    }
    return null;
  }
}
