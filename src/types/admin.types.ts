// src/types/admin.types.ts
import { Role, UserStatus } from "./enums";

export type IUserFilterOptions = {
  searchTerm?: string;
  role?: Role;
  status?: UserStatus;
};

export type IUpdateUserStatusPayload = {
  status: UserStatus;
};