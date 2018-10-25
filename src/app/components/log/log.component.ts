import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LogService } from '@services';
import { Server } from '@models';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  form: FormGroup;
  servers: Server[];
  logTypes: string[];
  following: boolean;
  fowlloSubscriptions: Subscription[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private logService: LogService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Build form
    this.form = this.fb.group({
      serverSelect: ''
    })
    for (let logType of this.logService.logTypes) {
      this.form.addControl(logType, this.fb.control(true));
    }

    // Get list of servers and log types
    this.servers = this.logService.servers;
    this.logTypes = this.logService.logTypes;

    // Set server name
    const serverName = this.route.snapshot.paramMap.get('serverName');
    this.selectedServer = this.servers.find(server => serverName == server.name);

    // Init the log content
    this.getLog();
  }

  get selectedServer() {
    return this.form.get('serverSelect').value as Server;
  }

  set selectedServer(newServer) {
    this.form.get('serverSelect').setValue(newServer);
  }

  get flags() {
    const flags = [];
    for (let flag in this.form.value) {
      if (this.form.value[flag] === false) {
        flags.push(flag);
      }
    }
    return flags;
  }

  onChangeServer() {
    if (this.following) {
      this.unfollowLog();
    }
    this.getLog();
    this.router.navigate([`/log/${this.selectedServer.name}`]);
  }

  updateLogContent(serverName, newContent) {
    const logBox = document.getElementById(`log-box-${serverName}`)
    const logContent = document.getElementById(`log-content-${serverName}`);
    logContent.innerHTML = newContent;
    logBox.scrollTop = logBox.scrollHeight;
  }

  getLog() {
    for (let serverName of this.selectedServer.serverNames) {
      this.logService.getLog(serverName, this.flags).subscribe(res => {
        this.updateLogContent(serverName, res);

        // Notify user
        this.snackBar.open('Get Log Successfully', null, { duration: 3000 });
      });
    }
  }

  followLog() {
    this.following = true;
    this.fowlloSubscriptions = [];
    for (let serverName of this.selectedServer.serverNames) {
      const subscription = this.logService.followLog(serverName, this.flags).subscribe(res => {
        this.updateLogContent(serverName, res);
      });

      this.fowlloSubscriptions.push(subscription);
    }

    // Notify user
    this.snackBar.open('Following Log', null, { duration: 3000 });
  }

  unfollowLog() {
    for (let serverName of this.selectedServer.serverNames) {
      this.logService.stopLog(serverName).subscribe(res => {
        this.following = false;
        for (let subscription of this.fowlloSubscriptions) {
          subscription.unsubscribe();
        }

        // Notify user
        this.snackBar.open('Unfollow Successfully', null, { duration: 3000 });
      });
    }
  }

}
