# Category CRUD Implementation Analysis

## Overview
This document outlines all the implementation points required for each CRUD operation (List, Create, Update, Delete) in the Category feature.

---

## 1. LIST CATEGORIES (Display in Table)

### Points to Implement:

#### 1.1 Service Layer (`services/category.service.ts`)
- **Point 1**: Create `getCategory` function with search parameter
- **Point 2**: Setup fetch request to API endpoint `GET /api/v1/category?search={search}`
- **Point 3**: Parse and return JSON response

#### 1.2 Custom Hook (`hooks/use-category.ts`)
- **Point 4**: Create `useCategory` hook using `useQuery`
- **Point 5**: Setup query key with search parameter `["categories", search]`
- **Point 6**: Connect to `getCategory` service function

#### 1.3 Type Definition (`types/category.tsx`)
- **Point 7**: Define `Category` interface with properties:
  - id: number
  - name: string
  - createdAt: Date (for display)
  - products?: optional relation

#### 1.4 Table Columns (`components/category/Columns.tsx`)
- **Point 8**: Define column structure using `ColumnDef<Category>[]`
- **Point 9**: Create ID column with `accessorKey: "id"`
- **Point 10**: Create Name column with custom cell renderer
- **Point 11**: Create Created At column with date formatting using `date-fns`
- **Point 12**: Create Actions column with dropdown menu
- **Point 13**: Setup Edit action with `onEdit` callback
- **Point 14**: Setup Delete action with `onDelete` callback
- **Point 15**: Add dropdown menu icons (PencilIcon, TrashIcon)

#### 1.5 Data Table Component (`components/data-table/data-table.tsx`)
- **Point 16**: Setup `useReactTable` hook with data and columns
- **Point 17**: Configure `getCoreRowModel` for table rendering
- **Point 18**: Render table header with `TableHeader` component
- **Point 19**: Map header groups and headers
- **Point 20**: Render table body with `TableBody` component
- **Point 21**: Map rows and cells with proper rendering
- **Point 22**: Handle empty state with "No results" message
- **Point 23**: Add table styling with border and rounded corners

#### 1.6 Page Component (`pages/Category.tsx`)
- **Point 24**: Setup state for search input using `useState`
- **Point 25**: Implement debounce for search using `useDebounce` (1000ms delay)
- **Point 26**: Call `useCategory` hook with debounced search value
- **Point 27**: Handle loading state with `isLoading`
- **Point 28**: Create search input field with `Input` component
- **Point 29**: Create search button
- **Point 30**: Create "Create" button with CirclePlus icon
- **Point 31**: Pass columns with `onEdit` and `onDelete` handlers
- **Point 32**: Pass data to DataTable component with fallback `data?.data ?? []`

**Total Points for LIST: 32**

---

## 2. CREATE CATEGORY

### Points to Implement:

#### 2.1 Service Layer (`services/category.service.ts`)
- **Point 1**: Create `createCategory` function with request parameter
- **Point 2**: Setup POST request to `POST /api/v1/category`
- **Point 3**: Set Content-Type header to "application/json"
- **Point 4**: Stringify request body with `JSON.stringify(request)`
- **Point 5**: Parse and return JSON response

#### 2.2 Custom Hook (`hooks/use-category.ts`)
- **Point 6**: Create `useCreateCategory` hook using `useMutation`
- **Point 7**: Initialize `useQueryClient` for cache invalidation
- **Point 8**: Connect to `createCategory` service function
- **Point 9**: Setup `onSuccess` callback to invalidate `["categories"]` query
- **Point 10**: Trigger automatic data refresh after creation

