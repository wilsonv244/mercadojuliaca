import { BianApiResponse } from "../bianAdapter/BianErrorInternalAdapter";

export interface User {
  UserID: number;
  UserName: string;
  LastAccessDate: string; // or Date if you will parse it later
  RegistrationDate: string; // or Date if you will parse it later
}

export interface UserProfile {
  ProfileID: string;
  ProfileName: string;
  IsActive: boolean;
  Users: User[];
}

export interface UserManagementProfile extends BianApiResponse {
  UserProfiles?: UserProfile[];
}

export interface DataTableUserProfiels {
  ProfileID: string;
  ProfileName: string;
  IsActive: boolean;
  UserID: number;
  UserName: string;
  LastAccessDate: string; // or Date if you will parse it later
  RegistrationDate: string; // or Date if you will parse it later
}

export interface dtPerfiles {
  lsPerfiles: DataTableUserProfiels[];
}
