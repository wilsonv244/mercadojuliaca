import { BianApiResponse } from "../bianAdapter/BianErrorInternalAdapter";

export interface UserProfile {
  ProfileID: number;
  ProfileName: string;
}

export interface User {
  UserID: number;
  UserName: string;
  UserProfiles: UserProfile[];
  LastAccessDate: string;
}

export interface UserManagementResponse extends BianApiResponse {
  UserManagement?: {
    UserList: User[];
  };
}
