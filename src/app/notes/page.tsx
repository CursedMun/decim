'use client';

import { type PaginationState } from '@tanstack/react-table';
import { PlusSquareIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DeleteModal } from '@/components/DeleteModal';
import { PageFilters } from '@/components/PageFilters';
import { useApp } from '@/hooks/useApp';
import { useServerAlert } from '@/hooks/useServerAlert';
import { DEFAULT_TAKE } from '@/lib/constants';
import { FilterFieldType, type ITableFilterItem } from '@/lib/localTypes';

import NoteForm from '@/components/Notes/NoteForm';
import CardTable from '@/components/Table/CardTable';
import { Button } from '@/components/ui/button';
import { type TFindAllResult } from '@/infrastructure/db/postgresql/base/BaseQueries';
import { type TNote } from '@/infrastructure/tables/NoteTable';

const Index = () => {
  const { note } = useApp();

  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [showNoteInfo, setShowNoteInfo] = useState({
    show: false,
    note: undefined,
  } as {
    show: boolean;
    note: TNote | undefined;
  });

  const { alertSuccess, alertError } = useServerAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    name: { contains: string };
    tags: { contains: string };
  }>();
  const [queryData, setQueryData] = useState<TFindAllResult<TNote>>();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_TAKE,
  });

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const data = await note
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
  }, [note, pageIndex, pageSize, filters]);

  useEffect(() => {
    refetch();
  }, [note, pageIndex, pageSize, filters, refetch]);

  const filtersConfig = useMemo(
    (): ITableFilterItem[] => [
      {
        fieldName: 'title',
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
    if (!deletingNoteId) {
      return;
    }
    note
      .deleteById(deletingNoteId)
      .then(() => {
        alertSuccess();
        refetch();
      })
      .catch(alertError);
  }, [deletingNoteId, note, refetch]);

  const renderTable = useCallback(() => {
    return (
      <div className="flex flex-col">
        <CardTable
          data={queryData?.edges || []}
          canNextPage={!queryData?.pageInfo.hasNextPage || true}
          canPreviousPage={!queryData?.pageInfo.hasPreviousPage || true}
          isLoading={isLoading}
          pageSize={queryData?.edges?.length}
          total={queryData?.pageInfo.total}
          handleDeleteClick={(id) => {
            setDeletingNoteId(id);
          }}
          handleEditClick={(note) => {
            setShowNoteInfo({
              show: true,
              note,
            });
          }}
          nextPage={() => {
            setPagination({
              pageIndex: pageIndex + 1,
              pageSize,
            });
          }}
          previousPage={() => {
            setPagination({
              pageIndex: pageIndex - 1,
              pageSize,
            });
          }}
        />
        <DeleteModal
          open={!!deletingNoteId}
          changeIsOpen={() => setDeletingNoteId(null)}
          onDelete={handleDeleteCheckpoint}
        />
      </div>
    );
  }, [
    deletingNoteId,
    handleDeleteCheckpoint,
    isLoading,
    pageIndex,
    pageSize,
    queryData?.edges,
    queryData?.pageInfo.hasNextPage,
    queryData?.pageInfo.hasPreviousPage,
    queryData?.pageInfo.total,
  ]);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Notes
        </h2>
        <div className="flex items-center space-x-2">
          <NoteForm
            setShowDialog={(bool) =>
              setShowNoteInfo({ show: bool, note: undefined })
            }
            showDialog={showNoteInfo.show}
            refetch={refetch}
            noteEntity={showNoteInfo.note}
          >
            <Button
              onClick={() => {
                setShowNoteInfo({
                  show: true,
                  note: undefined,
                });
              }}
              className="gap-2"
            >
              <PlusSquareIcon className="h-4 w-4" />
              Create
            </Button>
          </NoteForm>
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
