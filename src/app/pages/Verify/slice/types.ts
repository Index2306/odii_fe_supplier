/* --- STATE --- */

export enum RepoErrorType {
  RESPONSE_ERROR = 1,
  USER_NOT_FOUND = 2,
}

export interface VerifyState {
  loading: boolean;
  error?: RepoErrorType | null;
  repositories: object;
}

export type ContainerState = VerifyState;
