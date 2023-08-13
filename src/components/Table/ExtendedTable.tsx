import {
  flexRender,
  type ColumnDef,
  type Table as TanStackTable,
} from '@tanstack/react-table';

import Loading from '../Loading';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { TablePagination } from './TablePagination';

type TableProps = {
  table: TanStackTable<any>;
  columns: ColumnDef<any>[];
  isLoading: boolean;
  pageSize?: number;
  total?: number;
  onRowClick?: (id: string) => void;
};

export default function ExtendedTable({
  table,
  columns,
  isLoading,
  pageSize,
  total,
  onRowClick,
}: TableProps) {
  return (
    <>
      <div className="w-full rounded-md border ">
        <Table>
          {isLoading ? (
            <TableCaption>
              <Loading className="flex w-full grow justify-center self-center p-4" />
            </TableCaption>
          ) : (
            <></>
          )}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <></>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    onRowClick && onRowClick(row.original.id ?? undefined)
                  }
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPageSize={pageSize || 0}
        total={total || 0}
        goPrevious={table.previousPage}
        isPreviousDisabled={!table.getCanPreviousPage()}
        goNext={table.nextPage}
        isNextDisabled={!table.getCanNextPage()}
      />
    </>
  );
}
