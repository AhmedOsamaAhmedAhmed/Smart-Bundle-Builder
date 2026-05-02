export interface Product {
  id: string
  name: string
  price: number
  category: string
  incompatibleWith: string[]
}

export type Category = 
  | 'CPU' 
  | 'Motherboard' 
  | 'RAM' 
  | 'GPU' 
  | 'Power Supply' 
  | 'Storage' 
  | 'Cooling'

export interface BundleState {
  products: Product[]
  selections: Record<Category, string>
  selectedItems: Product[]
  totalCost: number
  remainingBudget: number
  disabledItems: Set<string>
  error: string | null
  warning: string | null
  budgetWarning: boolean
  isLoading: boolean
}

export interface BundleActions {
  selectItem: (category: Category, productId: string) => void
  deselectItem: (category: Category) => void
  clearAllSelections: () => void
  setError: (error: string | null) => void
  setWarning: (warning: string | null) => void
  setLoading: (isLoading: boolean) => void
  checkCompatibility: (productId: string) => boolean
  isItemDisabled: (productId: string) => boolean
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  loadBuild: (selections: Record<Category, string>) => void
  saveBuild: () => Record<Category, string>
}

export type BundleStore = BundleState & BundleActions

export const BUDGET_LIMIT = 1000 