// src/types/category.types.ts
export type ICategoryFilterRequest = {
  search?: string;
  isActive?: boolean;
};

export type ICreateCategory = {
  name: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
};

export type IUpdateCategory = Partial<ICreateCategory>;

