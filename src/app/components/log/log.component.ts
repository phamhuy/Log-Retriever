import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LogService } from '@services';
import { Subscription } from 'rxjs';
import { Server } from '@models';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  @ViewChild('logBox') logBox: ElementRef

  form: FormGroup;
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

    // Init the log content
    this.getLog();
  }

  get serverSelect() {
    return this.form.get('serverSelect') as FormControl;
  }

  get follow() {
    return this.form.get('follow') as FormControl;
  }

  getLog() {
    if (this.follow.value) { // If follow is checked
      this.logSub = this.logService.followLog(this.serverSelect.value).subscribe(res => {
        this.logBox.nativeElement.innerHTML = res;
        this.logBox.nativeElement.focus();
        // console.log('length =', this.logBox.nativeElement.value.length);
      });
    } else { // If follow is unchecked
      if (this.logSub) { // If unchecking follow
        this.logSub.unsubscribe();
        this.logSub = null;
        this.logService.stopLog(this.serverSelect.value).subscribe(null);
      } else { // If changing the server only
        this.logService.getLog(this.serverSelect.value).subscribe(res => {
          this.logBox.nativeElement.innerHTML = res;
        });
      }
    }
  }

}
