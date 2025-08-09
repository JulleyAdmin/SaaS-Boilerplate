# HospitalOS Design System Guide

## 📐 Design Principles

Our design system ensures consistency across all HospitalOS pages. Follow these principles:

1. **Consistency First**: Use standardized components for all UI elements
2. **Healthcare Context**: Colors and patterns optimized for medical environments
3. **Accessibility**: All components meet WCAG 2.1 AA standards
4. **Performance**: Optimized for fast loading and smooth interactions
5. **Scalability**: Components work across all screen sizes

## 🎨 Design Tokens

### Color Palette

```css
/* Primary - Healthcare Cyan */
--color-primary-500: 6 182 212;  /* Main brand color */
--color-primary-600: 8 145 178;  /* Hover states */

/* Status Colors */
--color-urgent: 239 68 68;       /* Red - Critical/Emergency */
--color-high-priority: 251 146 60; /* Orange - High Priority */
--color-medium-priority: 251 191 36; /* Yellow - Medium */
--color-low-priority: 34 197 94;  /* Green - Routine */

/* Department Colors */
--color-emergency: 220 38 38;     /* Emergency Department */
--color-pharmacy: 6 182 212;      /* Pharmacy */
--color-laboratory: 168 85 247;   /* Lab */
```

### Typography

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* Labels, badges */
--text-sm: 0.875rem;   /* Body text, buttons */
--text-base: 1rem;     /* Default text */
--text-lg: 1.125rem;   /* Subheadings */
--text-xl: 1.25rem;    /* Section titles */
--text-2xl: 1.5rem;    /* Page titles */
--text-3xl: 1.875rem;  /* Dashboard headers */
```

### Spacing

```css
/* Consistent spacing scale */
--spacing-2: 0.5rem;   /* Tight spacing */
--spacing-4: 1rem;     /* Default spacing */
--spacing-6: 1.5rem;   /* Card padding */
--spacing-8: 2rem;     /* Section spacing */
```

## 🏗️ Component Architecture

### 1. Dashboard Layout Structure

Every dashboard page should follow this structure:

```tsx
import { DashboardLayout, MetricsRow, ContentGrid } from '@/components/dashboard/DashboardLayout';

function MyDashboard() {
  return (
    <DashboardLayout
      title="Page Title"
      subtitle="Brief description"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Current Page' }
      ]}
      actions={
        <ButtonGroup>
          <StandardButton variant="primary">Primary Action</StandardButton>
        </ButtonGroup>
      }
    >
      {/* Metrics Section */}
      <MetricsRow columns={4}>
        <StandardMetricCard {...} />
      </MetricsRow>

      {/* Main Content */}
      <ContentGrid sidebar={<SidebarContent />}>
        <MainContent />
      </ContentGrid>
    </DashboardLayout>
  );
}
```

### 2. Card Components

#### StandardMetricCard
Use for displaying KPIs and metrics:

```tsx
<StandardMetricCard
  label="Total Patients"
  value={1250}
  icon={Users}
  trend={{ value: 12, direction: 'up' }}
  subtitle="This month"
  color="primary"
/>
```

#### ActionCard
Use for quick action buttons:

```tsx
<ActionCard
  title="Quick Actions"
  icon={Activity}
  actions={[
    { label: 'Add Patient', onClick: handleAdd, icon: Plus },
    { label: 'View Reports', onClick: handleReports, icon: FileText }
  ]}
/>
```

#### AlertCard
Use for notifications and alerts:

```tsx
<AlertCard
  title="System Alerts"
  items={[
    {
      id: '1',
      label: 'Low Stock',
      description: '5 medicines below threshold',
      type: 'warning',
      action: handleAction
    }
  ]}
/>
```

#### QueueCard
Use for patient queues and lists:

```tsx
<QueueCard
  id="001"
  patientName="John Doe"
  doctorName="Dr. Smith"
  status="pending"
  time="10 min ago"
  actions={[
    { label: 'View', onClick: handleView },
    { label: 'Process', onClick: handleProcess, variant: 'primary' }
  ]}
/>
```

### 3. UI Components

#### StandardButton
Consistent button styling:

```tsx
<StandardButton 
  variant="primary"  // primary | secondary | success | warning | danger
  size="md"          // sm | md | lg
  icon={IconName}
  loading={false}
  disabled={false}
>
  Button Text
