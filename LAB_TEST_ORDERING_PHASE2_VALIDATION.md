# 🔬 Lab Test Ordering Enhancement - Phase 2 Validation Guide

## ✅ Phase 2 Features Implemented

### 1. **Lab Requisition Form Component** 📋
- Professional lab requisition form layout
- QR code for digital access
- Patient and clinical information sections
- Test categorization by type (Hematology, Biochemistry, etc.)
- Sample type information for each category
- Laboratory use section with checkboxes

### 2. **Enhanced Prescription Preview Dialog** 🗂️
- Tabbed interface with two tabs:
  - **Prescription Tab**: Traditional prescription view
  - **Lab Requisition Tab**: Dedicated lab form
- Scrollable content areas for long documents
- Tab disabled when no lab tests or requisition not selected

### 3. **Advanced Document Actions** 📤
- **Send to Patient**: WhatsApp/SMS integration (mock)
- **Download PDF**: Generate PDF document
- **Print**: Enhanced print functionality
- Buttons enable/disable based on user selections

### 4. **QR Code Integration** 📱
- Contains consultation ID, patient ID, doctor ID, test IDs
- Scannable for quick lab access
- ISO-formatted timestamp included

## 🎯 How to Test Phase 2

### Step 1: Navigate to Doctor Dashboard
```
http://localhost:3002/dashboard/doctor
```

### Step 2: Start Consultation and Order Tests
1. Click "Start Consultation" on any patient
2. Go to "Investigations" tab
3. Select some lab tests (CBC, Blood Sugar, etc.)
4. **Enable "Generate lab requisition" checkbox**
5. Add patient instructions
6. Click "Order Tests"

### Step 3: Test Lab Requisition Form

#### A. **Access Lab Requisition**
1. Go to "Prescription" tab
2. Click "Preview" button
3. **Verify**: Two tabs appear - "Prescription" and "Lab Requisition"
4. Click "Lab Requisition" tab
5. **Verify**: Professional form displays with all sections

#### B. **Verify QR Code**
1. Check QR code appears in top-right corner
2. Verify "Scan for digital access" text below
3. QR should contain encoded data (JSON format)

#### C. **Check Patient Information**
```
Expected sections:
- Patient name, age, gender
- Patient ID
- Contact number
- Email (if available)
- Blood group (if available)
```

#### D. **Verify Clinical Information**
```
Expected content:
- Provisional diagnosis (if entered)
- Clinical notes (if entered)
- Referring doctor name and registration
- Department
```

#### E. **Test Table Layout**
```
Table columns:
- S.No (serial number)
- Test Name
- Sample Type
- Special Instructions
- Priority (badge colored)
```

#### F. **Patient Instructions Box**
- Yellow background highlight
- "Important Patient Instructions" header
- Instructions text from consultation

#### G. **Footer Information**
```
Left side:
- Sample Collection Timings
- Emergency/STAT availability

Right side:
- Report Collection info
- Online access details
```

#### H. **Laboratory Use Section**
- Dashed border
- "FOR LABORATORY USE ONLY" header
- Fields for:
  - Sample Collected By
  - Date & Time
  - Lab Receipt No
- Checkboxes for:
  - Sample Adequate
  - Sample Labeled
  - Consent Taken
  - Payment Done

### Step 4: Test Document Actions

#### A. **Print Functionality**
1. In Lab Requisition tab
2. Click "Print" button
3. **Verify**: Print dialog opens with requisition form
4. Cancel print dialog
5. Switch to Prescription tab
6. Click "Print" again
7. **Verify**: Print shows prescription content

#### B. **Send to Patient**
1. Ensure "Send to patient" was checked in Investigations
2. Click "Send to Patient" button
3. **Verify**: Toast notification "Documents sent"
4. If not checked, button should be disabled

#### C. **Download PDF**
1. Click "Download PDF" button
2. **Verify**: Toast notification "Downloading PDF"
3. In production, would generate actual PDF

### Step 5: Test Edge Cases

#### A. **No Lab Tests**
1. Create consultation without lab tests
2. Preview prescription
3. **Verify**: Lab Requisition tab is disabled

#### B. **Requisition Not Selected**
1. Order tests but uncheck "Generate lab requisition"
2. Preview prescription
3. **Verify**: Lab Requisition tab is disabled

