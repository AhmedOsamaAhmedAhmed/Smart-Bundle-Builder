import { Button, Space, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons'
import { useCanRedo, useCanUndo } from '../store/bundleStore'

import useBundleStore from '../store/bundleStore'

const UndoRedoControls: React.FC = () => {
  const undo = useBundleStore(state => state.undo)
  const redo = useBundleStore(state => state.redo)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
 
  // Announce undo/redo actions to screen readers
  useEffect(() => {
    const handleUndoRedoAnnounce = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey && canUndo) {
        const liveRegion = document.getElementById('a11y-live-region')
        if (liveRegion) liveRegion.textContent = 'Undo performed'
        setTimeout(() => {
          if (liveRegion) liveRegion.textContent = ''
        }, 1000)
      }
      if (((event.ctrlKey || event.metaKey) && event.key === 'y') || 
          ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')) {
        if (canRedo) {
          const liveRegion = document.getElementById('a11y-live-region')
          if (liveRegion) liveRegion.textContent = 'Redo performed'
          setTimeout(() => {
            if (liveRegion) liveRegion.textContent = ''
          }, 1000)
        }
      }
    }

    window.addEventListener('keydown', handleUndoRedoAnnounce)
    return () => window.removeEventListener('keydown', handleUndoRedoAnnounce)
  }, [canUndo, canRedo])

  const handleUndo = () => {
    undo()
    const liveRegion = document.getElementById('a11y-live-region')
    if (liveRegion) liveRegion.textContent = 'Undo performed'
    setTimeout(() => {
      if (liveRegion) liveRegion.textContent = ''
    }, 1000)
  }

  const handleRedo = () => {
    redo()
    const liveRegion = document.getElementById('a11y-live-region')
    if (liveRegion) liveRegion.textContent = 'Redo performed'
    setTimeout(() => {
      if (liveRegion) liveRegion.textContent = ''
    }, 1000)
  }

  return (
    <Space role="group" aria-label="Undo and Redo controls">
      <Tooltip title={canUndo ? "Undo last action (Ctrl+Z)" : "No actions to undo"}>
        <Button
          icon={<UndoOutlined />}
          onClick={handleUndo}
          disabled={!canUndo}
          size="middle"
          aria-label="Undo last action"
          aria-keyshortcuts="Ctrl+Z"
        >
          Undo
        </Button>
      </Tooltip>
      
      <Tooltip title={canRedo ? "Redo last undone action (Ctrl+Y)" : "No actions to redo"}>
        <Button
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={!canRedo}
          size="middle"
          aria-label="Redo last undone action"
          aria-keyshortcuts="Ctrl+Y"
        >
          Redo
        </Button>
      </Tooltip>
    </Space>
  )
}

export default UndoRedoControls