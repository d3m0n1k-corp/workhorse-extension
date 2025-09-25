# Copilot Instructions for Workhorse Extension

## Project Overview

This is a **Chrome extension** built with **React + TypeScript + Vite** that provides a data processing pipeline interface with WebAssembly-powered converters. The extension enables users to create custom data conversion workflows by chaining converters together.

**Core Concepts:**

- **Typed Converters**: Each converter has specific input/output types (JSON, XML, YAML, JSON_STRINGIFIED)
- **Chain Building**: Converters can be chained together where output type of one matches input type of the next
- **Custom Workflows**: Users build reusable data conversion pipelines for different use cases
- **Offline Operation**: Completely offline functionality powered by WASM - inspired by onlinetools.com/json
- **Dual Interface**: Popup for quick conversions, full site for complex pipeline creation

The extension has two main interfaces: a popup for the browser extension and a standalone site mode.

## User Workflow & Interface Design

### Full Site Interface (Pipeline Builder)

The main site (`index.html`) provides comprehensive pipeline building capabilities:

1. **Pipeline Creation**: Users build, test, and iterate on conversion pipelines
2. **Interactive Testing**: Real-time input/output testing with immediate feedback
3. **Data Import Options**: Copy/paste, file upload, drag-drop, and other input methods
4. **Data Export Options**: Copy/paste, file download, clipboard, and multiple output formats
5. **Pipeline Management**: Save, edit, delete, and organize custom pipelines
6. **Pipeline Sharing**: Import/export pipeline definitions as files for sharing
7. **Full Feature Access**: Complete UI with all available converters and configuration options

### Extension Popup (Quick Access)

The popup provides minimal, efficient access to saved pipelines:

1. **Pipeline Selection**: Dropdown or list of saved pipelines only
2. **Quick Input**: File selection or clipboard paste (no large text areas)
3. **Instant Execution**: Run selected pipeline with minimal interaction
4. **Quick Output**: Copy to clipboard or quick export (no detailed views)
5. **Minimal UI**: Essential controls only, small brand logo at bottom
6. **No Pipeline Editing**: Users must use full site for pipeline creation/modification

### Design Philosophy

- **Site = Build & Test**: Full-featured environment for pipeline development
- **Popup = Quick Run**: Fast execution of pre-built pipelines for daily workflow
- **Separation of Concerns**: Complex operations stay in site, simple execution in popup

## Architecture Essentials

### Dual Entry Points

- **Extension popup**: `src/popup/` → `popup.html` (minimal quick-access interface for running saved pipelines)
- **Site interface**: `src/site/` → `index.html` (full pipeline builder with IOView, PipelineView, StepView)

### WebAssembly Integration

The core data processing is handled by a Go-compiled WASM module (`public/workhorse.wasm`):

- **Source Repository**: https://github.com/d3m0n1k-corp/workhorse-core
- **Build Process**: Go 1.24+ with `GOOS=js GOARCH=wasm go build ./api/workhorse.wasm/...`
- **WASM Entry Point**: `api/workhorse.wasm/main.go` registers JS functions and sets up logging
- **Exposed Functions**: `list_converters()`, `execute_converter()`, `chain_execute()`
- **Converter Architecture**: Pluggable converters in `internal/converters/` with registration system
- **Type definitions**: `src/wasm/wasm.d.ts` matches Go's Response/Converter structs
- **Operations wrapper**: `src/wasm/operations.ts` handles WASM JSON responses
- **Initialization**: `src/components/wasm/load-wasm.tsx` - must run before using converters

### State Management (Zustand)

Two main stores in `src/lib/store.ts`:

- `usePipelineStore`: Current pipeline being edited (name, steps array)
- `useSavedPipelineStore`: Persisted pipelines loaded from database

### Database Layer

`src/lib/db/manager.ts` provides a unified interface:

```typescript
DatabaseManager.converter; // Converter definitions from WASM
DatabaseManager.pipeline; // Saved pipeline metadata
DatabaseManager.step; // Pipeline steps with configurations
```

### Component Architecture

- **IO Components** (`src/components/io/`): Input/output text handling
- **Pipeline Components** (`src/components/pipelines/`): Pipeline management UI
- **Step Components** (`src/components/steps/`): Individual step configuration
- **UI Components** (`src/components/ui/`): Radix UI + Tailwind styled components

## Key Development Patterns

### TypeScript Object Types

Core data models in `src/lib/objects.ts`:

- `Pipeline`: Contains name and steps array
- `PipelineStep`: Has id, name, and config array
- `PipelineStepConfig`: type/name/default/value structure
- Separate `*DbObject` types for database persistence

### WASM Response Pattern

All WASM operations return `WasmResponse<T>` with Result/Error structure:

```typescript
const result = list_converters();
if (result.Error) {
  console.error(result.Error);
  return;
}
// Use result.Result
```

### WASM Development Patterns

**WASM Development Patterns:**

**Converter Type System** (core functionality):

- Each converter implements `BaseConverter` interface: `Apply(any) (any, error)`, `InputType()`, `OutputType()`
- **Input/Output Types**: Valid types defined in `internal/common/types/base.go`: JSON, XML, YAML, JSON_STRINGIFIED
- **Chain Validation**: System validates input/output type compatibility between converters
- **Custom Workflows**: Users build reusable conversion pipelines by chaining compatible converters
- **Type Safety**: Chain execution fails if converter types don't match (output→input)

