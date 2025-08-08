# Demo Module Setup Instructions

## 🚀 Quick Setup (15 minutes)

### Step 1: Copy Files to Your Project

```bash
# Copy mock data
cp demo-ready/data/mock-patients.ts src/data/

# Copy hooks (replace existing)
cp demo-ready/hooks/usePatients.ts src/hooks/api/

# Copy components (replace existing)
cp demo-ready/components/PatientList.tsx src/components/patients/

# Copy page (replace existing)
cp demo-ready/pages/patients-page.tsx src/app/[locale]/(auth)/dashboard/patients/page.tsx
```

### Step 2: Install Required Dependencies (if not already installed)

```bash
npm install lucide-react
# These should already be installed:
# @radix-ui/react-avatar
# @radix-ui/react-badge
# @radix-ui/react-button
# @radix-ui/react-card
# @radix-ui/react-input
# @radix-ui/react-skeleton
```

### Step 3: Enable Demo Mode

Add to your `.env.local` file:
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

### Step 4: Test the Demo

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/en/dashboard/patients`

3. You should see:
   - ✅ 10 realistic demo patients
   - ✅ Working search functionality
   - ✅ Working filters (gender, age, status)
   - ✅ Working pagination
   - ✅ Demo mode banner with tips
   - ✅ Clickable buttons with demo notifications

## 🎯 What Works Immediately

### ✅ Fully Functional Features:
- **Patient List Display**: 10+ realistic Indian patients
- **Search**: Search by name, ID, phone, email
- **Filters**: Gender, age range, status filters
- **Pagination**: Navigate through patient pages
- **Selection**: Select single/multiple patients
- **Sorting**: Sort by name, age, registration date
- **Stats**: Patient statistics dashboard
- **Demo Notifications**: Click any button for demo feedback

### ✅ UI Features:
- **Responsive Design**: Works on mobile/tablet
- **Loading States**: Realistic loading animations
- **Error Handling**: Graceful error messages
- **Professional Design**: Healthcare-appropriate interface
- **Demo Tips**: Guided experience for stakeholders

## 🎭 Demo Usage Guide

### For Stakeholder Presentations:

1. **Start with Overview**: Show the patient statistics cards
2. **Demonstrate Search**: Search for "Priya" or "Arjun"
3. **Show Filters**: Filter by "Female" patients
4. **Show Patient Details**: Click on any patient card
5. **Demonstrate Actions**: Click Edit/View buttons for demo notifications
6. **Show Bulk Operations**: Select multiple patients and use bulk actions

### Demo Tips:
- Search terms that work: "Priya", "Arjun", "Sharma", "Bangalore"
- Try filtering by "Female" and age range "31-50"
- Click "Demo Guide" button for more tips
- Use "Reset Demo" to restore original data

## 🔧 Customization Options

### Adding More Demo Patients:
Edit `src/data/mock-patients.ts` and add more patient objects to the `MOCK_PATIENTS` array.

### Changing Demo Behavior:
Edit `src/hooks/api/usePatients.ts`:
- Change `simulateDelay` values for different loading speeds
- Modify error probability in `createPatient` function
- Adjust search/filter logic

### UI Customization:
Edit `src/components/patients/PatientList.tsx`:
- Modify the demo notification messages
- Change the demo mode banner styling
- Adjust the patient card layout

## 🎪 Demo Scenarios You Can Show

### Scenario 1: New Hospital Tour
"Let me show you our patient management system..."
- Start with stats overview
- Show patient list with realistic data
- Demonstrate search capabilities

### Scenario 2: Daily Workflow Demo
"Here's how staff would use this daily..."
- Search for a specific patient
- Show patient details and medical info
- Demonstrate record updating

### Scenario 3: Bulk Operations Demo
"For administrative tasks..."
- Select multiple patients
- Show export functionality
- Demonstrate bulk status changes

## ⚠️ Important Notes

### Demo Limitations:
- **Data Persistence**: Demo data resets on page refresh (by design)
- **Backend**: No real API calls - all simulated
- **File Uploads**: Simulated only
- **Real-time Updates**: Not connected to real systems

### Production Transition:
- Change `isDemoMode()` function to return `false`
- Implement real API endpoints
- Replace mock data with real database queries
- The UI components will work unchanged

## 🔄 Reset Demo Data

If demo data gets corrupted or you want a fresh start:

1. **Via UI**: Click "Reset Demo" button in the interface
2. **Via Browser**: Clear localStorage and refresh page
3. **Via Code**: Call `resetDemoData()` function

## 🎉 Success Indicators

You'll know the demo is working when:
- ✅ Patient list shows 10 realistic patients
- ✅ Search for "Priya" returns results
- ✅ Filter by "Female" shows female patients only
- ✅ All buttons show demo notifications when clicked
- ✅ Demo mode banner appears at the top
- ✅ Statistics cards show realistic numbers

## 🆘 Troubleshooting

### If patients don't show:
1. Check console for errors
2. Verify file paths are correct
3. Make sure `NEXT_PUBLIC_DEMO_MODE=true` is set
4. Try refreshing the page

### If search doesn't work:
1. Check that `usePatients` hook is being imported correctly
2. Verify mock data file is in the right location
3. Check browser console for JavaScript errors

### If styling looks broken:
1. Verify all UI components are properly imported
2. Check that Tailwind CSS classes are working
3. Make sure icon library (lucide-react) is installed

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are copied to correct locations
3. Make sure dependencies are installed
4. Check environment variables are set

The demo should work immediately after copying the files and setting the environment variable. All interactions are fully functional for stakeholder presentations!