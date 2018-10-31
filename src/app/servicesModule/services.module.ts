import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { ServicesRoutingModule } from './services-routing.module';
import { ExplorerComponent } from './views/explorer/explorer.component';
import { AddNodeComponent } from './views/add-node/add-node.component';
import { SelectNodeComponent } from './views/select-node/select-node.component';
import { CreatePollComponent } from '../services/views/voting/create-poll/create-poll.component';
import { PollsComponent } from '../services/views/voting/polls/polls.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ServicesRoutingModule
  ],
  declarations: [ExplorerComponent, AddNodeComponent, SelectNodeComponent, CreatePollComponent, PollsComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class ServicesModule { }