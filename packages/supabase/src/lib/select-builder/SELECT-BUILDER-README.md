# Select Builder - Advanced Relationship Queries

A sophisticated, type-safe select builder for complex Supabase queries with relationship handling. This system provides advanced capabilities for building complex queries with joins, nested relationships, and type-safe result inference.

## 🚀 **Key Features**

- **Type-Safe Relationships** - Full TypeScript support for complex joins
- **Nested Queries** - Support for deeply nested relationship queries
- **Automatic Type Inference** - Result types are automatically inferred
- **Flexible API** - Support for one-to-one, one-to-many, and many-to-many relationships
- **Query Optimization** - Efficient query building with proper joins

## 📋 **When to Use Select Builder**

Use the Select Builder when you need:

- **Complex relationship queries** with multiple joins
- **Nested data fetching** across related tables
- **Type-safe relationship handling** with proper TypeScript inference
- **Advanced query patterns** that go beyond simple filtering

For simple queries, use the [QueryBuilder](./README.md) instead.

## 🎯 **Basic Usage**

### **Simple Table Query**

```typescript
import { select, build, type InferSelect } from "./select-builder";

// Define a simple select
const departmentSelect = select({
  table: "team",
  fields: ["id", "name", "status", "createdAt"],
});

// Build the query string
const queryString = build(departmentSelect);
// Result: "id, name, status, createdAt"

// Get the result type
type DepartmentResult = InferSelect<typeof departmentSelect>;
// Result: { id: string; name: string; status: string; createdAt: string; }
```

### **With Relationships**

```typescript
import { select, one, many, build, type InferSelect } from "./select-builder";

// Define a select with relationships
const departmentWithOrg = select({
  table: "team",
  fields: ["id", "name", "status"],
  relations: [
    one("organization", {
      table: "organization",
      fields: ["id", "name", "domain"],
    }),
  ],
});

// Build the query string
const queryString = build(departmentWithOrg);
// Result: "id, name, status, organization:organization(id, name, domain)"

// Get the result type
type DepartmentWithOrg = InferSelect<typeof departmentWithOrg>;
// Result: { 
//   id: string; 
//   name: string; 
//   status: string; 
//   organization: { id: string; name: string; domain: string; }
// }
```

## 🔗 **Relationship Types**

### **One-to-One Relationships**

```typescript
// Simple one-to-one
const departmentWithOwner = select({
  table: "team",
  fields: ["id", "name"],
  relations: [
    one("owner", {
      table: "user",
      fields: ["id", "name", "email"],
    }),
  ],
});

// One-to-one with foreign key
const departmentWithOrg = select({
  table: "team",
  fields: ["id", "name"],
  relations: [
    one("organization", {
      table: "organization",
      fields: ["id", "name"],
    }, {
      foreignFrom: "team",
      foreignKey: "organizationId",
      nullable: false,
    }),
  ],
});
```

### **One-to-Many Relationships**

```typescript
// One-to-many
const organizationWithDepartments = select({
  table: "organization",
  fields: ["id", "name"],
  relations: [
    many("departments", {
      table: "team",
      fields: ["id", "name", "status"],
    }, {
      foreignFrom: "organization",
      foreignKey: "organizationId",
      nullable: false,
    }),
  ],
});

// Result type includes array
type OrgWithDepartments = InferSelect<typeof organizationWithDepartments>;
// Result: {
//   id: string;
//   name: string;
//   departments: Array<{ id: string; name: string; status: string; }>;
// }
```

### **Nested Relationships**

```typescript
// Deeply nested relationships
const complexQuery = select({
  table: "organization",
  fields: ["id", "name"],
  relations: [
    many("departments", {
      table: "team",
      fields: ["id", "name"],
      relations: [
        many("members", {
          table: "member",
          fields: ["id", "role"],
          relations: [
            one("user", {
              table: "user",
              fields: ["id", "name", "email"],
            }),
          ],
        }),
      ],
    }, {
      foreignFrom: "organization",
      foreignKey: "organizationId",
      nullable: false,
    }),
  ],
});
```

