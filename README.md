 How to Run the Project
Prerequisites
Node.js (v18 or higher)

npm (v9 or higher)

Installation Steps
bash
# 1. Navigate to project directory
cd smart-bundle-builder

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser and navigate to:
# http://localhost:5173/
Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
---
## 1. Architecture Type: Feature-Based Modular

### Why Feature-Based?

Traditional folder structures organize by technical role (components/, containers/, services/). This project uses **feature-based organization** where all code for a specific business capability lives together.

### Comparison

| Aspect | Technical Organization | Feature-Based Organization |
|--------|----------------------|---------------------------|
| **Cohesion** | Low (related code scattered) | High (all code together) |
| **Navigation** | Requires jumping between folders | Everything in one place |
| **Code Splitting** | Difficult (intertwined dependencies) | Easy (feature boundaries clear) |
| **Team Work** | Merge conflicts common | Isolated features prevent conflicts |
| **Reusability** | Low (tight coupling) | High (features are self-contained) |

### Structure Example
src/features/bundle-builder/
├── components/     # UI components (12 files)
├── store/          # Zustand state management
├── logic/          # Pure business functions
├── services/       # localStorage, PDF export
├── hooks/          # Custom React hooks
├── types/          # TypeScript definitions
└── data/           # Mock products (34 items, 7 categories)



Your Architectural Approach to the Undo/Redo State Logic
The Undo/Redo system in the Smart Bundle Builder is implemented using a Past/Present/Future pattern integrated with Zustand state management. This approach provides a robust, immutable history tracking system without external dependencies.

The system maintains three arrays: past which stores all previous states, present which holds the current state, and future which contains states that were undone. When a user performs an action like selecting a product, the current state is pushed to the past array, the new state becomes present, and the future array is cleared to create a new timeline branch. This branching behavior is critical because when a user undoes an action and then performs a new action, the previously undone states should no longer be available for redo.

When the user clicks Undo or presses Ctrl+Z, the system takes the last state from past, moves the current present state to the beginning of future, and restores the previous state as present. The Redo operation does the opposite, taking the first state from future and restoring it. All operations are O(1) complexity, making them extremely fast regardless of history length.

I chose this pattern over alternatives like the Command Pattern because it is simpler, requires less memory, and provides natural time-travel debugging support through Redux DevTools. The Command Pattern would require storing command objects and re-executing them, which is slower and more complex. With Past/Present/Future, I directly restore complete state snapshots, which is both faster and easier to reason about.

The history logic is encapsulated inside the Zustand store as private variables. Only the undo and redo actions are exposed publicly. The store also provides canUndo and canRedo selectors that components use to disable buttons when appropriate. The system captures history only when state actually changes, using deep comparison to avoid unnecessary saves. The Undo/Redo controls are fully accessible with keyboard shortcuts (Ctrl+Z for undo, Ctrl+Y or Ctrl+Shift+Z for redo) and ARIA labels for screen readers.
}

