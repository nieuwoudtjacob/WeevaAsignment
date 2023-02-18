import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection, SortColumn } from './sortable.directive';

interface SearchResult {
    tables: any[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    searchTerms: string[][];
    globalSearchTerm: string;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

/**
* Sort the table data
* @param Table field value
* @param column Fetch the column
* @param direction Sort direction Ascending or Descending
*/
function sort(tables: any[], column: SortColumn, direction: string): any[] {
    if (direction === '' || column === '' || column === 'images') {
        return tables;
    } else {
        return [...tables].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

/**
* Table Data Match with Search input
* @param  Table field value fetch
* @param term Search the value
*/
function matches(table: any, terms: string[], column: number, pipe: PipeTransform) {
    let matched = false
    if (table[column].searchable == true) {
        terms.forEach(term => {
            if (table[column].cell_val != null) { matched = matched || table[column].cell_val.toString().toLowerCase().includes(term.toLowerCase()) } else { matched = true }
        });
        return matched;
    }
    else
        return table;
}

/**
* Table Data Match with Search input
* @param  Table field value fetch
* @param term Search the value
*/
function matchesByGlobalSearchTerm(table: any, term: string, pipe: PipeTransform) {
    let matched = false
    table.forEach((element: any, index: number) => {
        if (element.searchable == true) {
            matched = matched || element.cell_val?.toString().toLowerCase().includes(term.toLowerCase())
        }
    });

    return matched;
}


@Injectable({
    providedIn: 'root'
})

export class CommonTableService {
    private tableData: any[] = [];
    private filteredTableData: any[] = [];

    // tslint:disable-next-line: variable-name
    private _loading$ = new BehaviorSubject<boolean>(true);
    // tslint:disable-next-line: variable-name
    private _search$ = new Subject<void>();
    // tslint:disable-next-line: variable-name
    private _tables$ = new BehaviorSubject<any[]>([]);
    // tslint:disable-next-line: variable-name
    private _total$ = new BehaviorSubject<number>(0);
    // tslint:disable-next-line: variable-name
    private _state: State = {
        page: 1,
        pageSize: 10,
        sortColumn: '',
        sortDirection: '',
        startIndex: 0,
        endIndex: 9,
        totalRecords: 0,
        searchTerms: [],
        globalSearchTerm: '' //global search params
    };

    constructor(private pipe: DecimalPipe) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._tables$.next(result.tables);
            this._total$.next(result.total);
        });
        this._search$.next();
    }

    setTableData(data: any[]) {
        this.tableData = [...data];
    }

    getFilteredTableData() {
        return this.filteredTableData;
    }

    /**
     * Returns the value
     */
    get tables$() { return this._tables$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get globalSearchTerm() { return this._state.globalSearchTerm; }

    get startIndex() { return this._state.startIndex; }
    get endIndex() { return this._state.endIndex; }
    get totalRecords() { return this._state.totalRecords; }

    /**
     * set the value
     */
    // tslint:disable-next-line: adjacent-overload-signatures
    set page(page: number) { this._set({ page }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    // tslint:disable-next-line: adjacent-overload-signatures
    set startIndex(startIndex: number) { this._set({ startIndex }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set endIndex(endIndex: number) { this._set({ endIndex }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
    set globalSearchTerm(globalSearchTerm: string) { this._set({ globalSearchTerm }); }

    public setSearchTerms(terms: string[][]) {
        this._set({ searchTerms: terms })
    }
    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    /**
     * Search Method
     */
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerms, globalSearchTerm } = this._state;

        // 1. sort
        let tables = sort(this.tableData, sortColumn, sortDirection);

        // 2. filter  

        if (searchTerms.length > 0) {
            searchTerms.forEach((terms: string[], index: number) => {
                tables = tables.filter(table => matches(table, terms, index, this.pipe));
            });
        }

        // 3. Filter by global search term
        if (globalSearchTerm != '') {
            tables = tables.filter(table => matchesByGlobalSearchTerm(table, globalSearchTerm, this.pipe));
        }

        // Set filtered data
        this.filteredTableData = [...tables];

        const total = tables.length;

        // 3. paginate
        this.totalRecords = tables.length;
        this._state.startIndex = (page - 1) * this.pageSize + 1;
        this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
        if (this.endIndex > this.totalRecords) {
            this.endIndex = this.totalRecords;
        }
        tables = tables.slice(this._state.startIndex - 1, this._state.endIndex);
        return of(
            { tables, total }
        );
    }
}
