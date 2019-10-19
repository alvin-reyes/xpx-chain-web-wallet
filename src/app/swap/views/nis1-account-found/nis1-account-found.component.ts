import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../config/app.config';
import { NemProviderService } from '../../services/nem-provider.service';

@Component({
  selector: 'app-nis1-account-found',
  templateUrl: './nis1-account-found.component.html',
  styleUrls: ['./nis1-account-found.component.css']
})
export class Nis1AccountFoundComponent implements OnInit {

  routeGoBack = `/${AppConfig.routes.home}`;
  routeContinue = ``;
  //swapAccountNis1Found

  constructor(
    private nemProvider: NemProviderService
  ) { }

  ngOnInit() {
    const data = this.nemProvider.getSelectedNis1Account();
    if (data.cosignerAccounts.length > 0) {
      this.routeContinue = `/${AppConfig.routes.swapListCosignerNis1}`;
    } else {
      this.routeContinue = `/${AppConfig.routes.swapTransferAssets}/${data.address.pretty()}/1`;
    }
  }

}
