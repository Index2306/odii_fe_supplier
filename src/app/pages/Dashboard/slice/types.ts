/* --- STATE --- */
export interface dataDashboard {
  data: any;
}

export interface DashboardState extends dataDashboard {
  loading: boolean;
  detail: any;
}

export type ContainerState = DashboardState;
