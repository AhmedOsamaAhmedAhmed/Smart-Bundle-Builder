import React, { useEffect } from 'react'

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // إضافة live region للـ screen readers
  useEffect(() => {
	// Create live region if it doesn't exist
	if (!document.getElementById('a11y-live-region')) {
	  const liveRegion = document.createElement('div')
	  liveRegion.id = 'a11y-live-region'
	  liveRegion.setAttribute('aria-live', 'polite')
	  liveRegion.setAttribute('aria-atomic', 'true')
	  liveRegion.style.position = 'absolute'
	  liveRegion.style.width = '1px'
	  liveRegion.style.height = '1px'
	  liveRegion.style.margin = '-1px'
	  liveRegion.style.padding = '0'
	  liveRegion.style.overflow = 'hidden'
	  liveRegion.style.clip = 'rect(0, 0, 0, 0)'
	  liveRegion.style.border = '0'
	  document.body.appendChild(liveRegion)
	}

	// Add keyboard shortcut hint
	const handleFirstFocus = () => {
	  const hint = document.createElement('div')
	  hint.setAttribute('aria-live', 'polite')
	  hint.setAttribute('class', 'a11y-hint')
	  hint.textContent = 'Use Tab to navigate, Enter or Space to select, Ctrl+Z to undo, Ctrl+Y to redo'
	  hint.style.position = 'absolute'
	  hint.style.width = '1px'
	  hint.style.height = '1px'
	  hint.style.margin = '-1px'
	  hint.style.padding = '0'
	  hint.style.overflow = 'hidden'
	  document.body.appendChild(hint)
	  setTimeout(() => hint.remove(), 5000)
	  document.removeEventListener('focus', handleFirstFocus)
	}

	document.addEventListener('focus', handleFirstFocus, { once: true })

	return () => {
	  const liveRegion = document.getElementById('a11y-live-region')
	  if (liveRegion) liveRegion.remove()
	  document.removeEventListener('focus', handleFirstFocus)
	}
  }, [])

  return <>{children}</>
}