#### 2.3 Form Component (`components/category/CategoryForm.tsx`)
- **Point 11**: Create form dialog component with `Dialog` wrapper
- **Point 12**: Setup `useForm` hook from `@tanstack/react-form`
- **Point 13**: Define default values for form fields (name: "")
- **Point 14**: Create Zod validation schema with `z.object`
- **Point 15**: Add name field validation (min 1 character)
- **Point 16**: Setup `onSubmit` handler with validation
- **Point 17**: Call `createCategoryMutate` with form values
- **Point 18**: Handle success with toast notification
- **Point 19**: Close dialog on success with `setOpen(false)`
- **Point 20**: Reset form after successful creation
- **Point 21**: Create form field with `form.Field` component
- **Point 22**: Add field label "Category Name"
- **Point 23**: Add input field with placeholder
- **Point 24**: Handle field validation state (isTouched, isValid)
- **Point 25**: Display field errors with `FieldError` component
- **Point 26**: Create dialog header with title "Create Category"
- **Point 27**: Add Cancel button in dialog footer
- **Point 28**: Add Save button with form submission

#### 2.4 Page Component (`pages/Category.tsx`)
- **Point 29**: Setup state for dialog open/close with `useState`
- **Point 30**: Create "Create" button click handler to open dialog
- **Point 31**: Pass `open` state to CategoryForm component
- **Point 32**: Pass `setOpen` handler to CategoryForm component
- **Point 33**: Pass undefined category for create mode

**Total Points for CREATE: 33**

---

## 3. UPDATE CATEGORY

### Points to Implement:

#### 3.1 Service Layer (`services/category.service.ts`)
- **Point 1**: Create `updateCategory` function with id and request parameters
- **Point 2**: Setup PUT request to `PUT /api/v1/category/${id}`
- **Point 3**: Set Content-Type header to "application/json"
- **Point 4**: Stringify request body with `JSON.stringify(request)`
- **Point 5**: Parse and return JSON response

#### 3.2 Custom Hook (`hooks/use-category.ts`)
- **Point 6**: Create `useUpdateCategory` hook using `useMutation`
- **Point 7**: Initialize `useQueryClient` for cache invalidation
- **Point 8**: Setup mutation function with destructured `{id, request}` parameters
- **Point 9**: Connect to `updateCategory` service function
- **Point 10**: Setup `onSuccess` callback to invalidate `["categories"]` query
- **Point 11**: Trigger automatic data refresh after update

#### 3.3 Form Component (`components/category/CategoryForm.tsx`)
- **Point 12**: Accept optional `category` prop for edit mode
- **Point 13**: Setup `useUpdateCategory` hook
- **Point 14**: Pre-fill form with category data using `category?.name || ""`
- **Point 15**: Add `useEffect` to update form when category changes
- **Point 16**: Set field value with `form.setFieldValue('name', category.name)`
- **Point 17**: Reset form when switching to create mode (category is undefined)
- **Point 18**: Add conditional logic in `onSubmit` to check if category exists
- **Point 19**: Call `updateCategoryMutate` with id and request
- **Point 20**: Handle success with toast notification "Category updated successfully"
- **Point 21**: Close dialog on success
- **Point 22**: Reset form after successful update
- **Point 23**: Update dialog title to show "Edit Category" when editing

#### 3.4 Page Component (`pages/Category.tsx`)
- **Point 24**: Setup state for selected category with `useState<Category | undefined>`
- **Point 25**: Create `handleEdit` function to receive category from table
- **Point 26**: Set selected category in state
- **Point 27**: Open dialog when edit is clicked
- **Point 28**: Create `handleClose` function to reset category state
- **Point 29**: Set category to undefined when dialog closes
- **Point 30**: Pass `handleEdit` to columns via `onEdit` prop
- **Point 31**: Pass selected category to CategoryForm component
- **Point 32**: Ensure form updates when different row is edited

**Total Points for UPDATE: 32**

---

## 4. DELETE CATEGORY

### Points to Implement:

#### 4.1 Service Layer (`services/category.service.ts`)
- **Point 1**: Create `deleteCategory` function with optional id parameter
- **Point 2**: Setup DELETE request to `DELETE /api/v1/category/${id}`
- **Point 3**: Set Content-Type header to "application/json"
- **Point 4**: Parse and return JSON response

