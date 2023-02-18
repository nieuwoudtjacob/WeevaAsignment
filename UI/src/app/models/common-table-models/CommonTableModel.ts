export interface TableColumn {
    title: string;
    sortable: boolean;
    column_val: string;
    searchable: boolean;
    filter?: boolean;
    type?: ColumnType;
}
export enum ColumnType {
    String = 'string',
    Number = 'number',
    Image = 'image',
    Action = 'action',
    Status = 'status',
    Gallery = 'gallery',
    Document = 'document'
}
