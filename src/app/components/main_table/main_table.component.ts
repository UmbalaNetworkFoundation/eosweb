import { Component, ViewChild, OnInit, Inject, Optional, PLATFORM_ID  } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { Socket } from 'ng-socket-io';


export interface Element {
  Name: string;
  Price: number;
  high: number;
  low: number;
  Market_cap: string;
  Change: number;
  Vol: string;
  Volume: string;
}
@Component({
  selector: 'main-table',
  templateUrl: './main_table.component.html',
  styleUrls: ['./main_table.component.css']
})
export class MainTableComponent implements OnInit{
  
  curve;
  currMap: any;
  currencyName = 'USD'; //(isPlatformBrowser(this.platformId)) ? this.getCookie('currencyName'): ;
  selected = this.currencyName;
  currencies = ['USD', 'EUR', 'GBP', 'RUB'];
  symbolsMap = {
    'USD': '<i class="fas fa-dollar-sign"></i>',
    'EUR': '€',
    'GBP': '£',
    'RUB': '₽',    
  };

  mainData;
  displayedColumns = ['Number', 'Hash', 'Transactions', 'Producer', 'Time'];
  displayedColumnsTx = ['Hash', 'Number', 'Transactions', 'Producer', 'Time'];
  dataSource;
  dataSourceTrx;
  moment = moment;
  transactions = [];
  trxObj = {};

  /*@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;*/

  constructor(protected http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object, private socket : Socket) {
  }

  getData() {
        this.http.get('/api/v1/get_last_blocks/20')
                  .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          console.log(this.createTransactionsArray(this.mainData));

                          let ELEMENT_DATA: Element[] = this.mainData;
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

                          this.createTransactionsArray(this.mainData);
                          let ELEMENT_DATA_TX: Element[] = this.transactions;
                          this.dataSourceTrx = new MatTableDataSource<Element>(ELEMENT_DATA_TX);
                      },
                      (error) => {
                          console.error(error);
                      });
  }
  
  createTransactionsArray(data) {
      if (!data){
          return;
      }
      this.transactions = [];

      data.forEach(elem => {
          if (elem.transactions && elem.transactions.length > 0){
              this.trxObj[elem.block_num] = elem;
          }
      });

      Object.keys(this.trxObj).forEach(key => {
            this.transactions.push(this.trxObj[key]);
      });
      this.transactions.reverse();
      this.transactions = (this.transactions.length > 20) ? this.transactions.slice(1, 20) : this.transactions;
  }

  ngOnInit() {
      this.getData();
      this.socket.on('get_last_blocks', (data) => {
          this.mainData = data;
          let ELEMENT_DATA: Element[] = this.mainData;
          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

          this.createTransactionsArray(this.mainData);
          let ELEMENT_DATA_TX: Element[] = this.transactions;
          this.dataSourceTrx = new MatTableDataSource<Element>(ELEMENT_DATA_TX);

      });
  }
}





















