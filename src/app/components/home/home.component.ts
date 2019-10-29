import { Component, OnInit } from '@angular/core';
import { SynonymsGeneratorService } from '@services';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  synonyms: string[];

  constructor(
    private synonymsGeneratorService: SynonymsGeneratorService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.form = this.fb.group({
      gamerHandle: '',
    });
  }

  onSubmit() {
    const gamerHandle: string = this.form.get('gamerHandle').value;
    this.synonymsGeneratorService.generateSynonyms(gamerHandle).subscribe(res => {
      this.synonyms = res.synonyms;
      console.log(this.synonyms);
    });
  }

}
