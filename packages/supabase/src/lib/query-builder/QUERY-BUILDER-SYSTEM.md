# Robust Query System

A powerful, generic query system that eliminates the need to define custom methods in each service. All services automatically inherit comprehensive querying capabilities.

## 🚀 **Key Benefits**

- **Zero Custom Methods**: No need to define filter methods in each service
- **Type-Safe**: Full TypeScript support with proper type inference
- **Consistent API**: Same methods work across all services
- **Highly Flexible**: Supports complex queries, pagination, sorting, and search
- **Maintainable**: Single source of truth for query logic

## 📋 **Available Methods**

Every service that extends `BaseService` automatically gets these methods:

### **Basic Query Methods**

```typescript
// Find by single field
await service.findBy("organizationId", "org-123");

// Find with filters
await service.find({
  filters: [Filter.eq("status", "active")]
});

// Find one record
await service.findOne({
  filters: [Filter.eq("id", "dept-123")]
});

// Count records
await service.count([Filter.eq("status", "active")]);
```

### **Advanced Query Methods**

```typescript
// Search with all options
await service.search({
  filters: [Filter.eq("organizationId", "org-123")],
  search: { columns: ["name", "description"], term: "marketing" },
  sort: [Sort.asc("name")],
  pagination: { limit: 20 }
});

// Paginated search
await service.searchPaginated({
  filters: [Filter.eq("organizationId", "org-123")],
  page: 1,
  limit: 10,
  sort: [Sort.desc("createdAt")]
});

// Find by multiple fields
await service.findByFields({
  organizationId: "org-123",
  status: "active"
});

// Find by IN operator
await service.findByIn("status", ["active", "pending"]);

// Text search across multiple columns
await service.searchText(
  ["name", "description"],
  "marketing",
  { filters: [Filter.eq("organizationId", "org-123")] }
);
```

## 🎯 **Real-World Examples**

### **1. Dashboard Data Loading**

```typescript
// Get recent departments with pagination
const departments = await departmentService.search({
  filters: [Filter.eq("organizationId", organizationId)],
  sort: [Sort.desc("createdAt")],
  pagination: { limit: 10 }
});

// Get counts for statistics
const [total, active] = await Promise.all([
  departmentService.count([Filter.eq("organizationId", organizationId)]),
  departmentService.count([
    Filter.eq("organizationId", organizationId),
    Filter.eq("status", "active")
  ])
]);
```

### **2. Search with UI Filters**

```typescript
// Handle search from UI
const results = await departmentService.search({
  filters: [
    Filter.eq("organizationId", organizationId),
    ...(status ? [Filter.eq("status", status)] : [])
  ],
  search: searchTerm ? {
    columns: ["name", "description"],
    term: searchTerm
  } : undefined,
  sort: sortBy ? [Sort[sortOrder](sortBy)] : undefined,
  pagination: limit ? { limit } : undefined
});
```

### **3. Complex Filtering**

```typescript
// Complex nested filters
const complexFilters = Filter.and(
  Filter.eq("organizationId", organizationId),
  Filter.or(
    Filter.and(
      Filter.eq("status", "active"),
      Filter.gte("memberCount", 5)
    ),
    Filter.and(
      Filter.eq("status", "pending"),
      Filter.lt("memberCount", 3)
    )
  )
);

const departments = await departmentService.find({
  filters: complexFilters
});
```

### **4. Paginated Results**

```typescript
// Get paginated results with metadata
const result = await departmentService.searchPaginated({
  filters: [Filter.eq("organizationId", organizationId)],
  search: { columns: ["name"], term: "marketing" },
  page: 1,
  limit: 20,
  sort: [Sort.asc("name")]
});

// Result includes: { data, total, page, limit, totalPages }
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
      Filter.eq("status", "active")
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

### **After (Generic Methods)**

```typescript
// New way - use generic methods
class DepartmentService extends BaseService<"team"> {
  // No custom query methods needed!

  // Just use the generic methods directly
  async getActiveDepartments(organizationId: string) {
    return this.find({
      filters: [
        Filter.eq("organizationId", organizationId),
        Filter.eq("status", "active")
      ]
    });
  }
}

// Or even better - use directly in your components
const departments = await departmentService.find({
  filters: [
    Filter.eq("organizationId", organizationId),
    Filter.eq("status", "active")
  ]
});
```

## ✨ **Best Practices**

1. **Use Generic Methods**: Prefer the inherited methods over custom ones
2. **Compose Filters**: Build complex filters using `Filter.and()` and `Filter.or()`
3. **Use Helper Functions**: Leverage `QueryHelpers` for common patterns
4. **Type-Safe Queries**: Use `createDepartmentQuery` for complex scenarios
5. **Consistent Naming**: Use the same patterns across all services

## 🎯 **Performance Tips**

- Use `select` to limit returned columns
- Apply `limit` for large datasets
- Use indexes on frequently filtered columns
- Combine filters efficiently
- Use `count` for pagination metadata

This robust system eliminates the need for custom query methods while providing maximum flexibility and type safety!