## 🛠 **Advanced Features**

### **Foreign Key References**

```typescript
import { ref } from "./select-builder";

// Using ref for type-safe foreign keys
const departmentWithOrg = select({
  table: "team",
  fields: ["id", "name"],
  relations: [
    one("organization", {
      table: "organization",
      fields: ["id", "name"],
    }, {
      foreignFrom: "team",
      foreignKey: "organizationId",
      nullable: false,
    }),
  ],
});
```

### **Nullable Relationships**

```typescript
// Nullable one-to-one relationship
const departmentWithOptionalOwner = select({
  table: "team",
  fields: ["id", "name"],
  relations: [
    one("owner", {
      table: "user",
      fields: ["id", "name"],
    }, {
      foreignFrom: "team",
      foreignKey: "ownerId",
      nullable: true, // Owner might not exist
    }),
  ],
});

// Result type includes null
type DepartmentWithOptionalOwner = InferSelect<typeof departmentWithOptionalOwner>;
// Result: {
//   id: string;
//   name: string;
//   owner: { id: string; name: string; } | null;
// }
```

### **Merging Select Definitions**

```typescript
import { merge } from "./select-builder";

// Base select
const baseSelect = select({
  table: "team",
  fields: ["id", "name"],
});

// Extended select with additional fields and relations
const extendedSelect = merge(baseSelect, {
  fields: ["status", "createdAt"],
  relations: [
    one("organization", {
      table: "organization",
      fields: ["id", "name"],
    }),
  ],
});
```

## 🎨 **Real-World Examples**

### **Dashboard Data with Relationships**

```typescript
// Get organization with departments and their members
const dashboardData = select({
  table: "organization",
  fields: ["id", "name", "domain"],
  relations: [
    many("departments", {
      table: "team",
      fields: ["id", "name", "status", "memberCount"],
      relations: [
        many("members", {
          table: "member",
          fields: ["id", "role", "joinedAt"],
          relations: [
            one("user", {
              table: "user",
              fields: ["id", "name", "email", "avatar"],
            }),
          ],
        }),
      ],
    }, {
      foreignFrom: "organization",
      foreignKey: "organizationId",
      nullable: false,
    }),
  ],
});

// Use in service
class OrganizationService extends BaseService<"organization"> {
  async getDashboardData(organizationId: string) {
    const queryString = build(dashboardData);
    const { data, error } = await this.supabase
      .from("organization")
      .select(queryString)
      .eq("id", organizationId)
      .single();
    
    if (error) throw error;
    return data as InferSelect<typeof dashboardData>;
  }
}
```

### **User Profile with All Related Data**

```typescript
// Get user with all their related data
const userProfile = select({
  table: "user",
  fields: ["id", "name", "email", "avatar", "createdAt"],
  relations: [
    many("memberships", {
      table: "member",
      fields: ["id", "role", "joinedAt"],
      relations: [
        one("organization", {
          table: "organization",
          fields: ["id", "name", "domain"],
        }),
        one("department", {
          table: "team",
          fields: ["id", "name", "status"],
        }),
      ],
    }, {
      foreignFrom: "user",
      foreignKey: "userId",
      nullable: false,
    }),
  ],
});
```

### **Complex Analytics Query**

```typescript
// Get organization analytics with nested data
const analyticsData = select({
  table: "organization",
  fields: ["id", "name", "createdAt"],
  relations: [
    many("departments", {
      table: "team",
      fields: ["id", "name", "status", "memberCount", "createdAt"],
      relations: [
        many("members", {
          table: "member",
          fields: ["id", "role", "joinedAt"],
          relations: [
            one("user", {
              table: "user",
              fields: ["id", "name", "lastActiveAt"],
            }),
          ],
        }),
      ],
    }, {
      foreignFrom: "organization",
      foreignKey: "organizationId",
      nullable: false,
    }),
  ],
});
```

## 🔧 **Integration with Services**

### **Service Method Example**

