/* --- STATE --- */
export interface dataAccountantHandleWithdrawal {
  data: any;
}

export interface AccountantHandleWithdrawalState
  extends dataAccountantHandleWithdrawal {
  loading: boolean;
  detail: any;
  timeline: any;
  listSelected: any;
}

export type ContainerState = AccountantHandleWithdrawalState;
