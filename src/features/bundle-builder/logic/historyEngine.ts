export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

/**
 * إنشاء حالة تاريخ جديدة
 */
export const createHistoryState = <T>(initialState: T): HistoryState<T> => ({
  past: [],
  present: initialState, 
  future: []
})

/**
 * إضافة حالة جديدة إلى التاريخ
 */
export const addToHistory = <T>(
  history: HistoryState<T>,
  newState: T
): HistoryState<T> => {
  // لا نضيف إذا كانت الحالة الجديدة نفس الحالة الحالية
  if (JSON.stringify(history.present) === JSON.stringify(newState)) {
    return history
  }
  
  return {
    past: [...history.past, history.present],
    present: newState,
    future: [] // مسح المستقبل عند إجراء جديد
  }
}

/**
 * التراجع عن آخر إجراء
 */
export const undo = <T>(history: HistoryState<T>): HistoryState<T> => {
  if (history.past.length === 0) return history
  
  const previous = history.past[history.past.length - 1]
  const newPast = history.past.slice(0, -1)
  
  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future]
  }
}

/**
 * إعادة الإجراء الذي تم التراجع عنه
 */
export const redo = <T>(history: HistoryState<T>): HistoryState<T> => {
  if (history.future.length === 0) return history
  
  const next = history.future[0]
  const newFuture = history.future.slice(1)
  
  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture
  }
}

/**
 * التحقق من إمكانية التراجع
 */
export const canUndo = <T>(history: HistoryState<T>): boolean => {
  return history.past.length > 0
}

/**
 * التحقق من إمكانية الإعادة
 */
export const canRedo = <T>(history: HistoryState<T>): boolean => {
  return history.future.length > 0
}

/**
 * الحصول على عدد الإجراءات في التاريخ
 */
export const getHistoryStats = <T>(history: HistoryState<T>) => ({
  pastCount: history.past.length,
  futureCount: history.future.length,
  totalActions: history.past.length + history.future.length + 1
})