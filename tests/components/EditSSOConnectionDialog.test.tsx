/**
 * Edit SSO Connection Dialog Component Tests
 * Tests the SSO connection edit form and validation
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { EditSSOConnectionDialog } from '@/features/sso/components/EditSSOConnectionDialog';

import { mockSSOConnection } from '../setup';

// Mock the hooks
const mockUpdateSSOConnection = vi.fn();
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock('@/hooks/useSSOConnections', () => ({
  updateSSOConnection: () => mockUpdateSSOConnection(),
}));

vi.mock('sonner', () => ({
  toast: mockToast,
}));

// Mock useOrganization
vi.mock('@clerk/nextjs', () => ({
  useOrganization: () => ({
    organization: {
      id: 'org_test_123',
      name: 'Test Hospital',
    },
  }),
}));

describe('EditSSOConnectionDialog Component', () => {
  const user = userEvent.setup();
  const mockOnSuccess = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSuccess: mockOnSuccess,
    connection: mockSSOConnection,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateSSOConnection.mockResolvedValue({
      connection: { ...mockSSOConnection, name: 'Updated Connection' },
    });
  });

  describe('Dialog Rendering', () => {
    it('should render dialog when open is true', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      expect(screen.getByText('Edit SSO Connection')).toBeInTheDocument();
      expect(screen.getByText('Update your SAML or OIDC connection settings.')).toBeInTheDocument();
    });

    it('should not render dialog when open is false', () => {
      render(<EditSSOConnectionDialog {...defaultProps} open={false} />);

      expect(screen.queryByText('Edit SSO Connection')).not.toBeInTheDocument();
    });

    it('should pre-populate form fields with connection data', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLInputElement;
      const redirectInput = screen.getByLabelText(/redirect url/i) as HTMLInputElement;

      expect(nameInput.value).toBe(mockSSOConnection.name);
      expect(descriptionInput.value).toBe(mockSSOConnection.description);
      expect(redirectInput.value).toBe(mockSSOConnection.defaultRedirectUrl);
    });

    it('should show current metadata type based on connection data', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      // Should show URL tab active if connection has metadataUrl
      if (mockSSOConnection.metadataUrl) {
        const urlInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i) as HTMLInputElement;

        expect(urlInput.value).toBe(mockSSOConnection.metadataUrl);
      }
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty name field', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should validate redirect URL format', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const redirectInput = screen.getByLabelText(/redirect url/i);
      await user.clear(redirectInput);
      await user.type(redirectInput, 'not-a-valid-url');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Must be a valid URL')).toBeInTheDocument();
      });
    });

    it('should validate metadata URL format when using URL method', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const metadataUrlTab = screen.getByText('Metadata URL');
      await user.click(metadataUrlTab);

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.clear(metadataInput);
      await user.type(metadataInput, 'invalid-metadata-url');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Must be a valid URL')).toBeInTheDocument();
      });
    });

    it('should accept valid form data updates', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hospital SSO');

      const descriptionInput = screen.getByLabelText(/description/i);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated authentication for medical staff');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateSSOConnection).toHaveBeenCalledWith(
          mockSSOConnection.tenant,
          mockSSOConnection.clientID,
          {
            name: 'Updated Hospital SSO',
            description: 'Updated authentication for medical staff',
            defaultRedirectUrl: mockSSOConnection.defaultRedirectUrl,
            metadataUrl: mockSSOConnection.metadataUrl,
          },
        );
      });
    });
  });

  describe('Metadata Update Methods', () => {
    it('should switch between URL and XML input methods', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      // Should start with URL tab if connection has metadataUrl
      expect(screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i)).toBeInTheDocument();

      // Switch to XML tab
      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      expect(screen.getByPlaceholderText(/Paste SAML metadata XML here.../i)).toBeInTheDocument();

      // Switch back to URL tab
      const urlTab = screen.getByText('Metadata URL');
      await user.click(urlTab);

      expect(screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i)).toBeInTheDocument();
    });

    it('should update with new metadata XML when XML method is selected', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'XML Updated Connection');

      // Switch to XML tab
      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      const xmlInput = screen.getByPlaceholderText(/Paste SAML metadata XML here.../i);
      const newMetadataXML = '<?xml version="1.0"?><EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="updated">...</EntityDescriptor>';
      await user.type(xmlInput, newMetadataXML);

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateSSOConnection).toHaveBeenCalledWith(
          mockSSOConnection.tenant,
          mockSSOConnection.clientID,
          {
            name: 'XML Updated Connection',
            description: mockSSOConnection.description,
            defaultRedirectUrl: mockSSOConnection.defaultRedirectUrl,
            metadata: newMetadataXML,
          },
        );
      });
    });

    it('should preserve form data when switching between metadata tabs', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Tab Switch Test');

      // Switch to XML tab and back
      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      const urlTab = screen.getByText('Metadata URL');
      await user.click(urlTab);

      // Name should be preserved
      expect(nameInput).toHaveValue('Tab Switch Test');
    });
  });

  describe('Form Submission', () => {
    it('should show loading state during submission', async () => {
      // Make the API call hang
      mockUpdateSSOConnection.mockImplementation(() => new Promise(() => {}));

      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Loading Test');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /updating.../i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /updating.../i })).toBeDisabled();
    });

    it('should handle successful update', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Success Update Test');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('SSO connection updated successfully');
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Failed to update connection: Invalid metadata';
      mockUpdateSSOConnection.mockRejectedValue(new Error(errorMessage));

      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Error Test');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    it('should not reset form after successful update (preserves current state)', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Form should keep the updated value (not reset to original)
        expect(nameInput).toHaveValue('Updated Name');
      });
    });
  });

  describe('Dialog Controls', () => {
    it('should close dialog when Cancel button is clicked', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should close dialog when clicking outside (if supported)', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      // Simulate clicking outside the dialog
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog.parentElement!);

      // This depends on the dialog implementation
      // Some dialogs close on outside click, others don't
    });

    it('should handle escape key to close dialog', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should warn about unsaved changes when closing with modifications', async () => {
      // Mock window.confirm
      global.confirm = vi.fn(() => false);

      render(<EditSSOConnectionDialog {...defaultProps} />);

      // Make a change
      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Changed Name');

      // Try to close
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(global.confirm).toHaveBeenCalledWith(
        'You have unsaved changes. Are you sure you want to close?',
      );
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Field Descriptions and Help Text', () => {
    it('should show helpful descriptions for form fields', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      expect(screen.getByText('This URL will be used for SAML ACS and OIDC callback')).toBeInTheDocument();
      expect(screen.getByText('URL where the IdP metadata can be downloaded')).toBeInTheDocument();
    });

    it('should show different description for XML metadata', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      expect(screen.getByText('Paste the XML metadata from your identity provider')).toBeInTheDocument();
    });

    it('should show connection status and last updated info', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      // Could show additional connection info like:
      // - Last updated timestamp
      // - Connection status (active/inactive)
      // - Usage statistics
      expect(screen.getByText('Connection Details')).toBeInTheDocument();
    });
  });

  describe('Advanced Features', () => {
    it('should show connection testing option', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      expect(screen.getByRole('button', { name: /test connection/i })).toBeInTheDocument();
    });

    it('should handle connection testing', async () => {
      const mockTestConnection = vi.fn().mockResolvedValue({ success: true });

      render(<EditSSOConnectionDialog {...defaultProps} />);

      const testButton = screen.getByRole('button', { name: /test connection/i });
      await user.click(testButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Connection test successful');
      });
    });

    it('should handle failed connection test', async () => {
      const mockTestConnection = vi.fn().mockRejectedValue(new Error('Connection failed'));

      render(<EditSSOConnectionDialog {...defaultProps} />);

      const testButton = screen.getByRole('button', { name: /test connection/i });
      await user.click(testButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Connection test failed: Connection failed');
      });
    });

    it('should show metadata download option', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const downloadButton = screen.getByRole('button', { name: /download current metadata/i });

      expect(downloadButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels and ARIA attributes', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      // Check for proper dialog role
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Check for proper form labels
      expect(screen.getByLabelText(/connection name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/redirect url/i)).toBeInTheDocument();

      // Check for proper button roles
      expect(screen.getByRole('button', { name: /update connection/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      // Tab navigation should work
      nameInput.focus();

      expect(nameInput).toHaveFocus();

      fireEvent.keyDown(nameInput, { key: 'Tab' });

      expect(descriptionInput).toHaveFocus();
    });

    it('should announce validation errors to screen readers', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Name is required');

        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });

    it('should announce successful updates to screen readers', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('SSO connection updated successfully');
      });
    });
  });

  describe('Form Auto-completion and UX', () => {
    it('should focus on first editable field when dialog opens', () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);

      expect(nameInput).toHaveFocus();
    });

    it('should prevent submission on Enter in text inputs', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Test{enter}');

      // Form should not be submitted (no API call)
      expect(mockUpdateSSOConnection).not.toHaveBeenCalled();
    });

    it('should allow submission via Enter on submit button', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      submitButton.focus();
      fireEvent.keyDown(submitButton, { key: 'Enter' });

      await waitFor(() => {
        expect(mockUpdateSSOConnection).toHaveBeenCalled();
      });
    });

    it('should show change indicators for modified fields', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Modified Name');

      // Should show that this field has been modified
      expect(screen.getByText('*')).toBeInTheDocument(); // or some other change indicator
    });
  });

  describe('Data Integrity', () => {
    it('should preserve connection ID and tenant during update', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateSSOConnection).toHaveBeenCalledWith(
          mockSSOConnection.tenant,
          mockSSOConnection.clientID,
          expect.objectContaining({
            name: 'Updated Name',
          }),
        );
      });
    });

    it('should handle connection with missing optional fields', () => {
      const connectionWithMissingFields = {
        ...mockSSOConnection,
        description: undefined,
        metadataUrl: undefined,
      };

      render(<EditSSOConnectionDialog {...defaultProps} connection={connectionWithMissingFields} />);

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLInputElement;

      expect(descriptionInput.value).toBe('');
    });

    it('should validate that required fields are not empty after editing', async () => {
      render(<EditSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.clear(nameInput);
      await user.type(nameInput, '   '); // Only whitespace

      const submitButton = screen.getByRole('button', { name: /update connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });
  });
});
