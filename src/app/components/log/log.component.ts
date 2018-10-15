import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LogService } from '@services';
import { Server } from '@models';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  @ViewChild('logBox') logBox: ElementRef

  form: FormGroup;
  servers: Server[];
  logTypes: string[];
  following: boolean;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private logService: LogService
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

  getLog() {
    this.logService.getLog(this.serverSelect.value).subscribe(res => {
      this.logBox.nativeElement.innerHTML = res;
    });
  }

  followLog() {
    this.logService.followLog(this.serverSelect.value).subscribe(res => {
      this.following = true;
      this.logBox.nativeElement.innerHTML = res;
    });
  }

  unfollowLog() {
    this.logService.stopLog(this.serverSelect.value).subscribe(res => {
      this.following = false;
    });
  }

}
