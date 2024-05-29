import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatEmployeeComponent } from './general/chat-employee.component';

const routes: Routes = [
  {
    path: '',
    component: ChatEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
