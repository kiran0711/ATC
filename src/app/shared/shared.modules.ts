import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardSidebarComponent } from "./component/dashboard-sidebar/dashboard-sidebar.component";
import { WhatMakeUsComponent } from './component/what-make-us/what-make-us.component'

@NgModule({
    declarations:[
        DashboardSidebarComponent,
        WhatMakeUsComponent
    ],
    providers:[],
    entryComponents:[],
    imports:[
        RouterModule,
        CommonModule
    ],
    exports:[
        DashboardSidebarComponent, 
        WhatMakeUsComponent
    ]
})

export class SharedModule { }
