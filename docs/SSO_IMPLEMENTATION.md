# SSO Implementation Documentation

## Overview

Complete SAML SSO integration using BoxyHQ Jackson library, fully integrated with Clerk authentication and the existing HospitalOS infrastructure.

## Features Implemented

### 1. Jackson SAML Library Integration
- **Package**: `@boxyhq/saml-jackson`
- **Database**: Jackson-specific tables for SAML configuration storage
- **Configuration**: Enterprise-grade SAML/OIDC support

### 2. Database Schema
```sql
-- Jackson storage tables
jackson_store      -- SAML configuration storage
jackson_index      -- Indexing for performance
jackson_ttl        -- Time-to-live for temporary data
```

### 3. API Routes
- `POST /api/auth/sso/callback` - SAML ACS endpoint
- `GET /api/auth/sso/authorize` - SSO initiation
- `GET /api/auth/sso/metadata` - SAML metadata endpoint
- `GET /api/organizations/[orgId]/sso/connections` - List connections
- `POST /api/organizations/[orgId]/sso/connections` - Create connection
- `PATCH /api/organizations/[orgId]/sso/connections/[id]` - Update connection
- `DELETE /api/organizations/[orgId]/sso/connections/[id]` - Delete connection
- `GET /api/organizations/[orgId]/sso/metadata` - Organization metadata

### 4. UI Components
- **SSOConnectionList** - Main management interface
- **CreateSSOConnectionDialog** - Add new connections
- **EditSSOConnectionDialog** - Modify existing connections
- **SSOLoginButton** - Initiate SSO authentication

### 5. Clerk Integration
- **User Creation**: Automatic user creation/update in Clerk
- **Session Management**: Seamless session creation after SSO
- **Metadata Sync**: SSO attributes stored in Clerk metadata
- **Organization Mapping**: Email domain to organization mapping

## Configuration

### Environment Variables
```bash
# Required for SSO
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
SSO_ISSUER="https://hospitalos.app"

# Optional for certificate management
PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

### Jackson Configuration
- **External URL**: Application base URL
- **SAML Path**: `/api/auth/sso/saml`
- **OIDC Path**: `/api/auth/sso/oidc`
- **Database**: PostgreSQL with Drizzle ORM
- **IDP Discovery**: Enabled for multi-tenant SSO

## Usage Guide

### For Hospital Administrators

#### 1. Setting Up SSO Connection
1. Navigate to **Dashboard > Organization Profile > SSO**
2. Click **"Add Connection"**
3. Fill in connection details:
   - **Name**: Descriptive name (e.g., "Hospital Active Directory")
   - **Description**: Optional description
   - **Redirect URL**: Auto-populated callback URL
   - **Metadata**: Either URL or XML paste

#### 2. IdP Configuration
Provide your identity provider with:
- **ACS URL**: `https://your-domain.com/api/auth/sso/callback`
- **Entity ID**: Your organization ID
- **Metadata**: Download from SSO settings page

### For Developers

#### 1. Creating SSO Connections Programmatically
```typescript
import { createSSOConnection } from '@/hooks/useSSOConnections';

const connection = await createSSOConnection(organizationId, {
  name: 'Corporate SSO',
  description: 'Main identity provider',
  metadataUrl: 'https://idp.company.com/metadata',
  redirectUrl: 'https://hospitalos.app/api/auth/sso/callback'
});
```

#### 2. Using SSO Login Button
```tsx
import { SSOLoginButton } from '@/features/sso/components/SSOLoginButton';

<SSOLoginButton
  organizationId={orgId}
  connectionName="Hospital SSO"
  variant="outline"
/>;
```

#### 3. Handling SSO Callbacks
The system automatically:
- Validates SAML responses
- Creates/updates Clerk users
- Syncs SSO attributes
- Creates authenticated sessions
- Redirects to dashboard

## Security Features

### 1. SAML Security
- **Signature Verification**: All SAML responses verified
- **Encryption Support**: Optional response encryption
- **Replay Protection**: Built-in replay attack prevention
- **Certificate Management**: Proper certificate handling

