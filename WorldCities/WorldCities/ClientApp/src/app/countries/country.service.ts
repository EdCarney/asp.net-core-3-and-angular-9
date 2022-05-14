import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Country } from "./country";
import { ApiResult } from "../apiResult";
import { BaseService, HasId } from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService {
  constructor(
    http: HttpClient,
    @Inject('BASE_URL') url: string) {
      super(http, url);
    }

  getData<T>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult<T>> {

      let url = this.baseUrl + "api/countries";
      let params: HttpParams = new HttpParams()
        .set("pageIndex", pageIndex)
        .set("pageSize", pageSize);

      if (sortColumn !== "") {
        params = params.set("sortColumn", sortColumn)
          .set("sortOrder", sortOrder);
      }

      if (filterColumn !== "") {
        params = params.set("filterColumn", filterColumn)
          .set("filterQuery", filterQuery);
      }

      return this.http.get<ApiResult<T>>(url, { params });
  }
  get<T>(id: number): Observable<T> {
    let url = this.baseUrl + "api/countries/" + id;
    return this.http.get<T>(url)
  }
  put<T>(item: T): Observable<T> {
    let country = item as unknown as Country;
    let url = this.baseUrl + "api/countries/" + country.id;
    return this.http.put<T>(url, country);
  }
  post<T>(item: T): Observable<T> {
    let url = this.baseUrl + "api/countries";
    return this.http.post<T>(url, item);
  }
}