</StandardButton>
```

#### StandardTabs
Consistent tab navigation:

```tsx
<StandardTabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', badge: 5 },
    { id: 'tab2', label: 'Tab 2' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### StandardBadge
Status indicators and labels:

```tsx
<StandardBadge variant="success" size="md">
  Active
</StandardBadge>
```

## 📋 Page Templates

### Standard Dashboard Template

```tsx
// Example: Department Dashboard
import { 
  DashboardLayout,
  MetricsRow,
  ContentGrid 
} from '@/components/dashboard/DashboardLayout';
import {
  StandardMetricCard,
  ActionCard,
  AlertCard,
  QueueCard
} from '@/components/dashboard/StandardCards';
import {
  StandardButton,
  StandardTabs
} from '@/components/dashboard/StandardUI';

export default function DepartmentDashboard() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <DashboardLayout
      title="Department Name"
      subtitle="Department overview and management"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Department' }
      ]}
      actions={
        <StandardButton variant="primary" icon={Plus}>
          New Action
        </StandardButton>
      }
    >
      {/* KPI Metrics */}
      <MetricsRow columns={4}>
        <StandardMetricCard
          label="Metric 1"
          value={100}
          icon={Icon1}
          trend={{ value: 10, direction: 'up' }}
        />
        {/* More metrics... */}
      </MetricsRow>

      {/* Main Content Area */}
      <ContentGrid
        sidebar={
          <>
            <ActionCard {...} />
            <AlertCard {...} />
          </>
        }
      >
        <div className="card-base">
          <StandardTabs {...} />
          {/* Tab content */}
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
}
```

## 🎯 Best Practices

### 1. Color Usage
- **Primary (Cyan)**: Main actions, active states, primary buttons
- **Success (Green)**: Positive actions, completed status
- **Warning (Yellow)**: Caution states, medium priority
- **Danger (Red)**: Errors, urgent items, destructive actions
- **Gray**: Secondary text, disabled states, borders

### 2. Card Hierarchy
- Use consistent card padding: `p-6` for content
- Apply hover effects: `card-hover` class
- Maintain consistent border radius: `rounded-xl`
- Use shadows sparingly: `shadow-sm` default, `shadow-md` on hover

### 3. Typography Guidelines
- Page titles: `text-3xl font-bold`
- Section headers: `text-xl font-semibold`
- Body text: `text-sm` or `text-base`
- Labels: `text-sm text-gray-600`
- Values: `text-3xl font-bold` for metrics

### 4. Spacing Rules
- Between sections: `space-y-6` or `gap-6`
- Between cards: `gap-4`
- Inside cards: `p-6`
- Between inline elements: `gap-2` or `space-x-2`

### 5. Responsive Design
- Use grid classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Hide on mobile: `hidden md:block`
- Stack on mobile: `flex-col md:flex-row`

## 🔄 Migration Guide

To update existing pages to use the design system:

1. **Replace custom cards** with `StandardMetricCard`, `ActionCard`, etc.
2. **Use DashboardLayout** wrapper for consistent structure
3. **Replace custom buttons** with `StandardButton`
4. **Apply design tokens** instead of hardcoded colors
5. **Use spacing utilities** from the design system

### Before (Old Style):
```tsx
<div className="p-4 border rounded">
  <h3>Total Patients</h3>
  <p className="text-2xl">1250</p>
</div>
```

### After (Design System):
```tsx
<StandardMetricCard
  label="Total Patients"
  value={1250}
  icon={Users}
  trend={{ value: 12, direction: 'up' }}
  color="primary"
/>
```

## 🧪 Testing Checklist

Before deploying, ensure:
- [ ] All cards use standardized components
- [ ] Colors match design tokens
- [ ] Spacing is consistent
- [ ] Hover states work properly
- [ ] Responsive design functions correctly
- [ ] Loading states are implemented
- [ ] Empty states use `EmptyState` component
- [ ] All buttons use `StandardButton`
- [ ] Forms follow consistent patterns

## 📚 Component Library

Import components from:
```tsx
// Layout components
import { DashboardLayout, MetricsRow, ContentGrid } from '@/components/dashboard/DashboardLayout';

// Card components
import { 
  StandardMetricCard, 
  ActionCard, 
  AlertCard, 
  QueueCard,
  StatsCard
} from '@/components/dashboard/StandardCards';

// UI components
import { 
  StandardButton,
  ButtonGroup,
  StandardTabs,
  StandardBadge,
  StandardSearch,
  StandardSelect,
  EmptyState
} from '@/components/dashboard/StandardUI';

// Design system CSS (imported globally)
import '@/styles/design-system.css';
```

## 🚀 Quick Start

1. Copy the template structure
2. Replace placeholder content
3. Import required components
4. Apply consistent styling
5. Test responsive behavior

Following this guide ensures all HospitalOS pages maintain visual consistency and professional appearance.