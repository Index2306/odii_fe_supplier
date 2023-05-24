/* --- STATE --- */
export interface dataTransactions {
  data: any;
}

export interface TransactionsState extends dataTransactions {
  loading: boolean;
  detail: any;
  timeline: any;
}

export type ContainerState = TransactionsState;
