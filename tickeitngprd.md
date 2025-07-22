# Phase 1 MVP - Hyderabad Public Parks Ticketing System
## Product Requirement Document
### Timeline: 3 Months | Single Park Pilot

---

## 1. Executive Summary

Phase 1 delivers a Minimum Viable Product (MVP) for digital ticketing at a single pilot park in Hyderabad. The focus is on core ticket booking, QR code generation, and basic validation functionality to prove the concept and gather user feedback.

### 1.1 MVP Scope
- **Single park** implementation
- **Basic ticket types** only
- **Online validation** only (no offline mode)
- **Essential admin features**
- **Single language** (English) for faster development

### 1.2 Success Criteria
- Successfully process 1000+ tickets
- Achieve <30 second entry validation time
- 95% payment success rate
- Positive feedback from pilot users

---

## 2. Core Features for Phase 1

### 2.1 Public Booking Portal

#### 2.1.1 Landing Page
- Park information (name, timings, address)
- "Book Tickets" prominent button
- Today's availability status
- Basic FAQ section

#### 2.1.2 Ticket Booking Flow

**Step 1: Select Ticket Type**
- Single Entry Ticket (one-time visit)
- Daily Pass (multiple entries same day)
- *Note: Monthly/Annual passes deferred to Phase 2*

**Step 2: Select Visitors**
- Number of Adults (₹50)
- Number of Children 5-17 years (₹25)
- Children below 5 (Free - max 2 per adult)
- Basic validation: At least 1 adult required

**Step 3: Visitor Information**
- Primary visitor name (mandatory)
- Mobile number (mandatory - for ticket delivery)
- Email (optional)
- Visit date (today or future date up to 30 days)

**Step 4: Payment**
- Total amount display with breakdown
- Payment options:
  - UPI (primary method)
  - Credit/Debit Card
  - Net Banking
- Single payment gateway integration (Razorpay)
- Basic retry mechanism for failures

**Step 5: Ticket Generation**
- Generate static QR code
- Display ticket immediately
- Send SMS with ticket link
- Download PDF option

#### 2.1.3 Ticket Format (Simple Version)
- QR Code (large, centered)
- Ticket ID (alphanumeric, 8 characters)
- Park Name: [Pilot Park Name]
- Visit Date: DD/MM/YYYY
- Ticket Type: Single Entry / Daily Pass
- Visitors: X Adults, Y Children
- Total Amount: ₹XXX
- Booking Time: DD/MM/YYYY HH:MM
- Instructions: "Show QR code at entry"

### 2.2 Entry Validation System

#### 2.2.1 QR Scanner Interface
- Web-based scanner page for gate devices
- Large scan area
- Clear VALID/INVALID indicator
- Audio beep for feedback

#### 2.2.2 Validation Logic
**Valid Entry Shows:**
- Green screen
- "VALID - Allow Entry"
- Number of visitors
- Success beep sound

**Invalid Entry Shows:**
- Red screen
- Reason: "Invalid Ticket" / "Wrong Date" / "Already Used"
- Failure beep sound

#### 2.2.3 Manual Override
- Ticket ID search box
- Basic verification for contingencies
- Log manual entries

### 2.3 Basic Admin Dashboard

#### 2.3.1 Login & Authentication
- Username/password login
- Two user roles only:
  - Admin (full access)
  - Gate Staff (validation only)

#### 2.3.2 Admin Features
**Dashboard Home:**
- Today's Stats Card:
  - Total tickets sold
  - Total revenue
  - Current visitors in park
  - Entry count today

**Ticket Management:**
- Search ticket by ID or phone number
- View ticket details
- Cancel ticket (with reason)
- Mark as used (manual entry)

**Basic Reports:**
- Daily sales report (tickets & revenue)
- Entry log for the day
- Export to Excel/CSV

**Settings:**
- Park operational hours
- Ticket prices
- Max capacity setting
- Enable/disable booking for specific dates

### 2.4 Communication

