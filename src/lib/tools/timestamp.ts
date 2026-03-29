import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export interface TimestampConversionRow {
  label: string;
  value: string;
}

export function parseTimestampInput(input: string): dayjs.Dayjs | null {
  const num = Number(input.trim());
  if (isNaN(num)) return null;
  if (num > 1e12) {
    return dayjs(num);
  }
  return dayjs.unix(num);
}

export function parseDateInput(input: string): dayjs.Dayjs | null {
  const d = dayjs(input.trim());
  return d.isValid() ? d : null;
}

export function buildTimestampRows(d: dayjs.Dayjs): TimestampConversionRow[] {
  return [
    { label: 'Unix (seconds)', value: String(d.unix()) },
    { label: 'Unix (milliseconds)', value: String(d.valueOf()) },
    { label: 'ISO 8601', value: d.toISOString() },
    { label: 'UTC', value: d.utc().format('ddd, DD MMM YYYY HH:mm:ss [UTC]') },
    { label: 'Local', value: d.format('YYYY-MM-DD HH:mm:ss Z') },
    { label: 'Relative', value: d.fromNow() },
  ];
}
