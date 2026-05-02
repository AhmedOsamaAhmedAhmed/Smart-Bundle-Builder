import axios from 'axios'
import { Product, Category } from '../types/bundle.types'

const API_URL = 'http://localhost:3001'

export interface SavedBuild {
  id: string
  name: string
  selections: Record<Category, string>
  totalCost: number
  createdAt: string
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
})

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products')
    return response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}

// Fetch single product
export const fetchProduct = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    throw error
  }
}

// Save build to server
export const saveBuild = async (build: Omit<SavedBuild, 'id' | 'createdAt'>): Promise<SavedBuild> => {
  try {
    const response = await api.post('/builds', {
      ...build,
      createdAt: new Date().toISOString()
    })
    return response.data
  } catch (error) {
    console.error('Failed to save build:', error)
    throw error
  }
}

// Load builds from server
export const loadBuilds = async (): Promise<SavedBuild[]> => {
  try {
    const response = await api.get('/builds')
    return response.data
  } catch (error) {
    console.error('Failed to load builds:', error)
    throw error
  }
}

// Load specific build
export const loadBuild = async (id: string): Promise<SavedBuild> => {
  try {
    const response = await api.get(`/builds/${id}`)
    return response.data
  } catch (error) {
    console.error(`Failed to load build ${id}:`, error)
    throw error
  }
}

// Delete build
export const deleteBuild = async (id: string): Promise<void> => {
  try {
    await api.delete(`/builds/${id}`)
  } catch (error) {
    console.error(`Failed to delete build ${id}:`, error)
    throw error
  }
}

// Update build
export const updateBuild = async (id: string, build: Partial<SavedBuild>): Promise<SavedBuild> => {
  try {
    const response = await api.patch(`/builds/${id}`, build)
    return response.data
  } catch (error) {
    console.error(`Failed to update build ${id}:`, error)
    throw error
  }
}