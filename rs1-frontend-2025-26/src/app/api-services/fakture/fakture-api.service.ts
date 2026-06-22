import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListFaktureResponse } from './fakture-api.models';

@Injectable({
  providedIn: 'root'
})
export class FaktureApiService {
  private readonly baseUrl = `${environment.apiUrl}/Fakture`;
  private http = inject(HttpClient);

  /**
   * GET /Fakture
   * List fakture with pagination.
   */
  list(pageNumber: number = 1, pageSize: number = 10): Observable<ListFaktureResponse> {
    const params = new HttpParams()
      .set('Paging.PageNumber', pageNumber.toString())
      .set('Paging.PageSize', pageSize.toString());

    return this.http.get<ListFaktureResponse>(this.baseUrl, { params });
  }
}