#### 2.4.1 SMS Integration
- Ticket delivery SMS with link
- Standard template:
  ```
  Your ticket for [Park Name] on [Date] is confirmed.
  Ticket ID: [ID]
  Visitors: [Count]
  View ticket: [Link]
  ```

#### 2.4.2 Basic Email (Optional)
- If email provided, send ticket PDF
- Simple HTML template

---

## 3. Technical Specifications for MVP

### 3.1 Architecture
- **Frontend**: React.js web application
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **QR Library**: qrcode.js
- **Payment**: Razorpay SDK
- **SMS**: Textlocal/Twilio
- **Hosting**: AWS EC2 (single instance)

### 3.2 APIs Required

#### 3.2.1 Public APIs
- `POST /api/tickets/book` - Create booking
- `GET /api/tickets/{id}` - Retrieve ticket
- `POST /api/payment/initiate` - Start payment
- `POST /api/payment/verify` - Confirm payment

#### 3.2.2 Validation APIs
- `POST /api/validate/qr` - Validate QR code
- `GET /api/validate/manual/{ticketId}` - Manual lookup

#### 3.2.3 Admin APIs
- `POST /api/admin/login` - Authentication
- `GET /api/admin/dashboard` - Stats
- `GET /api/admin/tickets` - List tickets
- `PUT /api/admin/tickets/{id}/cancel` - Cancel ticket
- `GET /api/admin/reports/daily` - Daily report

### 3.3 Database Schema (Simplified)

**tickets**
- id (UUID)
- ticket_id (varchar, unique)
- visit_date (date)
- ticket_type (enum: 'single', 'daily')
- adult_count (int)
- child_count (int)
- total_amount (decimal)
- visitor_name (varchar)
- visitor_phone (varchar)
- visitor_email (varchar, nullable)
- payment_status (enum)
- payment_id (varchar)
- created_at (timestamp)
- qr_code (text)
- status (enum: 'active', 'used', 'cancelled')

**entries**
- id (UUID)
- ticket_id (FK)
- entry_time (timestamp)
- gate_id (varchar)
- validation_type (enum: 'qr', 'manual')
- staff_id (FK, nullable)

**users** (admin users only)
- id (UUID)
- username (varchar)
- password_hash (varchar)
- role (enum: 'admin', 'gate_staff')
- created_at (timestamp)

### 3.4 Security Requirements
- HTTPS only
- Basic rate limiting (10 requests/minute)
- Input validation
- SQL injection prevention
- QR code includes HMAC signature

---

## 4. User Flows

### 4.1 Visitor Flow
1. Open website on mobile/desktop
2. Click "Book Tickets"
3. Select ticket type and visitors
4. Enter contact details
5. Make payment
6. Receive ticket instantly
7. Show QR at park entry

### 4.2 Gate Staff Flow
1. Login to scanner page
2. Scan visitor's QR code
3. See validation result
4. Allow/deny entry
5. Handle manual validation if needed

### 4.3 Admin Flow
1. Login to dashboard
2. View daily statistics
3. Search and manage tickets
4. Download daily report
5. Configure park settings

---

## 5. MVP Limitations (Deferred to Phase 2)

### 5.1 Features NOT in Phase 1
- Multiple parks support
- Offline mode
- Multi-language support
- Advanced ticket types (monthly, annual)
- Group bookings and discounts
- Refund processing
- Capacity management
- Advanced analytics
- Mobile app
- Re-entry for daily passes

### 5.2 Technical Limitations
- No auto-scaling
- Basic error handling
- Limited payment options
- No real-time sync
- Single server deployment

---

## 6. Development Timeline

### Month 1: Core Development
**Week 1-2:**
- Database design and setup
- Basic API development
- Payment gateway integration

**Week 3-4:**
- Public booking portal UI
- QR generation and validation logic
- SMS integration

### Month 2: Integration & Admin
**Week 5-6:**
- Complete booking flow
- QR scanner interface
- Entry validation system

**Week 7-8:**
- Admin dashboard
- Basic reports
- Ticket management