#### C. **Multiple Test Categories**
1. Select tests from different categories:
   - CBC (Hematology)
   - Blood Sugar (Biochemistry)
   - Urine Routine (Urine)
2. Preview lab requisition
3. **Verify**: Tests grouped by category with headers

## 📊 Test Scenarios

### Scenario 1: Emergency Lab Request
1. Select urgent tests
2. Set priority to "STAT"
3. Add instruction: "Emergency - collect immediately"
4. Generate requisition
5. **Verify**:
   - STAT badge appears in red
   - Emergency timings shown (24x7)
   - Urgent instructions highlighted

### Scenario 2: Multi-Category Testing
1. Select:
   - CBC (Hematology)
   - Lipid Profile (Biochemistry)
   - Urine Routine (Urine)
2. Add fasting instructions
3. Generate requisition
4. **Verify**:
   - Tests grouped by category
   - Sample types correct for each
   - Total test count = 3

### Scenario 3: Insurance Documentation
1. Select expensive tests
2. Add clinical notes for justification
3. Generate both prescription and requisition
4. **Verify**:
   - Both documents available
   - Clinical justification present
   - Can print/download both

## ✅ Phase 2 Validation Checklist

### Lab Requisition Form
- [ ] QR code displays correctly
- [ ] Patient info complete and accurate
- [ ] Clinical information present
- [ ] Tests organized by category
- [ ] Sample types shown correctly
- [ ] Priority badges colored appropriately
- [ ] Instructions highlighted in yellow
- [ ] Footer timings visible
- [ ] Lab use section with checkboxes

### Dialog Enhancement
- [ ] Tabs display correctly
- [ ] Tab switching works smoothly
- [ ] Disabled state works when appropriate
- [ ] Scrolling works for long content
- [ ] Both tabs have proper content

### Document Actions
- [ ] Send to Patient button works
- [ ] Download PDF shows notification
- [ ] Print opens correct content
- [ ] Buttons enable/disable correctly
- [ ] Layout responsive

### Data Integration
- [ ] Patient data flows correctly
- [ ] Doctor info accurate
- [ ] Test details complete
- [ ] Instructions preserved
- [ ] Clinical notes included

## 🎨 Visual Verification

### Lab Requisition Header
- Bold title: "LABORATORY TEST REQUISITION"
- Hospital name and address
- NABL accreditation mention
- Contact information

### QR Code Placement
- Top-right corner
- 100x100 pixel size
- Border around QR
- Caption below

### Section Styling
- Gray background for section headers
- Clear borders between sections
- Consistent spacing
- Professional appearance

### Priority Badges
- **STAT**: Red/destructive variant
- **Urgent**: Orange/warning variant  
- **Routine**: Gray/secondary variant

## 🐛 Known Behaviors

1. **Mock Functions**: Send to patient and PDF download show toasts only
2. **QR Data**: Contains JSON but no actual scanning endpoint
3. **Print**: Uses browser print (no custom formatting)
4. **Hospital Info**: Currently hardcoded

## 📈 Success Metrics

Phase 2 is successful if:
1. ✅ Professional lab requisition form generated
2. ✅ QR code enables quick lab access
3. ✅ Multiple documentation options available
4. ✅ Print functionality works for both documents
5. ✅ UI is intuitive with clear tab navigation

## 🚀 Phase 3 Preview

Next enhancements:
1. Actual WhatsApp/SMS API integration
2. PDF generation with proper formatting
3. QR code scanning endpoint
4. Test status real-time tracking
5. Lab results integration back to consultation
6. Home collection scheduling
7. Insurance pre-authorization workflow

## 💡 Testing Tips

1. **Test Tab Behavior**: Switch between tabs multiple times
2. **Check Responsiveness**: Resize window to test layout
3. **Verify Data Flow**: Ensure all entered data appears in requisition
4. **Test Print Preview**: Check both prescription and requisition print layouts
5. **Edge Cases**: Test with minimal and maximal data

---

**Status**: Phase 2 Implementation Complete ✅
**Integration**: Lab Requisition Form fully integrated with consultation workflow
**Next Steps**: Test thoroughly, gather feedback, then proceed to Phase 3