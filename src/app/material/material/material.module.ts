import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { AppComponent } from '../../app.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppComponent,
    MatButtonModule,
    MatTabsModule,
  ],
  exports: [
    MatButtonModule,
    MatTabsModule,
  ]
})
export class MaterialModule { }
