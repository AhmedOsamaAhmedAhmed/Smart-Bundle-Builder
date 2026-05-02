import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Product, Category, BundleStore, BUDGET_LIMIT } from '../types/bundle.types'
import { mockProducts } from '../data/mockProducts'
import { 
  calculateTotalCost, 
  calculateRemainingBudget, 
  canAfford 
} from '../logic/budgetEngine'
import { 
  getDisabledItems, 
  isCompatible, 
  validateCompatibilityForNewSelection 
} from '../logic/compatibilityEngine'

const getSelectedItems = (selections: Record<string, string>, products: Product[]): Product[] => {
  return Object.values(selections)
    .map(productId => products.find(p => p.id === productId))
    .filter((p): p is Product => p !== undefined)
}

const useBundleStore = create<BundleStore>()(
  devtools(
    (set, get) => {
      const initialSelections = {} as Record<Category, string>
      
      let past: Record<Category, string>[] = []
      let present: Record<Category, string> = initialSelections
      let future: Record<Category, string>[] = []

      const saveToHistory = (newSelections: Record<Category, string>) => {
        if (JSON.stringify(present) === JSON.stringify(newSelections)) return
        past = [...past, present]
        present = newSelections
        future = []
      }

      const handleUndo = () => {
        if (past.length === 0) return false
        const previous = past[past.length - 1]
        past = past.slice(0, -1)
        future = [present, ...future]
        present = previous
        return true
      }

      const handleRedo = () => {
        if (future.length === 0) return false
        const next = future[0]
        future = future.slice(1)
        past = [...past, present]
        present = next
        return true
      }

      const applyHistoryState = () => {
        const state = get()
        const newSelectedItems = getSelectedItems(present, state.products)
        const newTotalCost = calculateTotalCost(newSelectedItems)
        const newRemainingBudget = calculateRemainingBudget(newTotalCost)
        const newDisabledItems = getDisabledItems(present, state.products)

        set({
          selections: present,
          selectedItems: newSelectedItems,
          totalCost: newTotalCost,
          remainingBudget: newRemainingBudget,
          disabledItems: newDisabledItems,
          error: null
        })
      }

      return {
        products: mockProducts,
        selections: initialSelections,
        selectedItems: [],
        totalCost: 0,
        remainingBudget: BUDGET_LIMIT,
        disabledItems: new Set<string>(),
        error: null,
        warning: null,
        budgetWarning: false,
        isLoading: false,

        updateStateWithHistory: (newSelections: Record<Category, string>) => {
          const { products } = get()
          saveToHistory(newSelections)

          const newSelectedItems = getSelectedItems(newSelections, products)
          const newTotalCost = calculateTotalCost(newSelectedItems)
          const newRemainingBudget = calculateRemainingBudget(newTotalCost)
          const newDisabledItems = getDisabledItems(newSelections, products)

          set({
            selections: newSelections,
            selectedItems: newSelectedItems,
            totalCost: newTotalCost,
            remainingBudget: newRemainingBudget,
            disabledItems: newDisabledItems,
            error: null,
            budgetWarning: false
          })
        },

        selectItem: (category: Category, productId: string) => {
          console.log(`[Store] Selecting ${productId} for ${category}`)
          
          const state = get()
          const { products, selections, isLoading } = state
          
          if (isLoading) {
            console.warn('[Store] Cannot select while loading')
            return
          }
          
          const selectedProduct = products.find(p => p.id === productId)
          if (!selectedProduct) {
            set({ error: `Product ${productId} not found` })
            return
          }
          
          const compatibilityCheck = validateCompatibilityForNewSelection(productId, selections, products)
          if (!compatibilityCheck.isValid) {
            console.warn(`[Store] ${compatibilityCheck.reason}`)
            set({ 
              error: compatibilityCheck.reason,
              warning: compatibilityCheck.reason
            })
            setTimeout(() => set({ warning: null }), 3000)
            return
          }
          
          const currentSelectedItems = getSelectedItems(selections, products)
          
          if (!canAfford(currentSelectedItems, selectedProduct)) {
            const errorMsg = `Cannot select ${selectedProduct.name}: exceeds $${BUDGET_LIMIT} budget`
            console.warn(`[Store] ${errorMsg}`)
            set({ 
              error: errorMsg,
              budgetWarning: true
            })
            setTimeout(() => set({ budgetWarning: false, error: null }), 3000)
            return
          }
          
          const newSelections = { ...selections, [category]: productId }
          console.log('[Store] New selections:', newSelections)
          get().updateStateWithHistory(newSelections)
        },
        
        deselectItem: (category: Category) => {
          console.log(`[Store] Deselecting ${category}`)
          
          const state = get()
          const { selections } = state
          
          if (!selections[category]) {
            console.warn(`[Store] No selection found for ${category}`)
            return
          }
          
          const newSelections = { ...selections }
          delete newSelections[category]
          
          console.log('[Store] New selections after deselect:', newSelections)
          get().updateStateWithHistory(newSelections)
        },
        
        clearAllSelections: () => {
          console.log('[Store] Clearing all selections')
          const newSelections = {} as Record<Category, string>
          get().updateStateWithHistory(newSelections)
        },

        undo: () => {
          if (handleUndo()) {
            applyHistoryState()
          }
        },
        
        redo: () => {
          if (handleRedo()) {
            applyHistoryState()
          }
        },

        canUndo: () => past.length > 0,
        canRedo: () => future.length > 0,

        setError: (error) => set({ error }),
        setWarning: (warning) => set({ warning }),
        setLoading: (isLoading) => set({ isLoading }),

        checkCompatibility: (productId) => {
          const { selections, products } = get()
          return isCompatible(productId, selections, products)
        },

        isItemDisabled: (productId) => {
          return get().disabledItems.has(productId)
        },

        // ✅ إضافة loadBuild و saveBuild داخل الـ store
        loadBuild: (savedSelections: Record<Category, string>) => {
          console.log('[Store] Loading saved build:', savedSelections)
          get().updateStateWithHistory(savedSelections)
        },

        saveBuild: () => {
          const { selections } = get()
          return selections
        }
      }
    },
    { name: 'BundleStore', enabled: process.env.NODE_ENV === 'development' }
  )
)

// ========== Selectors ==========
export const useSelectedItems = () => useBundleStore(state => state.selectedItems)
export const useTotalCost = () => useBundleStore(state => state.totalCost)
export const useRemainingBudget = () => useBundleStore(state => state.remainingBudget)
export const useError = () => useBundleStore(state => state.error)
export const useWarning = () => useBundleStore(state => state.warning)
export const useBudgetWarning = () => useBundleStore(state => state.budgetWarning)
export const useDisabledItems = () => useBundleStore(state => state.disabledItems)
export const useIsLoading = () => useBundleStore(state => state.isLoading)
export const useSelections = () => useBundleStore(state => state.selections)
export const useCanUndo = () => useBundleStore(state => state.canUndo())
export const useCanRedo = () => useBundleStore(state => state.canRedo())

export default useBundleStore