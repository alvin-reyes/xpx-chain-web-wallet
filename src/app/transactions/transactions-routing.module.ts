import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConfig } from '../config/app.config';
import { LoggedGuard } from '../shared/guard/logged.guard';
import { NotLoggedGuard } from '../shared/guard/not-logged.guard';
import { TransactionsComponent } from '../transactions/views/transactions/transactions.component';
const routes: Routes = [
  {
    path: `${AppConfig.routes.transactions}`,
    component: TransactionsComponent,
    canActivate: [LoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }