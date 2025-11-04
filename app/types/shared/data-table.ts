export interface ColumnType {
  key: string;
  label: string;
  isImage?: boolean;
  canCopy?: boolean;
  style?: (value: any, rowData: Record<string, any>) => string;
  formatter?: (value: any, rowData: Record<string, any>) => string;
}

export interface TableConfig {
  columns: ColumnType[];
  hasSlot?: boolean;
  slots?: Array<{ key: string; name: string }>;
}

export interface DataTableProps {
  tableId?: string | null;
  isEmpty: boolean;
  config: TableConfig;
  data: Record<string, any>[];
  currentPage: number;
  perPage: number;
  message?: string | null;
}

export interface FilterType {
  filterKey: string;
  filterName?: string;
  filterOptions: Array<{
    key: string | number | boolean;
    value: string | number | boolean;
  }>;
}
