import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LogService } from '@services';
import { MatCheckboxChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { Server } from '@models';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  form: FormGroup;
  log: string;
  logSub: Subscription;
  servers: Server[];
  logTypes: string[];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private logService: LogService
  ) { }

  ngOnInit() {
    // Build form
    this.form = this.fb.group({
      serverSelect: '',
      follow: false
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
    this.getLog();

    // Init the log content
    this.log = '';
    this.getLog();
  }

  get serverSelect() {
    return this.form.get('serverSelect') as FormControl;
  }

  get follow() {
    return this.form.get('follow') as FormControl;
  }

  onChangeFollow(change: MatCheckboxChange) {
    if (change.checked) {
      this.logSub = this.logService.getLog(this.serverSelect.value).subscribe(res => {
        this.log += res.toString();
      });
    } else {
      this.logSub.unsubscribe();
    }
  }

  getLog() {
    this.logService.getLog(this.serverSelect.value).subscribe(log => {
      this.log = log;
    });
  }

}