#### 4.2 Custom Hook (`hooks/use-category.ts`)
- **Point 5**: Create `useDeleteCategory` hook using `useMutation`
- **Point 6**: Initialize `useQueryClient` for cache invalidation
- **Point 7**: Setup mutation function with destructured `{id}` parameter
- **Point 8**: Connect to `deleteCategory` service function
- **Point 9**: Setup `onSuccess` callback to invalidate `["categories"]` query
- **Point 10**: Trigger automatic data refresh after deletion

#### 4.3 Confirm Delete Component (`components/category/ConfirmDelete.tsx`)
- **Point 11**: Create AlertDialog component for confirmation
- **Point 12**: Accept `isOpen` prop to control dialog visibility
- **Point 13**: Accept `setIsOpen` prop to handle dialog state
- **Point 14**: Accept `category` prop to display category name
- **Point 15**: Accept `confirmDelete` callback function
- **Point 16**: Setup AlertDialog with open state binding
- **Point 17**: Create dialog header with confirmation message
- **Point 18**: Display category name in confirmation text "Are you want to delete {category?.name}?"
- **Point 19**: Add Cancel button in dialog footer
- **Point 20**: Add Delete button with `confirmDelete` onClick handler

#### 4.4 Page Component (`pages/Category.tsx`)
- **Point 21**: Setup state for delete dialog with `useState(false)`
- **Point 22**: Setup `useDeleteCategory` hook with destructured mutate
- **Point 23**: Create `handleDelete` function to receive category from table
- **Point 24**: Set selected category in state
- **Point 25**: Open delete confirmation dialog
- **Point 26**: Create `confirmDelete` function to execute deletion
- **Point 27**: Call `deleteCategoryMutate` with category id
- **Point 28**: Handle success with toast notification "Category deleted successfully"
- **Point 29**: Pass `handleDelete` to columns via `onDelete` prop
- **Point 30**: Pass `isDelete` state to ConfirmDelete component
- **Point 31**: Pass `setIsDelete` handler to ConfirmDelete component
- **Point 32**: Pass selected category to ConfirmDelete component
- **Point 33**: Pass `confirmDelete` function to ConfirmDelete component

**Total Points for DELETE: 33**

---

## Summary Table

| Operation | Total Points |
|-----------|--------------|
| LIST      | 32           |
| CREATE    | 33           |
| UPDATE    | 32           |
| DELETE    | 33           |
| **TOTAL** | **130**      |

---

## File Structure Summary

```
src/
├── services/
│   └── category.service.ts          (API calls: GET, POST, PUT, DELETE)
├── hooks/
│   └── use-category.ts               (React Query hooks with cache management)
├── types/
│   └── category.tsx                  (TypeScript interfaces)
├── components/
│   ├── category/
│   │   ├── Columns.tsx               (Table column definitions)
│   │   ├── CategoryForm.tsx          (Create/Update form dialog)
│   │   └── ConfirmDelete.tsx         (Delete confirmation dialog)
│   └── data-table/
│       └── data-table.tsx            (Reusable table component)
└── pages/
    └── Category.tsx                  (Main page with state management)
```

---

## Key Technologies Used

- **React Query (@tanstack/react-query)**: Data fetching, caching, and synchronization
- **TanStack Form (@tanstack/react-form)**: Form state management and validation
- **Zod**: Schema validation
- **date-fns**: Date formatting
- **Sonner**: Toast notifications
- **use-debounce**: Search input debouncing
- **Lucide React**: Icons
- **Shadcn UI**: UI components (Dialog, AlertDialog, Table, Input, Button, etc.)

---

## Notes

- All mutations automatically refresh the category list using `queryClient.invalidateQueries`
- Search functionality uses 1000ms debounce to reduce API calls
- Form validation uses Zod schema with minimum 1 character requirement
- Table uses TanStack Table for flexible column management
- Delete operation requires user confirmation via AlertDialog
- Toast notifications provide user feedback for all operations
