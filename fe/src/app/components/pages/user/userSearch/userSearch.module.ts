import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSearchRoutingModule } from './userSearch-routing.module';
import { ResultSearchComponent } from './result-search/result-search.component';
import { SearchComponent } from './search/search.component';
import { MatIconModule } from '@angular/material/icon';
import { ShareModule } from '../../common/share.module';

@NgModule({
  declarations: [ResultSearchComponent, SearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserSearchRoutingModule,
    MatIconModule,
    ShareModule,
  ],
})
export class UserSearchModule {}
