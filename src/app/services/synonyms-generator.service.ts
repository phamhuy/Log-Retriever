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
    const body = {
      gamerHandle: gamerHandle
    }
    return this.http.post(`${this.baseUrl}/synonyms`, body);
  }

}
