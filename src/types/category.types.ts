// src/types/category.types.ts
import type { BaseCacheOptions } from "@/lib/cache-utils";
import type { IPaginationOptions } from "./index";

export type ICategoryFilterOptions = {
  searchTerm?: string;
  isActive?: boolean;
};


export interface GetCategoriesOptions
  extends BaseCacheOptions,
    ICategoryFilterOptions,
    IPaginationOptions {}


export type ICreateCategoryPayload = {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
};

export type IUpdateCategoryPayload = Partial<ICreateCategoryPayload>;