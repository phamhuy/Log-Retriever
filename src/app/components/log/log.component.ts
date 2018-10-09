import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServerService } from '@services';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  form: FormGroup

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private serverService: ServerService
  ) { }

  ngOnInit() {
    const serverName = this.route.snapshot.paramMap.get('serverName');
    this.form = this.fb.group({
      serverSelect: ''
    })
    this.serverSelect.setValue(serverName);

    console.log(this.serverSelect.value);
  }

  get serverSelect() {
    return this.form.get('serverSelect');
  }

  onSelectServer() {
    console.log(this.serverSelect.value);
  }

}