```typescript
import { select, build, type InferSelect } from "./select-builder";

export class DepartmentService extends BaseService<"team"> {
  // Use select builder for complex queries
  async getWithRelations<T extends InferSelect<any>>(
    selectDef: T,
    filters?: FilterCondition[]
  ): Promise<InferSelect<T>> {
    const queryString = build(selectDef);
    let query = this.supabase.from(this.tableName).select(queryString);
    
    if (filters) {
      query = QueryBuilder.applyFilters(query, filters);
    }
    
    const { data, error } = await query.single();
    if (error) throw error;
    
    return data as InferSelect<T>;
  }
}

// Usage
const departmentWithOrg = await departmentService.getWithRelations(
  select({
    table: "team",
    fields: ["id", "name"],
    relations: [
      one("organization", {
        table: "organization",
        fields: ["id", "name"],
      }),
    ],
  }),
  [Filter.eq("id", "dept-123")]
);
```

## 📊 **Type Safety Features**

### **Automatic Type Inference**

```typescript
// Types are automatically inferred
const query = select({
  table: "team",
  fields: ["id", "name", "status"],
  relations: [
    one("organization", {
      table: "organization",
      fields: ["id", "name"],
    }),
  ],
});

// This type is automatically inferred
type Result = InferSelect<typeof query>;
// Result: {
//   id: string;
//   name: string;
//   status: string;
//   organization: { id: string; name: string; };
// }
```

### **Nullable Type Handling**

```typescript
// Nullable relationships are properly typed
const queryWithNullable = select({
  table: "team",
  fields: ["id", "name"],
  relations: [
    one("owner", {
      table: "user",
      fields: ["id", "name"],
    }, {
      foreignFrom: "team",
      foreignKey: "ownerId",
      nullable: true,
    }),
  ],
});

type ResultWithNullable = InferSelect<typeof queryWithNullable>;
// Result: {
//   id: string;
//   name: string;
//   owner: { id: string; name: string; } | null;
// }
```

## 🚀 **Performance Considerations**

### **Query Optimization**

- **Use specific fields** - Only select fields you need
- **Limit relationship depth** - Avoid overly nested queries
- **Use proper indexes** - Ensure foreign key columns are indexed
- **Consider pagination** - For large datasets, use pagination

### **Best Practices**

```typescript
// ✅ Good: Specific fields
const efficientQuery = select({
  table: "team",
  fields: ["id", "name"], // Only needed fields
  relations: [
    one("organization", {
      table: "organization",
      fields: ["id", "name"], // Only needed fields
    }),
  ],
});

// ❌ Avoid: Too many fields
const inefficientQuery = select({
  table: "team",
  fields: ["*"], // Avoid selecting all fields
  relations: [
    one("organization", {
      table: "organization",
      fields: ["*"], // Avoid selecting all fields
    }),
  ],
});
```

## 🔄 **Migration from QueryBuilder**

### **When to Migrate**

- **Simple queries** → Keep using QueryBuilder
- **Complex relationships** → Use SelectBuilder
- **Nested data needs** → Use SelectBuilder
- **Type safety for joins** → Use SelectBuilder

### **Hybrid Approach**

```typescript
// Use both systems together
class DepartmentService extends BaseService<"team"> {
  // Simple queries with QueryBuilder
  async getDepartments(organizationId: string) {
    return this.findBy("organizationId", organizationId);
  }
  
  // Complex queries with SelectBuilder
  async getDepartmentsWithRelations(organizationId: string) {
    const selectDef = select({
      table: "team",
      fields: ["id", "name"],
      relations: [
        one("organization", {
          table: "organization",
          fields: ["id", "name"],
        }),
      ],
    });
    
    return this.getWithRelations(selectDef, [
      Filter.eq("organizationId", organizationId)
    ]);
  }
}
```

## 🎯 **Summary**

The Select Builder is perfect for:

- **Complex relationship queries** with multiple joins
- **Nested data fetching** across related tables
- **Type-safe relationship handling** with proper TypeScript inference
- **Advanced query patterns** that require sophisticated joins

For simple queries, continue using the QueryBuilder system. Use Select Builder when you need the advanced relationship capabilities it provides.
