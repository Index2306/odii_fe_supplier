/* --- STATE --- */
export interface dataAffiliate {
  dataListPayout: any;
  dataListAffiliater: any;
}

export interface AffiliateState extends dataAffiliate {
  loading: boolean;
  showEmptyPageListPayout: boolean;
  showEmptyPageListAffiliater: any;
  isFirstListPayout: boolean;
  isFirstListAffiliater: boolean;
  detail: any;
  timeline: any;
  listSelected: any;
  dataStatisticalAffiliate: any;
  dataListPeriodPayout: any;
  dataTopAffiliater: any;
  dataListOrderSeller: any;
}

export type ContainerState = AffiliateState;
