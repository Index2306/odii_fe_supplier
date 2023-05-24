/* --- STATE --- */
export interface dataRevenue {
  data: any;
}

export interface RevenueState extends dataRevenue {
  loading: boolean;
  detail: any;
  dataBalance: any;
  showEmptyPage: any;
  isFirst: any;
  timeline: any;
}

export type ContainerState = RevenueState;
