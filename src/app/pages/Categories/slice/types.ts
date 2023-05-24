/* --- STATE --- */
export interface dataCategories {
  data: any;
}

export interface CategoriesState extends dataCategories {
  loading: boolean;
  detail: any;
}

export type ContainerState = CategoriesState;
