// src/types/auth.types.ts
import { Role } from "./enums";

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type IUpdateUserProfile = {
  name?: string;
  profileImage?: string;
};

export type ICreateAddress = {
  label?: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode?: string;
  isDefault?: boolean;
};

export type IUpdateAddress = Partial<ICreateAddress>;