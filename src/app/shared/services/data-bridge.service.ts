import { Injectable } from '@angular/core';
import { Listener, Address, Transaction } from "nem2-sdk";
import { environment } from '../../../environments/environment';
import { WalletService } from "./wallet.service";
import {  TransactionsService} from "../../transactions/service/transactions.service";
@Injectable({
  providedIn: 'root'
})
export class DataBridgeService {

  constructor(private walletService:WalletService,private _transactionsService:TransactionsService) { }

  /**
   *   Set default socket connect
   *
   * @returns
   * @memberof DataBridgeService
   */
  connectnWs() {
    const connector = new Listener(environment.socket, WebSocket);
    // Try to open the connection

    
    this.openConnection(connector);
    return;
  }

  /**
   * Open websocket connection
   *
   * @param {*} connector
   * @memberof DataBridgeService
   */
  openConnection(connector) {

    connector.open().then(() => {
      console.log(this.walletService.address)

      connector.confirmed(this.walletService.address).subscribe((
        transaction: Transaction[]) => {
          this._transactionsService.setTransConfirm$(transaction)
          const audio = new Audio('assets/audio/ding2.ogg');
          audio.play();
        console.log("transaction:::::::", transaction)
      },
        err => {
          console.error(err)
        });

      connector.unconfirmedAdded(this.walletService.address).subscribe((
        transaction: Transaction[]) => {
          // this._transactionsService.setTransConfirm$(transaction)
        console.log("Untransaction:::::::", transaction)
        const audio = new Audio('assets/audio/ding.ogg');
        audio.play();
      },
        err => {
          console.error(err)
        });

      connector.status(this.walletService.address).subscribe(status => {
        console.log("status", status)
      },
        err => {
          console.error("err::::::", err)
        });

    }, (error) => {
      console.error("errroooor de soquer",error);
      this.reconnect(connector);
    });

    
  }

  /**
   *  reconnection to the  websocket 
   *
   * @param {*} connector
   * @returns
   * @memberof DataBridgeService
   */
  reconnect(connector) {
    // Close connector
    connector.close();
    this.openConnection(connector);
    return;
}


}