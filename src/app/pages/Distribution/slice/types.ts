/* --- STATE --- */
export interface dataDistributions {
  data: any;
}

export interface DistributionsState extends dataDistributions {
  loading: boolean;
  detail: any;
  total_detail: any;
}

export type ContainerState = DistributionsState;
