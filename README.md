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

 Architecture
Technology Stack
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Stack                            │
├─────────────────────────────────────────────────────────────┤
│  React 19           │ UI Framework                          │
│  TypeScript         │ Type Safety                           │
│  Ant Design 6       │ Component Library                     │
│  Zustand 5          │ State Management                      │
│  Vite 8             │ Build Tool                            │
│  Axios              │ HTTP Client (optional)                │
└─────────────────────────────────────────────────────────────┘
High-Level Architecture
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │CategorySection│ │ CartSummary  │ │   BudgetWarning      │ │
│  │  (7 categories)│ │ (sticky)    │ │   (progress bar)     │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Zustand Store                           │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Actions: select │ deselect │ undo │ redo │ clear      ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │  State: selections │ totalCost │ remainingBudget       ││
│  │         disabledItems │ error │ warning                 ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │  History: past[ ] → present → future[ ]                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────────┐
│  Budget Engine   │ │Compatibility │ │   History Engine     │
│  • canAfford()   │ │   Engine     │ │  • saveToHistory()   │
│  • getPercentage │ │ • getDisabled│ │  • undo()            │
│  • getStatus     │ │ • isCompatible│ │  • redo()            │
└──────────────────┘ └──────────────┘ └──────────────────────┘

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
src/features/bundle-builder/ ← Complete feature in one folder
├── components/ ← UI components (only for this feature)
├── store/ ← State management (feature-specific)
├── logic/ ← Business rules (pure functions)
├── services/ ← External communication
├── hooks/ ← React hooks (feature-specific)
├── types/ ← TypeScript definitions
└── data/ ← Static data (mock products)



Undo/Redo System
Core Pattern: Past/Present/Future
This is the heart of the undo/redo functionality. Unlike command pattern alternatives, this approach stores complete state snapshots for simplicity and reliability.
interface HistoryState<T> {
  past: T[]      // All previous states (undo history)
  present: T     // Current active state
  future: T[]    // States that were undone (redo history)
}

