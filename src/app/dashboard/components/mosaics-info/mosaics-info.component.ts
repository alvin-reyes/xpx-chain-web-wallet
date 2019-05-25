import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Mosaic, MosaicView, MosaicInfo } from 'tsjs-xpx-catapult-sdk';
import { MosaicService } from '../../../servicesModule/services/mosaic.service';
import { TransactionsService } from '../../../transactions/service/transactions.service';
import { MosaicsStorage } from '../../../servicesModule/interfaces/mosaics-namespaces.interface';
import { TransactionsInterface } from '../../services/transaction.interface';
import { ProximaxProvider } from '../../../shared/services/proximax.provider';

@Component({
  selector: 'app-mosaics-info',
  template: `
                <!-- MOSAIC XPX -->
                <ng-container *ngIf="viewMosaicXpx">
                  <div class="row">
                    <div class="col-3">
                       <span class="color-dark-green fw-bold fs-1-5rem">Amount: </span>
                    </div>
                    <div class="col-9">
                       <span
                       [ngClass]="{
                         'color-blue-light': transferTransaction.isRemitent,
                         'color-orange': !transferTransaction.isRemitent
                        }"
                       class="fw-bold fs-1-5rem" >{{mosaicXpx.amountFormatter}} XPX</span>
                    </div>
                  </div>
                </ng-container>

                <!-- OTHER MOSAICS -->
                <container *ngIf="viewOtherMosaics">
                  <div class="row">
                    <div class="col-12">
                      <span class="color-dark-green fw-bold fs-1-5rem">Other mosaics: </span>
                    </div>
                  </div>

                  <div class="table-responsive table-striped ">
                    <table mdbTable id="tablePreview" class="table table-hover table-bordered table-striped table-sm z-depth-0">
                      <thead>
                        <tr>
                          <th
                          *ngFor="let head of headElements"
                          scope="col"
                          [ngClass]="{
                            'color-blue-light': transferTransaction.isRemitent,
                            'color-orange': !transferTransaction.isRemitent
                          }"
                          class="text-align-left fw-500">{{head}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr mdbTableCol *ngFor="let element of quantity; let i = index">
                          <td class="font-size-08rem">
                            <a class="text-link mouse-pointer">{{element.id}}</a>
                          </td>

                          <ng-container *ngIf="!element.existMosaic; else viewMosaicInfo">
                            <td class="font-size-08rem">{{element.amountFormatter}}</td>
                            <td class="font-size-08rem">Mosaic no longer exists</td>
                          </ng-container>

                          <ng-template #viewMosaicInfo>
                             <td class="font-size-08rem">{{element.name}}</td>
                             <td class="font-size-08rem">{{element.amountFormatter}}</td>
                          </ng-template>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </container>

              `
})
export class MosaicsInfoComponent implements OnInit {

  @Input() mosaicsArray: Mosaic[] = [];
  @Input() transferTransaction: TransactionsInterface;
  @Output() changeSearch = new EventEmitter();

  headElements = ['Id', 'Name', 'Quantity'];
  mosaicXpx: any = {};
  quantity = [];
  viewOtherMosaics = false;
  viewMosaicXpx = false;

  constructor(
    private mosaicService: MosaicService,
    private transactionService: TransactionsService,
    private proximaxProvider: ProximaxProvider
  ) { }

  ngOnInit() {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.mosaicXpx = {};
    this.viewMosaicXpx = false;
    this.viewOtherMosaics = false;
    this.quantity = [];
    const mosaics: MosaicsStorage[] = await this.mosaicService.searchMosaics(this.mosaicsArray.map((mosaic: Mosaic) => { return mosaic.id }));
    if (mosaics.length > 0) {
      for (let mosaic of mosaics) {
        // Create MosaicId from mosaic and namespace string id (ex: nem:xem or domain.subdom.subdome:token)
        // console.log(mosaic);
        const mosaicId = this.proximaxProvider.getMosaicId(mosaic.id).toHex();
        const myMosaic = this.mosaicsArray.find(next => next.id.toHex() === mosaicId);
        const amount = (mosaic.mosaicInfo !== null) ?
          this.transactionService.amountFormatter(myMosaic.amount, myMosaic.id, mosaic.mosaicInfo) :
          this.transactionService.amountFormatterSimple(myMosaic.amount.compact());
        // MOSAIC IS XPX
        if (mosaicId === this.mosaicService.mosaicXpx.mosaicId) {
          this.viewMosaicXpx = true;
          this.mosaicXpx = {
            id: this.mosaicService.mosaicXpx.mosaicId,
            name: this.mosaicService.mosaicXpx.mosaic,
            amountFormatter: amount,
            mosaicInfo: mosaic
          }
        } else {
          // console.log(mosaic.mosaicName);
          const nameMosaic = (mosaic.mosaicNames.names.length > 0) ? mosaic.mosaicNames.names[0] : this.proximaxProvider.getMosaicId(mosaic.id).toHex();
          this.quantity.push({
            id: myMosaic.id.toHex(),
            name: nameMosaic,
            amountFormatter: amount,
            mosaicInfo: mosaic,
            existMosaic: true
          });
        }
      }
    } else {
      this.transferTransaction.data['mosaics'].forEach((_element: Mosaic) => {
        this.quantity.push({
          id: _element.id.toHex(),
          name: '',
          amountFormatter: this.transactionService.amountFormatterSimple(_element.amount.compact()),
          mosaicInfo: null,
          existMosaic: false
        });
      });
    }

    this.viewOtherMosaics = (this.quantity.length > 0) ? true : false;
    this.changeSearch.emit(true);
  }
}
