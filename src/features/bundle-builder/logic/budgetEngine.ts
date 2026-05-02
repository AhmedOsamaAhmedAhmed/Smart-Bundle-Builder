import { Product, BUDGET_LIMIT } from '../types/bundle.types'

/**
 * حساب التكلفة الإجمالية للمنتجات المختارة
 */
export const calculateTotalCost = (selectedItems: Product[]): number => {
  return selectedItems.reduce((sum, item) => sum + item.price, 0)
}

/**
 * حساب الميزانية المتبقية
 */
export const calculateRemainingBudget = (totalCost: number): number => {
  return BUDGET_LIMIT - totalCost
}

/**
 * التحقق مما إذا كان المنتج يمكن شراؤه ضمن الميزانية
 */
export const canAfford = (
  currentSelectedItems: Product[],
  newProduct: Product
): boolean => {
  const currentTotal = calculateTotalCost(currentSelectedItems)
  return currentTotal + newProduct.price <= BUDGET_LIMIT
}

/**
 * الحصول على نسبة استخدام الميزانية (لشريط التقدم)
 */
export const getBudgetPercentage = (totalCost: number): number => {
  return Math.min((totalCost / BUDGET_LIMIT) * 100, 100)
}

/**
 * الحصول على حالة الميزانية
 */
export const getBudgetStatus = (totalCost: number): 'normal' | 'warning' | 'error' => {
  const percentage = getBudgetPercentage(totalCost)
  if (percentage >= 100) return 'error'
  if (percentage >= 80) return 'warning'
  return 'normal'
}

/**
 * الحصول على رسالة الميزانية المناسبة
 */
export const getBudgetMessage = (totalCost: number): string => {
  const remaining = BUDGET_LIMIT - totalCost
  if (remaining < 0) {
    return `Budget exceeded by $${Math.abs(remaining)}`
  }
  if (remaining < 200) {
    return `Only $${remaining} remaining!`
  }
  return `$${remaining} remaining`
}

/**
 * التحقق من صحة الميزانية للاختيارات المتعددة
 */
export const validateBudgetForSelections = (
  currentSelections: Record<string, string>,
  newSelections: Record<string, string>,
  products: Product[]
): boolean => {
  const getSelectedProducts = (selections: Record<string, string>) => {
    return Object.values(selections)
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined)
  }

  const newTotal = calculateTotalCost(getSelectedProducts(newSelections))
  return newTotal <= BUDGET_LIMIT
}