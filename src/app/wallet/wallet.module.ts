import { NgModule } from '@angular/core';

import { WalletRoutingModule } from './wallet-routing.module';
import { CreateWalletComponent } from './views/create-wallet/create-wallet.component';
import { ImportWalletComponent } from './views/import-wallet/import-wallet.component';
import { CoreModule } from '../core/core.module';
import { WalletCreatedComponent } from './views/wallet-created/wallet-created.component';
import { SelectionWalletCreationTypeComponent } from './views/selection-wallet-creation-type/selection-wallet-creation-type.component';
import { WalletNis1FoundComponent } from './views/wallet-nis1-found/wallet-nis1-found.component';
import { TransferXpxComponent } from './views/transfer-xpx/transfer-xpx.component';

@NgModule({
  declarations: [CreateWalletComponent, ImportWalletComponent, WalletCreatedComponent, SelectionWalletCreationTypeComponent, WalletNis1FoundComponent, TransferXpxComponent],
  imports: [
    CoreModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
