'use client';

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusSquareIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import DateRender from '@/components/DateRender/DateRender';
import { DeleteModal } from '@/components/DeleteModal';
import { PageFilters } from '@/components/PageFilters';
import { Popover } from '@/components/Popover/Popover';
import { PopoverOptions } from '@/components/Popover/PopoverOptions';
import ExtendedTable from '@/components/Table/ExtendedTable';
import { useApp } from '@/hooks/useApp';
import { useServerAlert } from '@/hooks/useServerAlert';
import { DEFAULT_TAKE } from '@/lib/constants';
import { FilterFieldType, type ITableFilterItem } from '@/lib/localTypes';

import CopyToClipboard from '@/components/CopyToClipboard';
import { default as HostForm } from '@/components/Host/HostForm';
import { Tag } from '@/components/Tag';
import { Button } from '@/components/ui/button';
import { type TFindAllResult } from '@/infrastructure/db/postgresql/base/BaseQueries';
import { type THost } from '@/infrastructure/tables/HostsTable';

const popoverOptions = [
  {
    name: 'edit',
    value: 'edit',
  },
  {
    name: 'delete',
    value: 'delete',
    isDanger: true,
  },
];
const Index = () => {
  const { host } = useApp();

  const [deletingHostId, setDeletingHostId] = useState<number | null>(null);
  const [showHostInfo, setShowHostInfo] = useState({
    show: false,
    host: undefined,
  } as {
    show: boolean;
    host: THost | undefined;
  });

  const { alertSuccess, alertError } = useServerAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    name: { contains: string };
    tags: { contains: string };
  }>();
  const [queryData, setQueryData] = useState<TFindAllResult<THost>>();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_TAKE,
  });

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const data = await host
      .findAll({
        sort: {
          createdAt: 'DESC',
        },
        take: DEFAULT_TAKE,
        skip: pageIndex * pageSize,
        where: filters,
      })
      .catch(alertError);

    if (data) setQueryData(data);
    setIsLoading(false);
  }, [host, pageIndex, pageSize, filters]);

  useEffect(() => {
    refetch();
  }, [host, pageIndex, pageSize, filters, refetch]);

  const onOptionClick = useCallback(
    (option: string, id: number) => {
      switch (option) {
        case 'edit':
          const host = queryData?.edges.find((x) => x.id === id);

          setShowHostInfo({
            show: true,
            host: host as unknown as THost,
          });

          return;
        case 'delete':
          setDeletingHostId(id);

          return;
      }
    },
    [queryData?.edges]
  );
  const columns: ColumnDef<typeof host.type>[] = useMemo(
    () => [
      {
        accessorKey: 'row',
        header: '#',
        cell: ({ row }) => {
          const value = (pageIndex + 1) * (row.index + 1);

          return <div>{value ? <span>{String(value)}</span> : null}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: 'name',
        cell: ({ cell }) => {
          const value = cell.getValue();

          return (
            <div>
              {value ? (
                <span className="uppercase whitespace-nowrap">
                  {String(value)}
                </span>
              ) : null}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'url',
        header: 'url',
        cell: ({ cell }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const value = cell.getValue() as string;
          const text = value.includes('@') ? `ssh ${value}` : `root@${value}`;

          return (
            <div
              className={'flex gap-2 items-center text-center justify-between '}
            >
              <div className="whitespace-nowrap">{String(value)}</div>
              <CopyToClipboard text={text} />
            </div>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'description',
        cell: ({ cell }) => {
          const value = cell.getValue();

          return <div>{value ? <span>{String(value)}</span> : null}</div>;
        },
      },
      {
        accessorKey: 'tags',
        header: 'tags',
        cell: ({ cell }) => {
          const value = cell.getValue() as string;
          const tags = value.split(',');

          return (
            <div className={'flex gap-1'}>
              {tags.map((tag, i) => (
                <Tag key={i} text={tag} />
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'createdAt',
        cell: ({ cell }) => {
          const value = cell.getValue() as Date;

          return <DateRender date={value} />;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'options',
        header: '',
        cell: ({ row }) => {
          return (
            <div className={' flex w-full justify-end'}>
              <Popover
                triggerComponent={
                  <div className={'p-2.5'}>
                    <MoreHorizontal color={'#9CA4A9'} size={16} />
                  </div>
                }
                contentComponent={
                  <PopoverOptions
                    onOptionClick={(option) =>
                      onOptionClick(option, row.original.id)
                    }
                    options={popoverOptions}
                  />
                }
                contentClassname={'absolute right-[-20px] top-0'}
              />
            </div>
          );
        },
      },
    ],
    [alertSuccess, onOptionClick, pageIndex]
  );

  const filtersConfig = useMemo(
    (): ITableFilterItem[] => [
      {
        fieldName: 'name',
        fieldType: FilterFieldType.STRING,
      },
      {
        fieldName: 'tags',
        fieldType: FilterFieldType.STRING,
      },
    ],
    []
  );

  const handleDeleteCheckpoint = useCallback(() => {
    if (!deletingHostId) {
      return;
    }
    host
      .deleteById(deletingHostId)
      .then(() => {
        alertSuccess();
        refetch();
      })
      .catch(alertError);
  }, [deletingHostId, host, alertError, alertSuccess, refetch]);

  const data = useMemo(() => queryData?.edges || [], [queryData?.edges]);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const pageCount = useMemo(() => {
    if (queryData?.pageInfo.total) {
      return queryData.pageInfo.total % DEFAULT_TAKE === 0
        ? queryData.pageInfo.total / DEFAULT_TAKE
        : Number((queryData.pageInfo.total / DEFAULT_TAKE).toFixed(0));
    }
  }, [queryData?.pageInfo.total]);

  const table = useReactTable({
    data,
    // @ts-ignore weitd accessorFn typing issue
    columns,
    manualPagination: true,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const renderTable = useCallback(() => {
    return (
      <div className="flex flex-col">
        <ExtendedTable
          pageSize={queryData?.edges?.length}
          total={queryData?.pageInfo.total}
          columns={columns}
          table={table}
          isLoading={isLoading}
        />
        <DeleteModal
          open={!!deletingHostId}
          changeIsOpen={() => setDeletingHostId(null)}
          onDelete={handleDeleteCheckpoint}
        />
      </div>
    );
  }, [
    columns,
    deletingHostId,
    handleDeleteCheckpoint,
    isLoading,
    queryData?.edges?.length,
    queryData?.pageInfo.total,
    table,
  ]);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Hosts
        </h2>
        <div className="flex items-center space-x-2">
          <HostForm
            setShowDialog={(bool) =>
              setShowHostInfo({ show: bool, host: undefined })
            }
            showDialog={showHostInfo.show}
            refetch={refetch}
            hostEntity={showHostInfo.host}
          >
            <Button
              onClick={() => {
                setShowHostInfo({
                  show: true,
                  host: undefined,
                });
              }}
              className="gap-2"
            >
              <PlusSquareIcon className="h-4 w-4" />
              Create
            </Button>
          </HostForm>
        </div>
      </div>
      <div className={'flex h-full grow flex-col gap-4 py-4'}>
        <PageFilters
          onFilterChange={setFilters}
          filtersConfig={filtersConfig}
        />
        {renderTable()}
      </div>
    </>
  );
};

export default React.memo(Index);
