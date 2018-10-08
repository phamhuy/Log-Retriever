import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatSliderModule} from '@angular/material/';
import {MatChipsModule} from '@angular/material/';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [
    MatPaginatorModule, MatCheckboxModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule,
    MatTableModule, MatDialogModule, MatInputModule, MatCardModule, MatAutocompleteModule, MatSelectModule, MatMenuModule,
    MatExpansionModule, MatGridListModule, MatSortModule, MatFormFieldModule, MatTabsModule, MatSnackBarModule, MatTooltipModule,
    MatDatepickerModule, MatNativeDateModule, MatChipsModule, MatRadioModule, MatSliderModule
  ],
  exports: [
    MatPaginatorModule, MatCheckboxModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule,
    MatTableModule, MatDialogModule, MatInputModule, MatCardModule, MatAutocompleteModule, MatSelectModule, MatMenuModule,
    MatExpansionModule, MatGridListModule, MatSortModule, MatFormFieldModule, MatTabsModule, MatSnackBarModule, MatTooltipModule,
    MatDatepickerModule, MatNativeDateModule, MatChipsModule, MatRadioModule, MatSliderModule
  ]
})
export class MaterialImports {
}