**Converter Registration & Management**:

- Converters auto-register via `converters.Register()` calls in `register.go` files
- Configuration structs implement `BaseConfig` with `Validate() error` method
- Each converter defines demo input, description, and configuration schema

**WASM Build Process**:

```bash
# In workhorse-core repository
make wasm  # Builds to out/wasm/workhorse.wasm
# Copy result to workhorse-extension/public/workhorse.wasm
```

**Development Workflow**:

1. Make converter changes in workhorse-core repository
2. Build WASM: `make wasm` in workhorse-core
3. Copy `out/wasm/workhorse.wasm` to `public/workhorse.wasm` in this project
4. Test extension (load unpacked in Chrome)
5. Iterate until satisfied

### Build Configuration

Vite builds multiple entry points for Chrome extension:

- `main`: Site interface (`index.html`)
- `popup`: Extension popup (`popup.html`)
- `background`: Background script (`background.js`)

Chrome extension manifest requires `'wasm-unsafe-eval'` in CSP for WebAssembly execution.

## Development Commands

```bash
npm run dev        # Development server
npm run build      # TypeScript compile + Vite build
npm run lint       # ESLint check
```

## Path Aliases

`@/` maps to `src/` directory for cleaner imports.

## Critical Dependencies

- **Zustand**: State management (not Redux/Context)
- **Radix UI + shadcn/ui**: Component system with unstyled primitives and styled compositions
- **Tailwind CSS v4**: Utility-first CSS framework with `@tailwindcss/vite` plugin
- **TypeScript**: Strict typing throughout React + Vite setup
- **Go WASM**: Data processing backend via `wasm_exec.js`

## Debugging Patterns

### Console Logging Strategy

The codebase uses structured console logging:

- **WASM operations**: Always log errors with `console.error(result.Error)`
- **Database operations**: Log errors with context (e.g., "Error opening pipeline database")
- **Chain execution**: Log intermediate results with `console.log("Chain JSON: ", chain_json)`
- **Service operations**: Log save operations for debugging persistence

### VS Code Debugging

- Set breakpoints in TypeScript files - source maps work correctly
- Use browser DevTools for WASM debugging (functions exposed on `window`)
- React component debugging works with standard VS Code React debugging
- Database operations can be inspected via browser's IndexedDB tab

## Database Schema

### IndexedDB Structure

Three separate databases with auto-incrementing versions:

**converter_db** (version 1):

- Object store: `converter_db`
- Key path: `"name"`
- Stores WASM converter definitions loaded at startup

**pipeline_db** (version 1):

- Object store: `pipeline_db`
- Key path: `"id"`
- Stores pipeline metadata (PipelineDbObject: id, name)

**pipeline_step_db** (version 1):

- Object store: `pipeline_step_db`
- Key path: `"id"`
- Index: `pipeline_id` (non-unique)
- Stores individual steps with config arrays linked to pipelines

### Database Access Pattern

```typescript
// Always access via unified manager
DatabaseManager.converter.getConverterDefinition(name);
DatabaseManager.pipeline.createPipeline(pipeline);
DatabaseManager.step.getStepsByPipelineId(id);
```

## Extension-Specific Considerations

- Manifest v3 with `storage` and `activeTab` permissions
- Background script is minimal (`console.log("test.js")`)
- WASM file must be served from `public/` directory
- Extension popup has separate React app from main site interface

## Development Best Practices

### Chrome Extension Testing

1. Build project: `npm run build`
2. Open Chrome Extensions (chrome://extensions/)
3. Enable "Developer mode"
4. Click "Load unpacked" and select `dist/` folder
5. Test both popup (click extension icon) and full site interface

### Code Organization Patterns

- Keep popup minimal - complex UI should be in site interface
- Use Zustand stores for state that needs to persist between popup/site views
- Wrap WASM calls in `src/wasm/operations.ts` with proper error handling
- Database operations should go through `DatabaseManager` unified interface
- Components should be small and focused - use composition over large components

### UI Component Standards

- **Use shadcn/ui components** for all generic UI elements (buttons, dialogs, inputs, etc.)
- **Tailwind CSS classes** for styling - avoid custom CSS files except for specific cases
- **TypeScript strict mode** - all props, state, and functions must be properly typed
- **Radix UI primitives** via shadcn/ui for accessibility and behavior
- **Component composition** over inheritance - build complex components from simple ones

### TypeScript Best Practices

- Use strict type definitions from `src/lib/objects.ts` for all data models
- Properly type all WASM responses with `WasmResponse<T>` pattern
- Use `as const` for literal types and enums where appropriate
- Implement proper error boundaries with TypeScript
- Type all props interfaces explicitly - avoid `any` types

### Performance Considerations

- WASM module loads once per extension lifecycle - initialization is crucial
- IndexedDB operations are async - always handle promises properly
- Chain execution can be CPU-intensive for large inputs - consider progress indicators
- Popup has limited screen space - design for minimal essential actions

### Error Handling Strategy

- WASM errors: Always check `result.Error` before using `result.Result`
- Database errors: Log with context, gracefully degrade functionality
- Chain execution errors: Show user-friendly messages, allow partial results
- Extension errors: Use `chrome.runtime.lastError` for extension API issues
