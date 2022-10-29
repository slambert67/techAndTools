import { Component, OnInit } from '@angular/core';

export interface HardCodedGatesGridColumnDef {
  label: string;
  field: string;
}

@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.css']
})
export class MyTableComponent implements OnInit {

  columnDefs!: Array<HardCodedGatesGridColumnDef>;
  columnsToDisplay!: Array<string>;

  constructor() { }

  ngOnInit(): void {

    this.columnDefs = [
      {
        field: 'gate',
        label: 'Gate'
      },
      {
        field: 'terminal',
        label: 'Terminal'
      },
      {
        field: 'gateDescription',
        label: 'Description'
      },
      {
        field: 'gateStatus',
        label: 'Status'
      },
      {
        field: 'flightID',
        label: 'Flight ID'
      }
    ];

    this.columnsToDisplay = ['gate', 'terminal', 'gateDescription', 'gateStatus', 'flightID'];

    console.log(this.columnDefs);
    console.log(this.columnsToDisplay);
  }

}
