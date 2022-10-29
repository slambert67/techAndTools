import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MyGate} from "../models/Gates/myGates";
import {map, Observable} from "rxjs";
import {MyService} from "../services/my.service";
import {HttpClient} from "@angular/common/http";
import {GatesGridColumnDef} from "../models/GatesGridColumnDef";

@Component({
  selector: 'app-my-table4',
  templateUrl: './my-table4.component.html',
  styleUrls: ['./my-table4.component.css']
})
export class MyTable4Component implements OnInit {

  columnDefs!: Observable<GatesGridColumnDef[]>;
  columnsToDisplay!: Observable<string[]>;

  private dataSource = new MatTableDataSource<MyGate>();

  obs1!: Observable<MatTableDataSource<MyGate>>;


  constructor(private _gateService: MyService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.columnDefs = this._gateService.fetchColumnDefs();
    this.columnsToDisplay = this._gateService.fetchColumnsToDisplay();
    //this._gateService.fetchMyGateData().subscribe( x => console.log(x)); works
    //this._gateService.fetchMyGateData().subscribe( res => {console.log(res); this.dataSource.data = res;});

    this.obs1 = this._gateService.fetchMyGateData().pipe(
      map( (myData) => {
        console.log(myData);
        const dataSource = this.dataSource;
        dataSource.data = myData;
        return dataSource;
      })
    );
  }
}
