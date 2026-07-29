// src/types/category.types.ts
export type ICategoryFilterOptions = {
  searchTerm?: string;
  isActive?: boolean;
};

export type ICreateCategoryPayload = {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
};

export type IUpdateCategoryPayload = Partial<ICreateCategoryPayload>;