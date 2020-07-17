export interface CountDown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
export interface CountExpiration {
  unit: string;
  value: number;
}

export interface ComingSoonInfo {
  content: string;
  date: string;
  title: string;
}
