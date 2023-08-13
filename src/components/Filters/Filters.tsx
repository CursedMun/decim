import format from 'date-fns/format';
import { Filter as FilterIcon, X } from 'lucide-react';
import { memo, useCallback, useReducer, useState } from 'react';

import { FILTER_RANGE_TIME_FORMAT } from '@/lib/constants';
import {
  FilterFieldType,
  type ITableFilterItem,
  type SelectOption,
} from '@/lib/localTypes';

import Datepicker from '../DatePicker/Datepicker';
import DateRangePicker from '../DatePicker/DateRangePicker';
import Sheet from '../Sheet';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import Input from '../ui/input';

interface IProps {
  config: ITableFilterItem[];
  onFilterChange: (filters: any) => void;
}

interface DateRangeFilterValue {
  gte: Date;
  lt: Date;
}

type FilterValue =
  | string
  | number
  | undefined
  | DateRangeFilterValue
  | Date
  | {
      in: number[];
    }
  | boolean;

interface FilterActionPayload {
  value?: FilterValue;
  rawValue?: any;
  record?: any;
  filter: ITableFilterItem;
}

interface FilterReducerValue {
  [key: string]: FilterActionPayload;
}

interface FilterReducerAction {
  type: string;
  payload?: FilterActionPayload;
}

const reducer = (state: FilterReducerValue, action: FilterReducerAction) => {
  const { type, payload } = action;

  switch (type) {
    case 'add_filter': {
      if (!payload) {
        return { ...state };
      }

      return {
        ...state,
        [payload.filter.fieldName]: {
          value: payload.value,
          filter: payload.filter,
          rawValue: payload.rawValue,
          record: payload.record,
        },
      };
    }
    case 'remove_filter': {
      if (!payload) {
        return { ...state };
      }
      const stateCopy = { ...state };

      delete stateCopy[payload.filter.fieldName];

      return {
        ...stateCopy,
      };
    }
    // case 'clear_filters': {
    //   return {
    //     state: {},
    //   };
    // }
    default:
      return state;
  }
};

