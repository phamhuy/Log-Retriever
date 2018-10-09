import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '@services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private serverService: ServerService
    ) { }

  ngOnInit() {
  }

  onClick(serverName: string) {
    this.router.navigate([`/log/${serverName}`]);
  }

}