### 2. Organization Scoping
- **Multi-tenant**: Each organization has isolated SSO
- **Access Control**: Users can only access their organization's SSO
- **Role Mapping**: SSO roles mapped to internal system

### 3. Data Protection
- **Metadata Security**: Sensitive SAML data encrypted
- **Session Security**: Secure session creation with Clerk
- **Audit Logging**: All SSO events logged for compliance

## Hospital-Specific Features

### 1. Medical Staff Integration
- **Role Mapping**: Maps IdP roles to medical positions
- **License Validation**: Future support for medical license verification
- **Department Assignment**: Automatic department assignment based on attributes

### 2. Compliance Ready
- **HIPAA Compliance**: Secure authentication for healthcare
- **Audit Trails**: Complete logging for regulatory requirements
- **Data Retention**: Configurable data retention policies

### 3. Emergency Access
- **Bypass Procedures**: Emergency access when IdP is down
- **On-call Authentication**: Special handling for on-call staff
- **Multi-factor Backup**: Alternative authentication methods

## API Reference

### Connection Management
```typescript
// List connections
GET /api/organizations/{orgId}/sso/connections

// Create connection
POST /api/organizations/{orgId}/sso/connections
Body: {
  name: string,
  description?: string,
  metadataUrl?: string,
  metadata?: string,
  redirectUrl: string
}

// Update connection
PATCH /api/organizations/{orgId}/sso/connections/{connectionId}
Body: Partial<ConnectionParams>

// Delete connection
DELETE /api/organizations/{orgId}/sso/connections/{connectionId}
```

### Authentication Flow
```typescript
// Initiate SSO
GET /api/auth/sso/authorize?tenant={orgId}&redirect_uri={callback}

// Handle callback
POST /api/auth/sso/callback
Body: FormData with SAMLResponse

// Get metadata
GET /api/auth/sso/metadata?tenant={orgId}
```

## Testing and Validation

### 1. Component Testing
```bash
npm run test -- src/features/sso/
```

### 2. API Testing
```bash
# Test metadata endpoint
curl -X GET http://localhost:3000/api/auth/sso/metadata?tenant=org_123

# Test connection creation
curl -X POST http://localhost:3000/api/organizations/org_123/sso/connections \
  -H "Content-Type: application/json" \
  -d '{"name":"Test SSO","redirectUrl":"http://localhost:3000/callback"}'
```

### 3. Integration Testing
1. Configure test IdP (e.g., SAML-tracer)
2. Create SSO connection
3. Initiate SSO flow
4. Verify user creation in Clerk
5. Confirm dashboard access

## Troubleshooting

### Common Issues

#### 1. Metadata Errors
- **Issue**: Invalid metadata XML
- **Solution**: Validate XML format and IdP configuration

#### 2. Callback Failures
- **Issue**: SAML response validation fails
- **Solution**: Check certificate configuration and clock sync

#### 3. User Creation Errors
- **Issue**: Clerk user creation fails
- **Solution**: Verify Clerk configuration and email format

#### 4. Session Issues
- **Issue**: SSO login doesn't create session
- **Solution**: Check callback URL and session token handling

### Debug Mode
Enable Jackson debug logging:
```bash
JACKSON_DEBUG=true npm run dev
```

### Logs Analysis
Check logs for:
- SAML response parsing
- Clerk API calls
- Database operations
- Session creation

## Production Deployment

### 1. Environment Setup
- Configure production database
- Set proper SSL certificates
- Update callback URLs to production domains

### 2. Monitoring
- Monitor SSO success/failure rates
- Track user creation metrics
- Alert on authentication failures

### 3. Backup Procedures
- Regular database backups
- Certificate backup and rotation
- Configuration backup

## Future Enhancements

### 1. Advanced Features
- SCIM user provisioning
- Advanced role mapping
- Multi-IdP support per organization

### 2. Hospital-Specific
- Medical device SSO integration
- EHR system authentication
- Pharmacy system access

### 3. Compliance
- Advanced audit reporting
- Compliance dashboard
- Automated compliance checks

This SSO implementation provides enterprise-grade authentication for hospitals while maintaining security, compliance, and seamless user experience.
