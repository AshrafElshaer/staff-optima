# Robust Query System

A powerful, generic query system that eliminates the need to define custom methods in each service. All services automatically inherit comprehensive querying capabilities with **full type safety** for column references.

## 🚀 **Key Benefits**

- **Zero Custom Methods**: No need to define filter methods in each service
- **Type-Safe Columns**: Full TypeScript support with compile-time column validation
- **Table-Specific Types**: Each service only works with columns that exist in its table
- **Consistent API**: Same methods work across all services
- **Highly Flexible**: Supports complex queries, pagination, sorting, and search
- **Maintainable**: Single source of truth for query logic
- **No Runtime Errors**: Eliminates potential errors from referencing non-existent columns
- **Table-Specific Filter Instances**: Create reusable filter instances for any table

## 🎯 **Table-Specific Filter Instances**

Create reusable, type-safe filter instances for any table:

```typescript
import { createTableFilters } from "../lib/query-builder";

// Create table-specific filter instances
const teamFilters = createTableFilters<"team">();
const userFilters = createTableFilters<"user">();
const departmentFilters = createTableFilters<"department">();

// All methods are type-safe for the specific table
const filters = [
  teamFilters.eq("organizationId", "org-123"),
  teamFilters.gte("createdAt", "2024-01-01"),
  teamFilters.ilike("name", "%marketing%"),
];

// Complex filtering with type safety
const complexFilters = teamFilters.and(
  teamFilters.eq("organizationId", "org-123"),
  teamFilters.or(
    teamFilters.gte("createdAt", "2024-01-01"),
    teamFilters.lte("updatedAt", "2024-12-31"),
  ),
);
```

## 📋 **Available Methods**

Every service that extends `BaseService` automatically gets these methods:

### **Basic Query Methods**

```typescript
// Find by single field (typesafe for team table)
await service.findBy("organizationId", "org-123");

// Find with filters (typesafe for team table)
await service.find({
  filters: [Filter.eq<"team", string>("organizationId", "org-123")]
});

// Find one record (typesafe for team table)
await service.findOne({
  filters: [Filter.eq<"team", string>("id", "dept-123")]
});

// Count records (typesafe for team table)
await service.count([Filter.eq<"team", string>("organizationId", "org-123")]);
```

### **Advanced Query Methods**

```typescript
// Search with all options (typesafe for team table)
await service.search({
  filters: [Filter.eq<"team", string>("organizationId", "org-123")],
  search: { columns: ["name"], term: "marketing" },
  sort: [Sort.asc<"team">("name")],
  pagination: { limit: 20 }
});

// Paginated search (typesafe for team table)
await service.searchPaginated({
  filters: [Filter.eq<"team", string>("organizationId", "org-123")],
  page: 1,
  limit: 10,
  sort: [Sort.desc<"team">("createdAt")]
});

// Find by multiple fields (typesafe for team table)
await service.findByFields({
  organizationId: "org-123",
  name: "Marketing"
});

// Find by IN operator (typesafe for team table)
await service.findByIn("id", ["dept-1", "dept-2"]);

// Text search across multiple columns (typesafe for team table)
await service.searchText(
  ["name"],
  "marketing",
  { filters: [Filter.eq<"team", string>("organizationId", "org-123")] }
);
```

## 🎯 **Real-World Examples**

### **1. Dashboard Data Loading**

```typescript
import { createTableFilters } from "../lib/query-builder";

// Create table-specific filter instance
const teamFilters = createTableFilters<"team">();

// Get recent departments with pagination (typesafe for team table)
const departments = await departmentService.search({
  filters: [teamFilters.eq("organizationId", organizationId)],
  sort: [Sort.desc<"team">("createdAt")],
  pagination: { limit: 10 }
});

// Get counts for statistics (typesafe for team table)
const [total, recent] = await Promise.all([
  departmentService.count([teamFilters.eq("organizationId", organizationId)]),
  departmentService.count([
    teamFilters.eq("organizationId", organizationId),
    teamFilters.gte("createdAt", "2024-01-01")
  ])
]);
```

### **2. Search with UI Filters**

```typescript
import { createTableFilters } from "../lib/query-builder";

// Create table-specific filter instance
const teamFilters = createTableFilters<"team">();

// Handle search from UI (typesafe for team table)
const results = await departmentService.search({
  filters: [
    teamFilters.eq("organizationId", organizationId),
    ...(createdAfter ? [teamFilters.gte("createdAt", createdAfter)] : [])
  ],
  search: searchTerm ? {
    columns: ["name"],
    term: searchTerm
  } : undefined,
  sort: sortBy ? [Sort[sortOrder]<"team">(sortBy)] : undefined,
  pagination: limit ? { limit } : undefined
});
```

### **3. Complex Filtering**

```typescript
import { createTableFilters } from "../lib/query-builder";

// Create table-specific filter instance
const teamFilters = createTableFilters<"team">();

// Complex nested filters (typesafe for team table)
const complexFilters = teamFilters.and(
  teamFilters.eq("organizationId", organizationId),
  teamFilters.or(
    teamFilters.and(
      teamFilters.gte("createdAt", "2024-01-01"),
      teamFilters.lte("createdAt", "2024-06-30")
    ),
    teamFilters.and(
      teamFilters.gte("updatedAt", "2024-07-01"),
      teamFilters.lte("updatedAt", "2024-12-31")
    )
  )
);

const departments = await departmentService.find({
  filters: complexFilters
});
```

### **4. Paginated Results**

