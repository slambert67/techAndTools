import { Component, OnInit } from '@angular/core';
import {map, Observable} from "rxjs";
import {MyService} from "../services/my.service";
import {HttpClient} from "@angular/common/http";
import {GatesGridColumnDef} from "../models/GatesGridColumnDef";
import {MatTableDataSource} from "@angular/material/table";
import {MyGate} from "../models/Gates/myGates";

@Component({
  selector: 'app-my-table5',
  templateUrl: './my-table5.component.html',
  styleUrls: ['./my-table5.component.css']
})
export class MyTable5Component implements OnInit {

  columnDefs!: Observable<GatesGridColumnDef[]>;
  columnsToDisplay!: Observable<string[]>;

  private dataSource = new MatTableDataSource<MyGate>();

  obs2!: Observable<MatTableDataSource<MyGate>>;

  constructor(private _gateService: MyService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.columnDefs = this._gateService.fetchColumnDefs();
    this.columnsToDisplay = this._gateService.fetchColumnsToDisplay();

    this.obs2 = this._gateService.fetchMyGateData().pipe(
      map( (myData) => {
        console.log(myData);
        const dataSource = this.dataSource;
        dataSource.data = myData;
        return dataSource;
      })
    );
  }
}
