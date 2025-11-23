import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatDate = (date: Date | number, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(new Date(date), formatStr);
};

export const formatTime = (date: Date | number, formatStr: string = 'HH:mm'): string => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (
  date: Date | number,
  formatStr: string = 'MMM dd, yyyy HH:mm'
): string => {
  return format(new Date(date), formatStr);
};

export const timeAgo = (date: Date | number): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatSmartDate = (date: Date | number): string => {
  const dateObj = new Date(date);
  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm');
  }
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  return format(dateObj, 'MMM dd, yyyy');
};

export const truncateString = (str: string, length: number = 100): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const highlightText = (text: string, query: string): string => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
