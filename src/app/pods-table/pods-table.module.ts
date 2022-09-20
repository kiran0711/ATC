import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodsTableComponent } from "./pods-table.component";



@NgModule({
  declarations: [PodsTableComponent],
  imports: [
    CommonModule
  ],
  exports:[PodsTableComponent]
})
export class PodsTableModule { }
