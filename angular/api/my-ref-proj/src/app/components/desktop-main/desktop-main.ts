import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-desktop-main',
  standalone: false,
  templateUrl: './desktop-main.html',
  styleUrl: './desktop-main.css',
})
export class DesktopMain {
  @Input() payload: any[] = [];
  @Output() rowSelected = new EventEmitter<any>();

  currentPage = 1;
  pageSize = 2;

  // ✅ Safe + pure getter
  get paginatedData() {
    if (!this.payload || this.payload.length === 0) {
      return [];
    }

    const start = (this.currentPage - 1) * this.pageSize;
    return this.payload.slice(start, start + this.pageSize);
  }

  selectRow(row: any) {
    this.rowSelected.emit(row);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.payload.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
