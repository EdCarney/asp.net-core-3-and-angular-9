import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResult } from './apiResult';

@Injectable()
export abstract class BaseService {
  constructor (
    protected http: HttpClient,
    @Inject('baseUrl') protected baseUrl: string) { }

    public abstract getData<T>(
      pageIndex: number,
      pageSize: number,
      sortColumn: string,
      sortOrder: string,
      filterColumn: string,
      filterQuery: string): Observable<ApiResult<T>>;

    public abstract get<T>(id: number): Observable<T>;
    public abstract put<T>(item: T): Observable<T>;
    public abstract post<T>(item: T): Observable<T>;
}

export interface HasId {
  id: number;
}