### Month 3: Testing & Deployment
**Week 9-10:**
- Integration testing
- Security testing
- Performance optimization

**Week 11-12:**
- UAT with park staff
- Bug fixes
- Production deployment
- Staff training

---

## 7. Testing Plan

### 7.1 Test Scenarios
- Book single adult ticket
- Book family ticket (2 adults, 2 children)
- Payment failure and retry
- QR validation success/failure
- Duplicate entry attempt
- Wrong date entry attempt
- Manual ticket lookup
- Admin ticket cancellation

### 7.2 Performance Targets
- Page load: <3 seconds
- QR validation: <1 second
- Handle 100 concurrent users
- 99% uptime during park hours

---

## 8. Launch Plan

### 8.1 Pilot Park Selection Criteria
- Medium-sized park (500-1000 daily visitors)
- Good internet connectivity
- Motivated staff for adoption
- Single main entrance

### 8.2 Training Requirements
- 2-hour session for gate staff
- 4-hour session for admin users
- Quick reference guides
- WhatsApp support group

### 8.3 Marketing for Pilot
- Signage at park entrance
- 10% launch discount
- Staff to assist first-time users
- Feedback collection forms

---

## 9. Success Metrics

### 9.1 Primary Metrics
- 30% digital ticket adoption by week 4
- <2 minute average booking time
- <30 second entry time
- >90% successful QR scans

### 9.2 Secondary Metrics
- User feedback score >4/5
- Zero revenue discrepancies
- <5% manual interventions
- Staff satisfaction with system

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor internet at park | High | Test connectivity, have 4G backup |
| Low digital adoption | Medium | Staff assistance, incentives |
| Payment failures | Medium | Multiple retry attempts, clear messaging |
| Staff resistance | Medium | Proper training, simple interface |
| QR scan issues | Low | Good lighting, manual backup |

---

## 11. MVP Budget Considerations

### 11.1 Development Costs
- 3 developers × 3 months
- 1 UI/UX designer × 1 month
- 1 Project manager × 3 months

### 11.2 Infrastructure Costs
- AWS hosting (basic tier)
- Payment gateway fees (2-3%)
- SMS costs (₹0.20 per SMS)
- SSL certificate

### 11.3 Operational Costs
- Internet upgrade at park
- 2 tablets/devices for scanning
- Staff training time
- Signage and user guides

---

## 12. Post-MVP Feedback Collection

### 12.1 User Feedback
- In-app feedback form
- SMS survey after visit
- Exit interviews at park
- Support ticket analysis

### 12.2 Operational Feedback
- Daily staff reports
- Weekly admin meetings
- System usage analytics
- Performance metrics review

### 12.3 Phase 2 Planning Inputs
- Most requested features
- Major pain points
- Performance bottlenecks
- Scalability requirements

---

## Appendix A: Sample Screens Description

### A.1 Booking Flow
1. **Landing**: Hero image, park info, "Book Now" CTA
2. **Ticket Selection**: Radio buttons for ticket types
3. **Visitor Count**: +/- buttons for each category
4. **Contact Form**: Simple form with validation
5. **Payment**: Razorpay checkout integration
6. **Success**: QR code display with download option

### A.2 Admin Dashboard
1. **Login**: Simple username/password
2. **Dashboard**: 4 stat cards, recent entries list
3. **Tickets**: Search bar, results table, action buttons
4. **Reports**: Date picker, download button

### A.3 QR Scanner
1. **Scanner**: Full-screen camera view
2. **Result**: Green/Red overlay with clear message
3. **Manual**: Search box with submit button

---

## Appendix B: Error Messages

| Scenario | User Message |
|----------|--------------|
| Payment failed | "Payment failed. Please try again." |
| Invalid QR | "Invalid ticket. Please check with staff." |
| Wrong date | "Ticket valid for [date] only." |
| Already used | "Ticket already used for entry." |
| Network error | "Connection error. Please try again." |
| Booking closed | "Booking closed for today." |
