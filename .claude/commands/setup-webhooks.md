Implement robust webhook infrastructure using Svix integration from BoxyHQ template.

**Integration Type:** $ARGUMENTS (specify Svix, native, or hybrid approach)

Follow these steps:

1. **Svix Setup and Configuration:**
   - Install svix package
   - Create `src/lib/svix.ts` with client configuration
   - Set up environment variables for Svix API
   - Configure webhook applications per organization

2. **Database Schema:**
   - Verify webhook and webhook_delivery tables exist
   - Add indexes for performance
   - Ensure proper relationships with organizations

3. **Webhook Management API:**
   - Create webhook CRUD endpoints in `src/app/api/organizations/[orgId]/webhooks/`
   - Implement Svix endpoint management
   - Add webhook testing capabilities
   - Create delivery tracking endpoints
   - Include retry and failure handling

4. **Event System:**
   - Define event types for the hospital system
   - Create event dispatching utilities
   - Implement event payload standardization
   - Add event filtering capabilities

5. **UI Components:**
   - Build webhook list and management interface
   - Create webhook creation/editing forms
   - Add delivery log viewer with filtering
   - Implement webhook testing UI
   - Show delivery status and retry information
   - Use our existing UI patterns

6. **Delivery Tracking:**
   - Implement delivery status tracking
   - Add retry mechanism with exponential backoff
   - Create delivery analytics
   - Log success/failure reasons

7. **Security and Validation:**
   - Add webhook signature verification
   - Implement proper URL validation
   - Add rate limiting for webhook calls
   - Organization-level access control

8. **Event Integration:**
   - Identify key hospital events to webhook-ify:
     - Patient admission/discharge
     - Appointment changes
     - Staff updates
     - Billing events
   - Add webhook triggers to existing flows

9. **Testing and Monitoring:**
   - Create webhook testing utilities
   - Add delivery monitoring
   - Implement health checks
   - Test failure scenarios

10. **Documentation:**
    - Document available event types
    - Create webhook setup guide
    - Add troubleshooting documentation

Focus on reliability and observability for production hospital systems.
