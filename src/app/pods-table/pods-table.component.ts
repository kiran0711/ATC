import { Component, OnInit,Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface ColDef {
  label: string;
  dataKey: string;
  sort?: boolean;
  sortOrder?:SortOrder;
  renderer?: any;
}

export enum SortOrder {
  'asc','desc'
} 
@Component({
  selector: 'pods-table',
  templateUrl: './pods-table.component.html',
  styleUrls: ['./pods-table.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PodsTableComponent implements OnInit {
  @Input() 
  dataList: Array<any> = [];
  @Input() 
  colDef : Array<ColDef> = [];
  @Output()
  onSort = new EventEmitter<any>();
  @Output()
  onClick = new EventEmitter<any>();
  public SortEnum = SortOrder
  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }

  getValue(data:any, path:string) {
      var tokens = path.split(".");
      var obj = data;
      for (var i = 0; i < tokens.length; i++) {
          obj = obj[tokens[i]];
      }
      return obj;
    
  }

  renderer(def:any): boolean {
    return typeof def['renderer'] == 'function';
  }

  sort(def:any) {
    this.onSort.emit(def);
  }

  clicked(data:any){
    this.onClick.emit(data); 
  }

  domSanitizer(html:any){
    return this.sanitizer.bypassSecurityTrustStyle(html)
  }

}
