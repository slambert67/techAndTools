import { Component, OnInit } from '@angular/core';
import {HardCodedGatesGridColumnDef} from "../my-table/my-table.component";
import {MyService} from "../services/my.service";
import {GatesGridColumnDef} from "../models/GatesGridColumnDef";
import {Observable} from "rxjs";
import ColumnDefs from "../../assets/grid-columns.json";
import ColumnsToDisplay from "../../assets/grid-columns-to-display.json";
import {MatTableDataSource} from "@angular/material/table";
import {MyGate} from "../models/Gates/myGates";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-my-table2',
  templateUrl: './my-table2.component.html',
  styleUrls: ['./my-table2.component.css']
})
export class MyTable2Component implements OnInit {

  //columnDefs!: Array<GatesGridColumnDef>;
  columnDefs!: GatesGridColumnDef[];
  columnsToDisplay!: string[];

  public dataSource = new MatTableDataSource<MyGate>();

  constructor(private _gateService: MyService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    /*
      "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
     */
    this.columnDefs =  ColumnDefs;
    this.columnsToDisplay = ColumnsToDisplay;

    this.getData();
    /*this._gateService.fetchColumnDefs().subscribe( res1 => {

      this._gateService.fetchColumnsToDisplay().subscribe( res2 => {
        console.log(res1);
        console.log(res2);
        this.columnDefs = res1;
        this.columnsToDisplay = res2;
      })
    });*/
  }

  getData() {
    this.httpClient.get<MyGate[]>('assets/my-gates.json').subscribe( (res) => {
      console.log(res);
      this.dataSource.data = res;
    });
  }

}
