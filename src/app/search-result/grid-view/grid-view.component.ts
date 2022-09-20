import { Component, Input, OnInit, Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css']
})
export class GridViewComponent implements OnInit {
  
  @Input() properties: any;
  @Input() propertyAttributes: any;
  @Input() showLoadMore: boolean;
  @Output() scrolled:any = new EventEmitter()
  @Input() reqFeild: any;

  constructor() { }

  ngOnInit(): void {
    
  }
  onScrollDown(){
    this.scrolled.emit({'scrolled':true})
  }

}
