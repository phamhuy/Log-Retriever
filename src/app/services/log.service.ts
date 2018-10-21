import { Injectable } from '@angular/core';
import { Server } from '@models';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  servers: Server[];
  logTypes: string[];
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {
    this.servers = [
      { name: 'app-sti', url: '' },
      { name: 'app-sti2', url: '' },
      { name: 'qa-sti', url: '' },
      {name: 'localhost', url: ''}
    ]

    this.logTypes = [
      'INFO',
      'DEBUG',
      'WARN',
      'ERROR'
    ]
  }

  getLog(serverName, flags: string[]): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/getLog/${serverName}/${flags}`, {responseType: 'text'});
  }

  followLog(serverName, flags: string[]): Observable<any> {
    const observer = new Subject();
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
      if (xhttp.status == 200) {
        observer.next(xhttp.responseText);
      }
    }
    xhttp.open('GET', `${this.baseUrl}/api/followLog/${serverName}/${flags}`);
    xhttp.send();

    return observer.asObservable();
  }

  stopLog(serverName): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/stopLog/${serverName}`);
  }
}
