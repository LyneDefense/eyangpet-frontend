import api from './index'

export interface ProductCategory {
  id: number
  name: string
  description?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  categoryId: number
  name: string
  description?: string
  price?: number
  priceUnit?: string
  images: string[]
  tags: string[]
  isActive: boolean
  sortOrder: number
  categoryName?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 前端展示接口
export const getActiveCategories = () => {
  return api.get<ApiResponse<ProductCategory[]>>('/product-categories')
}

export const getActiveProducts = (categoryId?: number) => {
  return api.get<ApiResponse<Product[]>>('/products', {
    params: categoryId ? { categoryId } : {}
  })
}

export const getProduct = (id: number) => {
  return api.get<ApiResponse<Product>>(`/products/${id}`)
}

// 后台管理接口 - 分类
export const adminGetCategories = () => {
  return api.get<ApiResponse<ProductCategory[]>>('/admin/product-categories')
}

export const adminCreateCategory = (data: Partial<ProductCategory>) => {
  return api.post<ApiResponse<ProductCategory>>('/admin/product-categories', data)
}

export const adminUpdateCategory = (id: number, data: Partial<ProductCategory>) => {
  return api.put<ApiResponse<ProductCategory>>(`/admin/product-categories/${id}`, data)
}

export const adminDeleteCategory = (id: number) => {
  return api.delete<ApiResponse<void>>(`/admin/product-categories/${id}`)
}

export const adminToggleCategory = (id: number) => {
  return api.put<ApiResponse<ProductCategory>>(`/admin/product-categories/${id}/toggle`)
}

export const adminSortCategories = (items: { id: number; sortOrder: number }[]) => {
  return api.put<ApiResponse<void>>('/admin/product-categories/sort', { items })
}

// 后台管理接口 - 商品
export const adminGetProducts = (params?: {
  categoryId?: number
  isActive?: boolean
  keyword?: string
}) => {
  return api.get<ApiResponse<Product[]>>('/admin/products', { params })
}

export const adminGetProduct = (id: number) => {
  return api.get<ApiResponse<Product>>(`/admin/products/${id}`)
}

export const adminCreateProduct = (data: Partial<Product>) => {
  return api.post<ApiResponse<Product>>('/admin/products', data)
}

export const adminUpdateProduct = (id: number, data: Partial<Product>) => {
  return api.put<ApiResponse<Product>>(`/admin/products/${id}`, data)
}

export const adminDeleteProduct = (id: number) => {
  return api.delete<ApiResponse<void>>(`/admin/products/${id}`)
}

export const adminToggleProduct = (id: number) => {
  return api.put<ApiResponse<Product>>(`/admin/products/${id}/toggle`)
}

export const adminSortProducts = (items: { id: number; sortOrder: number }[]) => {
  return api.put<ApiResponse<void>>('/admin/products/sort', { items })
}