const Filters = (props: IProps) => {
  const { config } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [filtersState, dispatch] = useReducer(reducer, {});

  const getFilterTypeByType = useCallback(
    (
      value: string | SelectOption[],
      type: FilterFieldType,
      isRange?: boolean
    ): FilterValue => {
      if (Array.isArray(value)) {
        return { in: value.map((i) => Number(i.id)) };
      }
      if (type === FilterFieldType.STRING) {
        return value;
      }

      if (type === FilterFieldType.NUMBER) {
        return Number(value);
      }

      if (type === FilterFieldType.DATE) {
        if (isRange) {
          const splittedValue = value.split('_');

          if (
            !splittedValue ||
            splittedValue.length < 2 ||
            !splittedValue[0] ||
            !splittedValue[1]
          ) {
            return;
          }

          return {
            gte: new Date(splittedValue[0]),
            lt: new Date(splittedValue[1]),
          };
        }

        return new Date(value);
      }

      if (type === FilterFieldType.BOOLEAN) {
        return value === 'false' ? false : true;
      }

      return value;
    },
    []
  );

  const prepareFilters = useCallback((filtersState: FilterReducerValue) => {
    const parsedFilters = {} as any;

    Object.keys(filtersState).forEach((key) => {
      const splitedKeys = key.split('.');

      if (splitedKeys.length > 1) {
        let i = 0;
        let prevKey = parsedFilters as any;

        for (const sKey in splitedKeys) {
          i++;
          const nextKey = splitedKeys[sKey];

          if (!nextKey) {
            break;
          }
          if (i === splitedKeys.length) {
            if (
              filtersState[key]?.filter.fieldType === FilterFieldType.STRING
            ) {
              prevKey[nextKey] = {
                contains: filtersState[key]?.value,
              };
            } else {
              prevKey[nextKey] = filtersState[key]?.value;
            }
            break;
          }
          if (!prevKey[nextKey]) {
            prevKey[nextKey] = {};
          }
          prevKey = prevKey[nextKey];
        }
      } else {
        if (filtersState[key]?.filter.fieldType === FilterFieldType.STRING) {
          parsedFilters[key] = {
            contains: filtersState[key]?.value,
          };
        } else {
          parsedFilters[key] = filtersState[key]?.value;
        }
      }
    });

    return parsedFilters;
  }, []);

  const handleRemoveFilter = useCallback(
    (filter?: FilterActionPayload) => () => {
      if (!filter) {
        return;
      }
      const action = {
        type: 'remove_filter',
        payload: {
          filter: { ...filter.filter },
        },
      };

      dispatch(action);

      if (filter.filter.fieldType === FilterFieldType.STRING) {
        // @ts-ignore
        document.getElementById(filter.filter.fieldName).value = '';
      }
      const nextState = reducer(filtersState, action);
      const parsedFilters = prepareFilters(nextState);

      props.onFilterChange && props.onFilterChange(parsedFilters);
    },
    [filtersState, prepareFilters, props]
  );

  const handleAddFilter = useCallback(
    (filter: ITableFilterItem) =>
      (value: string | SelectOption[], record?: any) => {
        const typedValue = getFilterTypeByType(
          value,
          filter.fieldType,
          filter.dateOptions?.isRange
        );

        if (!typedValue) {
          return;
        }
        const action = {
          type: 'add_filter',
          payload: {
            filter,
            value: typedValue,
            rawValue: value,
            record,
          },
        };

        dispatch(action);

        const nextState = reducer(filtersState, action);
        const parsedFilters = prepareFilters(nextState);

        props.onFilterChange && props.onFilterChange(parsedFilters);
      },
    [filtersState, getFilterTypeByType, prepareFilters, props]
  );

  const handleChangeFilter = useCallback(
    (filter: ITableFilterItem) => (value: string | SelectOption[]) => {
      if (!value || value.length === 0 || value === 'false') {
        handleRemoveFilter(filtersState[filter.fieldName])();

        return;
      }
      handleAddFilter(filter)(value);
    },
    [filtersState, handleAddFilter, handleRemoveFilter]
  );

  const renderFilter = useCallback(
    (item: ITableFilterItem) => {
      const filterValue = filtersState[item.fieldName]?.rawValue;

      let content: JSX.Element | null = null;

      if (
        item.fieldType === FilterFieldType.STRING ||
        item.fieldType === FilterFieldType.SEARCH
      ) {
        content = (
          <Input
            placeholder={`search_by_${item.fieldName}`}
            onChange={(event) => handleChangeFilter(item)(event.target.value)}
            className="h-9 w-[150px] lg:w-[200px]"
            id={item.fieldName}
            debounce={500}
          />
        );
      }

      if (item.fieldType === FilterFieldType.DATE) {
        if (item.dateOptions && item.dateOptions.isRange) {
          content = (
            <DateRangePicker
              value={filterValue}
              label={item.fieldName}
              onValueChange={(date) => {
                if (date) {
                  handleChangeFilter(item)(`${date.from}_${date.to}`);
                }
              }}
            />
          );
        } else {
          content = (
            <Datepicker
              onValueChange={(date) => {
                if (date) {
                  handleChangeFilter(item)(date.toDateString());
                }
              }}
            />
          );
        }
      }

      if (item.fieldType === FilterFieldType.BOOLEAN) {
        content = (
          <div className="rounded-md border border-input px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            <Checkbox
              label={item.fieldName}
              checked={filterValue === 'false' || !filterValue ? false : true}
              onCheckedChange={(checked) => {
                handleChangeFilter(item)(String(checked));
              }}
            />
          </div>
        );
      }

      return (
        <div key={item.fieldName} className="">
          {content}
        </div>
      );
    },
    [filtersState, handleChangeFilter]
  );

  const renderFilters = useCallback(() => {
    return (
      <div className="flex flex-1 flex-wrap items-center space-x-2">
        <Button
          variant="secondary"
          size="default"
          onClick={() => {
            setShowDrawer(true);
          }}
          className="h-9"
        >
          <FilterIcon size={13} className="text-text_002" />
          <span className="text-text_002 ml-2 text-sm font-medium">
            {'all_filters'}
          </span>
        </Button>
        {config.map(renderFilter)}
      </div>
    );
  }, [config, renderFilter]);

  const renderSelectedFilter = useCallback(
    (key: string, index: number) => {
      const filter = filtersState[key];

      if (!filter) {
        return;
      }

      const filterValue = filter?.value;
      let content = null;

      if (filter?.filter.fieldType === FilterFieldType.DATE) {
        if (typeof filterValue === 'string') {
          content = format(new Date(filterValue), FILTER_RANGE_TIME_FORMAT);
        }

        if (
          filter.filter.dateOptions?.isRange &&
          filterValue &&
          // @ts-ignore
          filterValue.gte &&
          // @ts-ignore
          filterValue.lt
        ) {
          // @ts-ignore
          content = `${format(
            // @ts-ignore
            filterValue.gte,
            FILTER_RANGE_TIME_FORMAT
            // @ts-ignore
          )} -${format(filterValue.lt, FILTER_RANGE_TIME_FORMAT)}`;
        }
      } else if (filter.record) {
        content = String(
          filter.record?.name || filter.record?.title || filter.record.id
        );
      } else if (filter.filter.fieldType === FilterFieldType.BOOLEAN) {
        content = `${filter.filter.fieldName} ${filter.rawValue} `;
      } else {
        content = String(filterValue);
      }
      // TODO refactor and move filter to component
      if (Array.isArray(filter.rawValue)) {
        return (
          <div key={`${key}_${index}`} className="align-center flex flex-row">
            {filter.rawValue.map((i) => (
              <div key={i.id} className="border-borderAccent  ">
                <div
                  key={`${key}_${index}`}
                  className="font-inter bg-backgroundPrimary ml-1 flex flex-row items-center rounded-md  border p-1 text-primary"
                >
                  <span className="text-sm font-medium">{i.name}</span>
                  <div className="h-15 mx-2 w-px bg-input" />
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={handleRemoveFilter(filter)}
                  >
                    <X size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div
          key={`${key}_${index}`}
          className="font-inter bg-backgroundPrimary border-borderAccent ml-1 flex flex-row rounded-md border p-1 text-primary"
        >
          <span className="text-sm font-medium">{content}</span>
          <div className="h-15 mx-2 w-px bg-input" />
          <div
            className="flex cursor-pointer items-center"
            onClick={handleRemoveFilter(filter)}
          >
            <X size={16} />
          </div>
        </div>
      );
    },
    [filtersState, handleRemoveFilter]
  );

  const renderSelectedFilters = useCallback(() => {
    const isEmpty = Object.keys(filtersState).length === 0;

    return (
      <div
        className="mt-5 flex w-full space-x-2"
        style={{
          transition:
            'transition: height 50ms cubic-bezier(0.17, 0.04, 0.03, 0.94)',
          height: isEmpty ? '0px' : '30px',
        }}
      >
        {Object.keys(filtersState).map(renderSelectedFilter)}
      </div>
    );
  }, [filtersState, renderSelectedFilter]);

  const renderAllFilters = useCallback(() => {
    return (
      <div className="flex flex-col">
        {config.map((i) => (
          <div className="mt-3" key={i.fieldName}>
            {renderFilter(i)}
          </div>
        ))}
      </div>
    );
  }, [config, renderFilter]);

  const renderDrawer = useCallback(() => {
    return (
      <Sheet
        isOpen={showDrawer}
        changeIsOpen={setShowDrawer}
        title={'all_filters'}
      >
        {renderAllFilters()}
      </Sheet>
    );
  }, [renderAllFilters, showDrawer]);

  return (
    <div className="flex h-full flex-col items-center">
      {renderFilters()}
      {renderSelectedFilters()}
      {renderDrawer()}
    </div>
  );
};

export default memo(Filters);
