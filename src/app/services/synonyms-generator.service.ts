import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SynonymsGeneratorService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  generateSynonyms(gamerHandle: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/${gamerHandle}/synonyms`);
  }

}
