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
  @ViewChild('logBox') logBox: ElementRef;
  @ViewChild('logContent') logContent: ElementRef;

  form: FormGroup;
  servers: Server[];
  logTypes: string[];
  following: boolean;
  fowlloSubscription: Subscription;

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
    this.serverSelect.setValue(serverName);

    // Init the log content
    this.getLog();
  }

  get serverSelect() {
    return this.form.get('serverSelect') as FormControl;
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
    this.router.navigate([`/log/${this.serverSelect.value}`]);
  }

  updateLogContent(newContent) {
    const logContent = <HTMLParagraphElement> this.logContent.nativeElement;
    const logBox = <HTMLElement> this.logBox.nativeElement
    logContent.innerHTML = newContent;
    logBox.scrollTop = logBox.scrollHeight;
  }

  getLog() {
    this.logService.getLog(this.serverSelect.value, this.flags).subscribe(res => {
      this.updateLogContent(res);

      // Notify user
      this.snackBar.open('Get Log Successfully', null, { duration: 3000 });
    });
  }

  followLog() {
    this.following = true;
    this.fowlloSubscription = this.logService.followLog(this.serverSelect.value, this.flags).subscribe(res => {
      this.updateLogContent(res);
    });

    // Notify user
    this.snackBar.open('Following Log', null, { duration: 3000 });
  }

  unfollowLog() {
    this.logService.stopLog(this.serverSelect.value).subscribe(res => {
      this.following = false;
      this.fowlloSubscription.unsubscribe();

      // Notify user
      this.snackBar.open('Unfollow Successfully', null, { duration: 3000 });
    });
  }

}
