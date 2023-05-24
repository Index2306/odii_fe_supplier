/* --- STATE --- */
export interface dataEmployees {
  data: any;
}

export interface EmployeesState extends dataEmployees {
  loading: boolean;
  detail: any;
  dataRole: any;
  listSelected: any;
  dataSourceIds: any;
}

export type ContainerState = EmployeesState;
