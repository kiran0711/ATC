import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { LongTermComponent } from './long-term/long-term.component';
import { SearchResultComponent } from './search-result.component';

const routes: Routes = [
  {
    path: '',
    component: SearchResultComponent,
  },
  {
    path: 'long-term',
    children: [
      {
        path: '',
        component: LongTermComponent,
      },
      {
        path: ':type/:slug',
        component: LongTermComponent,
      }
    ],
  },
  {
    path: ':type/:slug',
    component: SearchResultComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchResultRoutingModule {}
