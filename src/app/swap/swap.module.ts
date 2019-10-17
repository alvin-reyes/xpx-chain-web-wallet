import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

//CORE - ROUTING
import { SwapRoutingModule } from './swap-routing.module';
import { CoreModule } from '../core/core.module';

// COMPONENTS
import { Nis1CosignerAccountsComponent } from './views/nis1-cosigner-accounts/nis1-cosigner-accounts.component';
import { Nis1AccountsListComponent } from './views/nis1-accounts-list/nis1-accounts-list.component';
import { Nis1TransferAssetsComponent } from './views/nis1-transfer-assets/nis1-transfer-assets.component';
import { Nis1AccountFoundComponent } from './views/nis1-account-found/nis1-account-found.component';


@NgModule({
  declarations: [
    Nis1CosignerAccountsComponent,
    Nis1AccountsListComponent,
    Nis1TransferAssetsComponent,
    Nis1AccountFoundComponent
  ],
  imports: [
    CoreModule,
    SwapRoutingModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SwapModule { }
