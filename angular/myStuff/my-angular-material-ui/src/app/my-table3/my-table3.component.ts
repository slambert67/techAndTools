import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {GatesGridColumnDef} from "../models/GatesGridColumnDef";
import {MyService} from "../services/my.service";
import {HttpClient} from "@angular/common/http";
import {MyGate} from "../models/Gates/myGates";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-my-table3',
  templateUrl: './my-table3.component.html',
  styleUrls: ['./my-table3.component.css']
})
export class MyTable3Component implements OnInit {

  columnDefs!: Observable<GatesGridColumnDef[]>;
  columnsToDisplay!: Observable<string[]>;

  dataSource = new MatTableDataSource<MyGate>;
  myGateData !: Observable<MyGate[]>;

  constructor(private _gateService: MyService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.columnDefs = this._gateService.fetchColumnDefs();
    this.columnsToDisplay = this._gateService.fetchColumnsToDisplay();
    //this._gateService.fetchMyGateData().subscribe( x => console.log(x)); works
    this._gateService.fetchMyGateData().subscribe( res => {console.log(res); this.dataSource.data = res;});
  }

}
