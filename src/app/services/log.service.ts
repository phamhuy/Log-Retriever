import { Injectable } from '@angular/core';
import { Server } from '@models';
import { Observable, of, from } from 'rxjs';
import { delay, concatMap } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  servers: Server[];
  logTypes: string[];
  baseUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {
    this.servers = [
      { name: 'app-sti', url: '' },
      { name: 'app-sti2', url: '' },
      { name: 'qa-sti', url: '' }
    ]

    this.logTypes = [
      'INFO',
      'DEBUG',
      'WARN',
      'ERROR'
    ]
  }

  getLog(serverName): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/getLog/${serverName}`, {responseType: 'text'});
  }

  followLog(serverName): Observable<string> {
    let s = [];
    for (let i = 0; i < 100; i++) {
      s.push(i);
    }

    return from(s).pipe(
      concatMap(val => of(val).pipe(delay(1000)))
    );
    // return this.http.get(`${this.baseUrl}/followLog/${serverName}`);
  }
}
