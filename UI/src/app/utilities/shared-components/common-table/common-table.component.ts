import { Component, OnInit, Input } from '@angular/core';
import { elementAt, Observable } from 'rxjs';

import { CommonTableService } from './common-table.service';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwiperOptions } from 'swiper';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TableColumn, ColumnType } from '../../../models/common-table-models/CommonTableModel';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss'],
  providers: [CommonTableService, DecimalPipe, DatePipe]
})
export class CommonTableComponent implements OnInit {

  @Input() tableColumns: TableColumn[] = [];
  @Input() tableData: any[][] = [];
  @Input() editLink: string = '';
  @Input() deleteFunc!: (id: number) => void;
  @Input() exportName: string = '';
  @Input() exportEnabled: boolean;
  @Input() previoseRoute: string;
  @Input() newDealer: any;
  @Input() selectedTableInput: string[][] = [];
  @Input() contractObj: any;
  searchedTables: string[][] = [];

  @Input() currentTabID: any;
  @Input() contractRoute: string;


  /**
  * Swiper Nav Config setting
  */
  navconfig: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    pagination: false
  };

  tables$: Observable<any[]>;
  total$: Observable<number>;
  isDesc: boolean = false;
  column: any = 'name';
  show: boolean = true;
  files: File[] = [];
  draggedColumnIndex: number = 0;
  formattedTableData: any[] = [];
  currentTableData: any[] = [];
  numberFormatColumns: any[] = [];
  filterData: any[][] = [];
  columnVisibilityList: boolean[] = [];
  searchTerms: string[][] = [];
  multiSelectSettings: IDropdownSettings = {};
  arrayBuffer: any;
  viewInitialized: boolean = false;
  loading: boolean;

  constructor(public service: CommonTableService,
    private modalService: NgbModal,
    private datePipe: DatePipe) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    this.loading = true;
    if (this.selectedTableInput !== null) {
      if (this.selectedTableInput.length > 0) {
        this.searchTerms = this.selectedTableInput;
      }
    }

    this.multiSelectSettings = {
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true
    };

    this.setTableData();
    this.parseTableData();

    this.total$ = this.service.total$;

    setTimeout(() => {
      this.tableData.forEach((obj: any) => {

        obj.forEach((element: any, index: number) => {
          if (!this.filterData[index]) {
            this.filterData[index] = []
          }
          let duplicates = false;
          this.filterData[index].forEach((filterItem: any) => {
            if (filterItem.item_id == element.cell_val) {
              duplicates = true
            }
          });

          if (!duplicates)
            this.filterData[index].push({ 'item_id': element.cell_val, 'item_text': element.cell_val });
        });
      })
      this.viewInitialized = true;
      this.loading = false;
    }, 500);


  }

  public get ColumnType() {
    return ColumnType;
  }

  setTableData() {

    this.service.setTableData(this.tableData);
    this.tables$ = this.service.tables$;
  }

  parseTableData() {
    this.tableColumns.forEach((obj: any, index: number) => {

      this.columnVisibilityList.push(true);
      if (!this.searchTerms[index]) {
        this.searchTerms[index] = []
        this.searchTerms[index].push('');
      }
    })
    this.service.setSearchTerms(this.searchTerms);

    this.tableData.forEach((obj: any) => {
      let jsonObject: any = {};

      obj.forEach((element: any, index: number) => {
        if (!this.filterData[index]) {
          this.filterData[index] = []
        }

        let duplicates = false;
        this.filterData[index].forEach((filterItem: any) => {
          if (filterItem.item_id == element.cell_val) {
            duplicates = true
          }
        });

        if (!duplicates) {
          let cell_val = element.cell_val;
          if (cell_val !== undefined && cell_val !== null) {
            if (cell_val.length !== undefined && cell_val.length !== null) {
              if (cell_val.length > 20)
                cell_val = element.cell_val.substring(0, 17) + '...'
              this.filterData[index].push({ 'item_id': element.cell_val, 'item_text': cell_val });
            }
          }
        }
        if (element.col_id == 'action') {

          jsonObject['id'] = element.cell_val;
        }

        else
          jsonObject[element.col_id] = element.cell_val;
      });

      this.formattedTableData.push(jsonObject);
    })
  }

  getFormattedDataEntry(id: string) {

    // for (let idx = 0; idx < this.formattedTableData.length; idx++) {
    //   if (this.formattedTableData[idx]['id'] == id) {
    //     console.log(id)
    //     return this.formattedTableData[idx];
    //   }
    // }
    return id;
  }

  public getFilterDataItems(colIdx: number) {
    return this.filterData[colIdx].reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
  }

  public arrayMove(arr: any[], from: number, to: number) {
    let cutOut = arr.splice(from, 1)[0]; // remove the dragged element at index 'from'
    arr.splice(to, 0, cutOut);            // insert it at index 'to'
  }

  public moveTableDataArray(arr: any[], from: number, to: number) {
    arr.forEach(element => {
      let cutOut = element.splice(from, 1)[0]; // remove the dragged element at index 'from'
      element.splice(to, 0, cutOut);            // insert it at index 'to'
    });
  }

  public dragStartColumn(index: number) {
    this.draggedColumnIndex = index;
  }

  public allowDrop(event: Event) {
    event.preventDefault();
  }

  public dropColumn(index: number) {
    this.arrayMove(this.tableColumns, this.draggedColumnIndex, index);
    this.moveTableDataArray(this.tableData, this.draggedColumnIndex, index);
    this.arrayMove(this.filterData, this.draggedColumnIndex, index);
    this.setTableData();
  }

  /**
   * Sort data
   * @param property
   */
  sort(property: string | number) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    let direction = this.isDesc ? 1 : -1;
    let selectedColumn = -1;

    this.tableData.forEach((tableEntry: any) => {
      tableEntry.forEach((element: any, index: number) => {
        if (element['col_id'] === property)
          selectedColumn = index;
      });
    });

    this.tableData.sort((a: any, b: any) => {

      if (a[selectedColumn]['cell_val'] == null) {
        a[selectedColumn]['cell_val'] = ""
      }
      if (b[selectedColumn]['cell_val'] == null) {
        b[selectedColumn]['cell_val'] = ""
      }

      if (a[selectedColumn]['cell_val'] < b[selectedColumn]['cell_val']) {
        return -1 * direction;
      }
      else if (a[selectedColumn]['cell_val'] > b[selectedColumn]['cell_val']) {
        return 1 * direction;
      } else {
        return 0;
      }

    });

    this.setTableData();
  };

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content);
  }

  onDocumentUploadSuccess(rowIdx: number, colIdx: number, event: any) {
    let uploaded_file = event[1].files.file;
    this.tableData[rowIdx][colIdx]['cell_val'] = uploaded_file;
    this.setTableData();
  }

  onUploadSuccess(rowIdx: number, colIdx: number, event: any) {
    let uploaded_file = event[0].dataURL;
    this.tableData[rowIdx][colIdx]['cell_val'].push(uploaded_file);

    this.setTableData();
  }

  downloadDocument(rowIdx: number, colIdx: number) {
    if (this.tableData[rowIdx][colIdx]['cell_val'] == '')
      return;
    var a = document.createElement('a');
    a.href = this.tableData[rowIdx][colIdx]['cell_val'];
    a.target = '_blank';
    a.download = 'document_' + rowIdx + '.pdf';
    document.body.appendChild(a);
    a.click();
  }

  deleteItem(id: number) {
    this.deleteFunc(id);
  }

  public changeFilter(event: any, idx: number) {
    this.searchTerms[idx] = event.target.value;
    this.service.setSearchTerms(this.searchTerms);
  }

  public onFilterItemSelect(event: any, idx: number) {
    this.searchTerms[idx].forEach((term, index) => {
      if (term === '')
        this.searchTerms[idx].splice(index, 1);
    });

    this.searchTerms[idx].push(event.item_id);

    this.service.setSearchTerms(this.searchTerms);
  }

  onFilterItemDeSelect(event: any, idx: number) {
    this.searchTerms[idx].forEach((term, index) => {
      if (term === event.item_id)
        this.searchTerms[idx].splice(index, 1);
    });

    if (!Array.isArray(this.searchTerms[idx]) || !this.searchTerms[idx].length) {
      this.searchTerms[idx].push('');
    }
    this.service.setSearchTerms(this.searchTerms);
  }

  public onFilterSelectAll(event: any, idx: number) {
    this.searchTerms[idx] = [];
    this.searchTerms[idx].push('');
    this.service.setSearchTerms(this.searchTerms);
  }

  onVisibilityChange(event: boolean, idx: number) {
    this.columnVisibilityList[idx] = event;

  }

  unMask(value: string) {
    return String(value).replace(/[^a-z0-9.]/gi, '');
  }

  // getExportTableData() {
  //   this.currentTableData = [];
  //   this.numberFormatColumns = [];

  //   let filteredTableData = this.service.getFilteredTableData();
  //   filteredTableData.forEach((obj: any) => {
  //     let jsonObject: any = {};

  //     obj.forEach((element: any, index: number) => {
  //       if (element.col_id == 'action')
  //         jsonObject['ID'] = element.cell_val;
  //       else {
  //         let col_name = this.tableColumns[index].title;
  //         if (this.tableColumns[index].date && this.tableColumns[index].date == true) {
  //           jsonObject[col_name] = this.datePipe.transform(new Date(element.cell_val), 'yyyy/MM/dd');
  //         }
  //         else if (element.type == ColumnType.String && typeof(element.cell_val) == 'string') {
  //           jsonObject[col_name] = this.unMask(element.cell_val);
  //         }
  //         else if (element.type == ColumnType.Number) {
  //           let value = element.cell_val && element.cell_val != null ? this.unMask(element.cell_val) : '';  
  //           jsonObject[col_name] = value;
  //           if (this.numberFormatColumns.indexOf(index) === -1) {
  //             this.numberFormatColumns.push(index);
  //           }
  //         }
  //         else {
  //           jsonObject[col_name] = element.cell_val;
  //         }
  //       }
  //     });
  //     this.currentTableData.push(jsonObject);
  //   })
  // }








  checkImportDataValidation(arrSheetData: any[]) {
    let validated = true;
    arrSheetData.forEach((element: any) => {
      let colIdx = 0;
      for (let key in element) {
        let columnTitle = this.tableColumns[colIdx].title;
        if ((colIdx > 0) && (columnTitle != key)) {
          validated = false;
          break;
        }
        colIdx++;
      }
    });
    return validated;
  }

  importExcelData(arrSheetData: any[]) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    const validation = this.checkImportDataValidation(arrSheetData);
    if (validation == false) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Imported excel file is invalid',
        'error'
      );
      return;
    }

    const lastTableDataEntry = this.tableData[this.tableData.length - 1];

    let importData: any[] = [];
    arrSheetData.forEach((element: any) => {
      let colIdx = 0;
      let tableItem = [];
      for (let key in element) {
        tableItem.push({
          'col_id': lastTableDataEntry[colIdx].col_id,
          'cell_val': element[key],
          'type': lastTableDataEntry[colIdx].type,
          'searchable': lastTableDataEntry[colIdx].searchable,
          'filter': lastTableDataEntry[colIdx].filter
        });
        colIdx++;
      }
      importData.push(tableItem);
    });

    this.tableData = [...this.tableData, ...importData];
    this.setTableData();
  }

}