```typescript
import { createTableFilters } from "../lib/query-builder";

// Create table-specific filter instance
const teamFilters = createTableFilters<"team">();

// Get paginated results with metadata (typesafe for team table)
const result = await departmentService.searchPaginated({
  filters: [teamFilters.eq("organizationId", organizationId)],
  search: { columns: ["name"], term: "marketing" },
  page: 1,
  limit: 20,
  sort: [Sort.asc<"team">("name")]
});

// Result includes: { data, total, page, limit, totalPages }
```

## 🔒 **Type Safety Features**

### **Column Validation**
All column references are validated at compile time:

```typescript
import { createTableFilters } from "../lib/query-builder";

const teamFilters = createTableFilters<"team">();

// ✅ Valid - these columns exist in the team table
teamFilters.eq("organizationId", "org-123")
teamFilters.eq("name", "Marketing")
teamFilters.gte("createdAt", "2024-01-01")

// ❌ Invalid - these columns don't exist in the team table
teamFilters.eq("status", "active")        // Error: 'status' not in team table
teamFilters.eq("description", "text")     // Error: 'description' not in team table
teamFilters.eq("memberCount", 5)          // Error: 'memberCount' not in team table
```

### **Available Columns for Team Table**
- `id` - Primary key
- `name` - Department name
- `organizationId` - Foreign key to organization
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### **Generic Type Parameters**
```typescript
import { createTableFilters } from "../lib/query-builder";

// Create table-specific filter instance
const teamFilters = createTableFilters<"team">();

// All methods are type-safe for the specific table
teamFilters.eq("organizationId", "org-123")
teamFilters.eq("name", "Marketing")
teamFilters.gte("createdAt", "2024-01-01")

// Sort.asc<TableName>(column)
Sort.asc<"team">("name")
Sort.desc<"team">("createdAt")

// FilterGroup<TableName>
const filters: FilterGroup<"team"> = teamFilters.and(...)
```

## 🔧 **Service Implementation**

Your services become incredibly simple:

```typescript
export class DepartmentService extends BaseService<"team"> {
  constructor(supabase: SupabaseInstance) {
    super(supabase, "team");
  }

  // Only define business-specific methods
  async getById(id: string): Promise<Department> {
    return this.findById(id);
  }

  // All query methods are inherited automatically!
  // No need to define: findBy, find, search, searchPaginated, etc.
}
```

## 🎨 **Helper Functions**

Use these utilities for common patterns:

```typescript
import { QueryHelpers } from "./robust-query-examples";

// Create common filters
const filters = QueryHelpers.createOrgFilters("org-123", [
  Filter.eq("status", "active")
]);

// Create search config
const search = QueryHelpers.createSearchConfig(["name", "description"], "term");

// Create sort config
const sort = QueryHelpers.createSortConfig("name", "asc");
```

## 📊 **Type-Safe Query Builders**

```typescript
import { createDepartmentQuery } from "./robust-query-examples";

// Type-safe query creation
const queryOptions = createDepartmentQuery({
  organizationId: "org-123",
  status: "active",
  searchTerm: "marketing",
  sortBy: "name",
  sortOrder: "asc",
  page: 1,
  limit: 20
});

const results = await departmentService.search(queryOptions);
```

## 🚀 **Migration Guide**

### **Before (Custom Methods)**

```typescript
// Old way - custom methods in each service
class DepartmentService {
  async getActiveDepartments(organizationId: string) {
    return this.findAllWithFilters([
      Filter.eq("organizationId", organizationId),
      Filter.eq("status", "active")  // ❌ 'status' doesn't exist in team table
    ]);
  }

  async searchDepartments(organizationId: string, searchTerm: string) {
    // Custom implementation...
  }

  async getDepartmentsPaginated(organizationId: string, page: number, limit: number) {
    // Custom implementation...
  }
}
```

### **After (Generic Methods with Type Safety)**

```typescript
import { createTableFilters } from "../lib/query-builder";

// New way - use generic methods with type safety
class DepartmentService extends BaseService<"team"> {
  // No custom query methods needed!

  // Just use the generic methods directly with type safety
  async getRecentDepartments(organizationId: string) {
    const teamFilters = createTableFilters<"team">();
    
    return this.find({
      filters: [
        teamFilters.eq("organizationId", organizationId),
        teamFilters.gte("createdAt", "2024-01-01")  // ✅ Type-safe column
      ]
    });
  }
}

// Or even better - use directly in your components with type safety
const teamFilters = createTableFilters<"team">();
const departments = await departmentService.find({
  filters: [
    teamFilters.eq("organizationId", organizationId),
    teamFilters.gte("createdAt", "2024-01-01")  // ✅ Type-safe column
  ]
});
```

## ✨ **Best Practices**

1. **Use Table-Specific Filter Instances**: Create filter instances with `createTableFilters<TableName>()`
2. **Use Generic Methods**: Prefer the inherited methods over custom ones
3. **Always Use Type Parameters**: Include table and value types for type safety
4. **Compose Filters**: Build complex filters using `filterInstance.and()` and `filterInstance.or()`
5. **Use Helper Functions**: Leverage `QueryHelpers` for common patterns
6. **Type-Safe Queries**: Use `createDepartmentQuery` for complex scenarios
7. **Consistent Naming**: Use the same patterns across all services
8. **Validate Columns**: Always check that columns exist in your table schema
9. **Use Table-Specific Types**: Each service should only reference its table's columns
10. **Reuse Filter Instances**: Create filter instances once and reuse them across methods

## 🎯 **Performance Tips**

- Use `select` to limit returned columns
- Apply `limit` for large datasets
- Use indexes on frequently filtered columns
- Combine filters efficiently
- Use `count` for pagination metadata

This robust system eliminates the need for custom query methods while providing maximum flexibility, type safety, and compile-time column validation. No more runtime errors from referencing non-existent columns!
