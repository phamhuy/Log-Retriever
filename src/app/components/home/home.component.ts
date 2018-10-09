import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private logService: LogService
    ) { }

  ngOnInit() {
  }

  onClick(serverName: string) {
    this.router.navigate([`/log/${serverName}`]);
  }

}
