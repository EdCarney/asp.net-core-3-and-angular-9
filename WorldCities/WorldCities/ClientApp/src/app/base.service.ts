import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseService {
  constructor (
    protected http: HttpClient,
    protected baseUrl: string) { }

    abstract getData<ApiResult>(
      pageIndex: number,
      pageSize: number,
      sortColumn: number,
      sortOrder: string,
      filterColumn: string,
      filterQuery: string): Observable<ApiResult>;

    abstract get<T>(id: number): Observable<T>;
    abstract put<T>(item: T): Observable<T>;
    abstract post<T>(item: T): Observable<T>;
}
