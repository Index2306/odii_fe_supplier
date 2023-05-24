/* --- STATE --- */
export interface dataAccountantHandleDeposit {
  data: any;
}

export interface AccountantHandleDepositState
  extends dataAccountantHandleDeposit {
  loading: boolean;
  detail: any;
  timeline: any;
  listSelected: any;
}

export type ContainerState = AccountantHandleDepositState;
