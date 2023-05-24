/* --- STATE --- */
export interface dataMyProfile {
  data: any;
}

export interface MyProfileState extends dataMyProfile {
  loading: boolean;
  detail: any;
}

export type ContainerState = MyProfileState;
