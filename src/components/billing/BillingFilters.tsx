'use client';

import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type BillingFiltersProps = {
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  status: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function BillingFilters({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: BillingFiltersProps) {
  const t = useTranslations('billing');

  const handleClearFilters = () => {
    onDateRangeChange({ from: undefined, to: undefined });
    onStatusChange('all');
    onSearchChange('');
  };

  const hasActiveFilters = dateRange.from || dateRange.to || status !== 'all' || searchQuery;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full md:w-[300px] justify-start text-left font-normal',
                !dateRange.from && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {dateRange.from
                ? (
                    dateRange.to
                      ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')}
                            {' '}
                            -
                            {' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        )
                      : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                  )
                : (
                    <span>{t('pickDateRange')}</span>
                  )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange as any}
              onSelect={range => onDateRangeChange(range || { from: undefined, to: undefined })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('selectStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="draft">{t('status.draft')}</SelectItem>
            <SelectItem value="pending">{t('status.pending')}</SelectItem>
            <SelectItem value="paid">{t('status.paid')}</SelectItem>
            <SelectItem value="partial">{t('status.partial')}</SelectItem>
            <SelectItem value="overdue">{t('status.overdue')}</SelectItem>
            <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="mr-2 size-4" />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
