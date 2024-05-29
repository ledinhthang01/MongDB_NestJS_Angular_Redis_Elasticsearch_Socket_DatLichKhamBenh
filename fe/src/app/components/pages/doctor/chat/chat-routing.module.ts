import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatDoctorComponent } from './general/chat-doctor.component';

const routes: Routes = [
  {
    path: '',
    component: ChatDoctorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
