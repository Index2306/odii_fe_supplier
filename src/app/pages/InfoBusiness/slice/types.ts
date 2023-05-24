/* --- STATE --- */
export interface dataInfoBusiness {
  data: any;
}

export interface InfoBusinessState extends dataInfoBusiness {
  loading: boolean;
  detail: any;
  dataBanksSupplier: any;
}

export type ContainerState = InfoBusinessState;
