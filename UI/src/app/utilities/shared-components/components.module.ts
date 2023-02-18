
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbToastModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { CommonTableComponent } from './common-table/common-table.component';
import { ResizableDirective } from './common-table/resizeable.directive';
import { ResizeModule } from 'ngpq-table-resize';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




@NgModule({
  declarations: [
    CommonTableComponent,
    ResizableDirective,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    ResizeModule,
    MatFormFieldModule,
    MatInputModule,
    NgMultiSelectDropDownModule
  ],
  exports: [
    CommonTableComponent

  ],
  providers: [

  ]
})
export class ComponentsModule { }
