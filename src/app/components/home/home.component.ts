import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services';
import { Server } from '@models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  servers: Server[];

  constructor(
    private router: Router,
    private logService: LogService
    ) { }

  ngOnInit() {
    this.servers = this.logService.servers;
  }

  onClick(serverName: string) {
    this.router.navigate([`/log/${serverName}`]);
  }

}
