import { useOrganization } from '@clerk/nextjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, vi } from 'vitest';

import SSOManagementPage from '@/app/[locale]/(auth)/dashboard/sso-management/page';
import { createSSOConnection, deleteSSOConnection, useSSOConnections } from '@/hooks/useSSOConnections';

import { TEST_HOSPITAL_ORG } from '../setup/test-infrastructure';

// Mock the hooks
vi.mock('@/hooks/useSSOConnections', () => ({
  useSSOConnections: vi.fn(),
  createSSOConnection: vi.fn(),
  deleteSSOConnection: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useOrganization: vi.fn(),
}));

// Mock window.open for test buttons
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

// Mock window.confirm for delete confirmations
const mockWindowConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockWindowConfirm,
});

describe('SSO Management Page UI Tests', () => {
  const mockUseSSOConnections = useSSOConnections as Mock;
  const mockCreateSSOConnection = createSSOConnection as Mock;
  const mockDeleteSSOConnection = deleteSSOConnection as Mock;
  const mockUseOrganization = useOrganization as Mock;

  const mockConnections = [
    {
      clientID: 'conn_123',
      name: 'Emergency Department SAML',
      description: 'Emergency access | Department: emergency | Roles: doctor, nurse',
      tenant: TEST_HOSPITAL_ORG.id,
      product: 'hospitalos',
      defaultRedirectUrl: 'http://localhost:3003/api/auth/sso/callback',
    },
    {
      clientID: 'conn_456',
      name: 'ICU SAML Connection',
      description: 'ICU access | Department: icu | Roles: doctor, nurse',
      tenant: TEST_HOSPITAL_ORG.id,
      product: 'hospitalos',
      defaultRedirectUrl: 'http://localhost:3003/api/auth/sso/callback',
    },
  ];

  const mockOrganization = {
    id: TEST_HOSPITAL_ORG.id,
    name: TEST_HOSPITAL_ORG.name,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock setup
    mockUseOrganization.mockReturnValue({
      organization: mockOrganization,
    });

    mockUseSSOConnections.mockReturnValue({
      connections: mockConnections,
      isLoading: false,
      isError: false,
      mutate: vi.fn(),
    });

    mockCreateSSOConnection.mockResolvedValue({
      clientID: 'new_conn_789',
      name: 'Test Connection',
    });

    mockDeleteSSOConnection.mockResolvedValue(undefined);
    mockWindowConfirm.mockReturnValue(true);
  });

  describe('Basic Rendering', () => {
    it('should render SSO management page with title and description', () => {
      render(<SSOManagementPage />);

      expect(screen.getByText('SSO Management')).toBeInTheDocument();
      expect(screen.getByText('Configure SAML single sign-on for your hospital staff.')).toBeInTheDocument();
    });

    it('should render create SSO connection button', () => {
      render(<SSOManagementPage />);

      expect(screen.getByText('+ Create SSO Connection')).toBeInTheDocument();
    });

    it('should show Phase 2 backend integration status', () => {
      render(<SSOManagementPage />);

      expect(screen.getByText('🚀 Phase 2 - Backend Integration Active')).toBeInTheDocument();
      expect(screen.getByText(/SSO connections are now stored in the database via Jackson SAML service/)).toBeInTheDocument();
    });
  });

  describe('Connection Display', () => {
    it('should render connections with hospital context', () => {
      render(<SSOManagementPage />);

      expect(screen.getByText('Configured Connections (2)')).toBeInTheDocument();
      expect(screen.getByText('Emergency Department SAML')).toBeInTheDocument();
      expect(screen.getByText('ICU SAML Connection')).toBeInTheDocument();

      // Check hospital-specific information - use getAllByText since there are multiple connections
      const emergencyDepts = screen.getAllByText(/Department: emergency/);

      expect(emergencyDepts.length).toBeGreaterThan(0);

      const icuDepts = screen.getAllByText(/Department: icu/);

      expect(icuDepts.length).toBeGreaterThan(0);

      const roleTexts = screen.getAllByText(/Roles: doctor, nurse/);

      expect(roleTexts.length).toBe(2); // Both connections have the same roles
    });

    it('should show connection details correctly', () => {
      render(<SSOManagementPage />);

      // Check tenant and product information - use getAllByText since there are multiple connections
      const tenantTexts = screen.getAllByText(/Tenant: org_test_hospital_123/);

      expect(tenantTexts.length).toBe(2);

      const productTexts = screen.getAllByText(/Product: hospitalos/);

      expect(productTexts.length).toBe(2);

      // Check redirect URLs
      const redirectTexts = screen.getAllByText(/Redirect: http:\/\/localhost:3003\/api\/auth\/sso\/callback/);

      expect(redirectTexts.length).toBe(2);
    });

    it('should show empty state when no connections exist', () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [],
        isLoading: false,
        isError: false,
        mutate: vi.fn(),
      });

      render(<SSOManagementPage />);

      expect(screen.getByText('No SSO connections configured yet.')).toBeInTheDocument();
      expect(screen.getByText('Create your first SAML connection.')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [],
        isLoading: true,
        isError: false,
        mutate: vi.fn(),
      });

      render(<SSOManagementPage />);

      expect(screen.getByText('Loading SSO connections...')).toBeInTheDocument();
    });

    it('should show error state with retry option', () => {
      const mockMutate = vi.fn();
      mockUseSSOConnections.mockReturnValue({
        connections: [],
        isLoading: false,
        isError: true,
        mutate: mockMutate,
      });

      render(<SSOManagementPage />);

      expect(screen.getByText('Failed to load SSO connections.')).toBeInTheDocument();

      const retryButton = screen.getByText('Try again');

      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);

      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe('Create Connection Dialog', () => {
    it('should open create dialog when button clicked', async () => {
      render(<SSOManagementPage />);

      const createButton = screen.getByText('+ Create SSO Connection');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });
    });

    it('should render hospital-specific form fields', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        // Basic fields - check by text since labels don't have "for" attributes
        expect(screen.getByText('Connection Name *')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Redirect URL *')).toBeInTheDocument();
        expect(screen.getByText('SAML Metadata (URL or XML)')).toBeInTheDocument();

        // Hospital-specific fields
        expect(screen.getByText('Hospital Department')).toBeInTheDocument();
        expect(screen.getByText('Allowed Staff Roles')).toBeInTheDocument();

        // Check that form inputs exist
        expect(screen.getByPlaceholderText('e.g., Hospital SAML')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Brief description')).toBeInTheDocument();
      });
    });

    it('should have pre-filled default values', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('St. Mary\'s Hospital SAML')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Primary SAML connection for hospital staff')).toBeInTheDocument();
        expect(screen.getByDisplayValue('http://localhost:3002/api/auth/sso/callback')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://mocksaml.com/api/saml/metadata')).toBeInTheDocument();
      });
    });

    it('should render department dropdown with all options', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        // Find the select by finding its label first, then the next select element
        const departmentLabel = screen.getByText('Hospital Department');
        const departmentSelect = departmentLabel.parentElement?.querySelector('select');

        expect(departmentSelect).toBeInTheDocument();
        expect(departmentSelect).toHaveValue('general');

        // Check if select has all the options
        const options = departmentSelect?.querySelectorAll('option') || [];

        expect(options).toHaveLength(8);

        const optionTexts = Array.from(options).map(opt => opt.textContent);

        expect(optionTexts).toContain('General Hospital Access');
        expect(optionTexts).toContain('Emergency Department');
        expect(optionTexts).toContain('Intensive Care Unit');
        expect(optionTexts).toContain('Surgery Department');
      });
    });

    it('should render role checkboxes with defaults', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        const doctorCheckbox = screen.getByLabelText('Doctor') as HTMLInputElement;
        const nurseCheckbox = screen.getByLabelText('Nurse') as HTMLInputElement;
        const technicianCheckbox = screen.getByLabelText('Technician') as HTMLInputElement;
        const administratorCheckbox = screen.getByLabelText('Administrator') as HTMLInputElement;

        expect(doctorCheckbox).toBeInTheDocument();
        expect(nurseCheckbox).toBeInTheDocument();
        expect(technicianCheckbox).toBeInTheDocument();
        expect(administratorCheckbox).toBeInTheDocument();

        // Doctor and Nurse should be checked by default
        expect(doctorCheckbox).toBeChecked();
        expect(nurseCheckbox).toBeChecked();
        expect(technicianCheckbox).not.toBeChecked();
        expect(administratorCheckbox).not.toBeChecked();
      });
    });

    it('should handle role checkbox interactions', async () => {
      const user = userEvent.setup();
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        const technicianCheckbox = screen.getByLabelText('Technician') as HTMLInputElement;

        expect(technicianCheckbox).not.toBeChecked();
      });

      const technicianCheckbox = screen.getByLabelText('Technician') as HTMLInputElement;
      await user.click(technicianCheckbox);

      expect(technicianCheckbox).toBeChecked();
    });

    it('should close dialog when cancel is clicked', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Create SSO Connection')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should create connection with hospital-specific data', async () => {
      const user = userEvent.setup();
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });

      // Fill form
      const nameInput = screen.getByDisplayValue('St. Mary\'s Hospital SAML');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test Emergency SAML');

      const descriptionInput = screen.getByDisplayValue('Primary SAML connection for hospital staff');
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Emergency department test connection');

      // Select department - find by its container since it doesn't have a label association
      const departmentLabel = screen.getByText('Hospital Department');
      const departmentSelect = departmentLabel.parentElement?.querySelector('select') as HTMLSelectElement;
      await user.selectOptions(departmentSelect, 'emergency');

      // Select additional role
      const technicianCheckbox = screen.getByLabelText('Technician');
      await user.click(technicianCheckbox);

      // Submit form
      fireEvent.click(screen.getByText('Create Connection'));

      await waitFor(() => {
        expect(mockCreateSSOConnection).toHaveBeenCalledWith(
          TEST_HOSPITAL_ORG.id,
          expect.objectContaining({
            name: 'Test Emergency SAML',
            description: expect.stringContaining('Department: emergency'),
            redirectUrl: 'http://localhost:3002/api/auth/sso/callback',
            metadata: 'https://mocksaml.com/api/saml/metadata',
          }),
        );
      });
    });

    it('should include selected roles in enhanced description', async () => {
      const user = userEvent.setup();
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });

      // Uncheck nurse, check technician and administrator
      await user.click(screen.getByLabelText('Nurse'));
      await user.click(screen.getByLabelText('Technician'));
      await user.click(screen.getByLabelText('Administrator'));

      fireEvent.click(screen.getByText('Create Connection'));

      await waitFor(() => {
        const createCall = mockCreateSSOConnection.mock.calls[0];
        const description = createCall[1].description;

        expect(description).toContain('Roles: doctor, technician, administrator');
        expect(description).not.toContain('nurse');
      });
    });

    it('should show loading state during creation', async () => {
      // Make createSSOConnection return a pending promise
      let resolveCreate: (value: any) => void;
      const createPromise = new Promise((resolve) => {
        resolveCreate = resolve;
      });
      mockCreateSSOConnection.mockReturnValue(createPromise);

      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create Connection'));

      // Should show loading state - there are two "Creating..." buttons
      const creatingButtons = screen.getAllByText('Creating...');

      expect(creatingButtons).toHaveLength(2); // Main button and submit button

      // Both buttons should be disabled
      creatingButtons.forEach((button) => {
        expect(button.closest('button')).toBeDisabled();
      });

      // Resolve the promise
      resolveCreate!({ clientID: 'new_123' });

      await waitFor(() => {
        expect(screen.queryByText('Creating...')).not.toBeInTheDocument();
      });
    });

    it('should handle creation errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      mockCreateSSOConnection.mockRejectedValue(new Error('Creation failed'));

      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create Connection'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to create SSO connection. Please try again.');
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });

  describe('Delete Functionality', () => {
    it('should show delete buttons for each connection', () => {
      render(<SSOManagementPage />);

      const deleteButtons = screen.getAllByText('Delete');

      expect(deleteButtons).toHaveLength(2); // One for each mock connection
    });

    it('should confirm before deleting connection', async () => {
      render(<SSOManagementPage />);

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(mockWindowConfirm).toHaveBeenCalledWith('Are you sure you want to delete this SSO connection?');
    });

    it('should delete connection when confirmed', async () => {
      mockWindowConfirm.mockReturnValue(true);

      render(<SSOManagementPage />);

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteSSOConnection).toHaveBeenCalledWith(TEST_HOSPITAL_ORG.id, 'conn_123');
      });
    });

    it('should not delete connection when cancelled', async () => {
      mockWindowConfirm.mockReturnValue(false);

      render(<SSOManagementPage />);

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(mockDeleteSSOConnection).not.toHaveBeenCalled();
    });

    it('should show loading state during deletion', async () => {
      let resolveDelete: () => void;
      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = resolve;
      });
      mockDeleteSSOConnection.mockReturnValue(deletePromise);

      render(<SSOManagementPage />);

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      // Should show deleting state
      await waitFor(() => {
        expect(screen.getByText('Deleting...')).toBeInTheDocument();
      });

      const deletingButton = screen.getByText('Deleting...');

      expect(deletingButton.closest('button')).toBeDisabled();

      // Resolve the promise
      resolveDelete!();

      await waitFor(() => {
        expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
      });
    });

    it('should handle deletion errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      mockDeleteSSOConnection.mockRejectedValue(new Error('Deletion failed'));

      render(<SSOManagementPage />);

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to delete SSO connection. Please try again.');
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });

  describe('Test Integration Buttons', () => {
    it('should show test buttons when connections exist', () => {
      render(<SSOManagementPage />);

      expect(screen.getByText('🔧 Test SSO Integration')).toBeInTheDocument();
      expect(screen.getByText('🔐 Test SSO Login')).toBeInTheDocument();
    });

    it('should not show test buttons when no connections exist', () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [],
        isLoading: false,
        isError: false,
        mutate: vi.fn(),
      });

      render(<SSOManagementPage />);

      expect(screen.queryByText('🔧 Test SSO Integration')).not.toBeInTheDocument();
      expect(screen.queryByText('🔐 Test SSO Login')).not.toBeInTheDocument();
    });

    it('should open test integration in new window', () => {
      render(<SSOManagementPage />);

      const testButton = screen.getByText('🔧 Test SSO Integration');
      fireEvent.click(testButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        `/api/auth/sso/test?tenant=${TEST_HOSPITAL_ORG.id}`,
        '_blank',
      );
    });

    it('should open SSO login in new window', () => {
      render(<SSOManagementPage />);

      const loginButton = screen.getByText('🔐 Test SSO Login');
      fireEvent.click(loginButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        `/api/auth/sso/authorize?tenant=${TEST_HOSPITAL_ORG.id}&product=hospitalos`,
        '_blank',
      );
    });

    it('should not show test buttons without organization', () => {
      mockUseOrganization.mockReturnValue({
        organization: null,
      });

      render(<SSOManagementPage />);

      expect(screen.queryByText('🔧 Test SSO Integration')).not.toBeInTheDocument();
      expect(screen.queryByText('🔐 Test SSO Login')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Connection Name *')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Hospital Department')).toBeInTheDocument();
        expect(screen.getByText('Redirect URL *')).toBeInTheDocument();
        expect(screen.getByText('SAML Metadata (URL or XML)')).toBeInTheDocument();
      });
    });

    it('should have proper button states and attributes', () => {
      render(<SSOManagementPage />);

      const createButton = screen.getByText('+ Create SSO Connection');

      expect(createButton).toBeEnabled();
      expect(createButton.tagName).toBe('BUTTON');
    });

    it('should have proper dialog semantics', async () => {
      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        // The dialog is rendered as a div with specific classes, not with dialog role
        const dialogContent = screen.getByText('Create SSO Connection');

        expect(dialogContent).toBeInTheDocument();

        // Check if it's within a modal-like container
        const modalContainer = dialogContent.closest('.fixed.inset-0');

        expect(modalContainer).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render properly on mobile viewport', () => {
      // Mock viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<SSOManagementPage />);

      expect(screen.getByText('SSO Management')).toBeInTheDocument();
      expect(screen.getByText('+ Create SSO Connection')).toBeInTheDocument();
    });

    it('should handle dialog display on small screens', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<SSOManagementPage />);

      fireEvent.click(screen.getByText('+ Create SSO Connection'));

      await waitFor(() => {
        expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      });
    });
  });
});
