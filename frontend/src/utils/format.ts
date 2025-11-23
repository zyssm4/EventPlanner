import { format as dateFnsFormat, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateFnsFormat(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'PPP p');
};

export const formatTime = (date: Date | string): string => {
  return formatDate(date, 'p');
};

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${formatNumber(percentage, 1)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
