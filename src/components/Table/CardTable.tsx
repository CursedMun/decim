import { Pencil, Trash } from 'lucide-react';
import Loading from '../Loading';
import { Tag } from '../Tag';
import { Button } from '../ui/button';
import { TablePagination } from './TablePagination';
type TData = {
  id: number;
  title: string;
  description?: string;
  tags?: string;
};
type TableProps = {
  data: TData[];
  //   table: TanStackTable<any>;
  //   columns: ColumnDef<any>[];
  isLoading: boolean;
  pageSize?: number;
  total?: number;
  previousPage: () => void;
  nextPage: () => void;
  handleDeleteClick: (id: number) => void;
  handleEditClick: (data: TData) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
};

export default function CardTable({
  data,
  isLoading,
  pageSize,
  total,
  canNextPage,
  canPreviousPage,
  handleDeleteClick,
  handleEditClick,
  nextPage,
  previousPage,
}: TableProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
        {data.map((card, index) => (
          <div
            key={index}
            className="bg-card rounded-lg shadow-md border border-border hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary text-center">
                  {card.title}
                </h2>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" p-2"
                    onClick={() => handleEditClick(card)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className=" p-2"
                    onClick={() => handleDeleteClick(card.id as number)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-md overflow-hidden">
                <p className="text-gray-600 overflow-ellipsis whitespace-normal break-words">
                  {card.description && card.description?.length > 200
                    ? `${card.description?.slice(0, 200)}...`
                    : card.description}
                </p>
              </div>
              <div className={'flex flex-wrap gap-1 mt-2'}>
                {card.tags?.split(',')?.map((tag, i) => (
                  <Tag key={i} text={tag.trim()} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <TablePagination
        currentPageSize={pageSize || 0}
        total={total || 0}
        goPrevious={previousPage}
        isPreviousDisabled={canPreviousPage}
        goNext={nextPage}
        isNextDisabled={canNextPage}
      />
    </>
  );
}
