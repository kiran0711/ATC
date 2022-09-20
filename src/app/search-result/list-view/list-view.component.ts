import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  @Input() properties: any;
  @Input() propertyAttributes: any;
  @Input() showLoadMore: boolean;
  @Output() scrolled:any = new EventEmitter()
  @Input() reqFeild: any;
  scrollHeight:string = "30rem";

  constructor() { }

  ngOnInit(): void {
    if(this.properties?.length>0){
      this.scrollHeight="5rem";
    }
  }
  onScrollDown(){
    this.scrolled.emit({'scrolled':true})
  }
  parseFloat(cordinates:any){
    return parseFloat(cordinates);

  }
  onMouseOver(infoWindow:any, gm:any) {

    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
}

}
