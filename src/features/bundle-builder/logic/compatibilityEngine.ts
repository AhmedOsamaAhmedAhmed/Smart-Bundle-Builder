import { Product } from '../types/bundle.types'

/**
 * الحصول على جميع المنتجات المعطلة بسبب عدم التوافق
 */
export const getDisabledItems = (
  selections: Record<string, string>,
  products: Product[]
): Set<string> => {
  const disabled = new Set<string>()
  
  // الحصول على جميع المنتجات المختارة حالياً
  const selectedProducts = Object.values(selections)
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined)
  
  // لكل منتج مختار، أضف جميع المنتجات غير المتوافقة معه
  for (const selectedProduct of selectedProducts) {
    if (selectedProduct.incompatibleWith && selectedProduct.incompatibleWith.length > 0) {
      for (const incompatibleId of selectedProduct.incompatibleWith) {
        disabled.add(incompatibleId)
      }
    }
  }
  
  return disabled
}

/**
 * التحقق مما إذا كان منتج معين متوافق مع الاختيارات الحالية
 */
export const isCompatible = (
  productId: string,
  selections: Record<string, string>,
  products: Product[]
): boolean => {
  // إذا لم تكن هناك اختيارات، كل شيء متوافق
  if (Object.keys(selections).length === 0) return true
  
  const disabledItems = getDisabledItems(selections, products)
  return !disabledItems.has(productId)
}

/**
 * الحصول على سبب عدم التوافق
 */
export const getIncompatibilityReason = (
  productId: string,
  selections: Record<string, string>,
  products: Product[]
): string | null => {
  const product = products.find(p => p.id === productId)
  if (!product) return null
  
  const selectedProducts = Object.values(selections)
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined)
  
  for (const selectedProduct of selectedProducts) {
    if (selectedProduct.incompatibleWith.includes(productId)) {
      return `${product.name} is not compatible with ${selectedProduct.name}`
    }
  }
  
  return null
}

/**
 * التحقق من التوافق عند إضافة منتج جديد
 */
export const validateCompatibilityForNewSelection = (
  newProductId: string,
  currentSelections: Record<string, string>,
  products: Product[]
): { isValid: boolean; reason: string | null } => {
  // التحقق من التوافق
  const isCompatible = (() => {
    if (Object.keys(currentSelections).length === 0) return true
    
    const disabledItems = getDisabledItems(currentSelections, products)
    return !disabledItems.has(newProductId)
  })()
  
  if (!isCompatible) {
    const reason = getIncompatibilityReason(newProductId, currentSelections, products)
    return { isValid: false, reason: reason || 'Compatibility check failed' }
  }
  
  return { isValid: true, reason: null }
}