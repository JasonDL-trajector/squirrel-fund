import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // hour12: true,
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

export const getWeek = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

  const dates = [];
  for (let d = new Date(sevenDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };
  return dates.map((date) => date.toLocaleDateString('en-US', options));
};

export const getAllDays = () => {
  const startDate = new Date('2024-07-08');
  const today = new Date();

  const dates = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };
  return dates.map((date) => date.toLocaleDateString('en-US', options));
};


export function validateLoginForm(email: string, password: string) {
  return email.length > 0 && password.length > 0;
}

export function validateRegisterForm(email: string, password: string, confirmPassword: string) {
  return email.length > 0 && password.length > 0 && password === confirmPassword;
}
