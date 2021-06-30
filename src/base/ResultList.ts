export type ResultList<T> = {
  page: number;
  pages: number;
  limit: number;
  total: number;
  items: T[];
};
