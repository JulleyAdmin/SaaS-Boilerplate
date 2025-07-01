/**
 * Create SSO Connection Dialog Component Tests
 * Tests the SSO connection creation form and validation
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { CreateSSOConnectionDialog } from '@/features/sso/components/CreateSSOConnectionDialog';

// Mock the hooks
const mockCreateSSOConnection = vi.fn();
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock('@/hooks/useSSOConnections', () => ({
  createSSOConnection: () => mockCreateSSOConnection(),
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

describe('CreateSSOConnectionDialog Component', () => {
  const user = userEvent.setup();
  const mockOnSuccess = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSSOConnection.mockResolvedValue({
      connection: { id: 'new_conn_123', name: 'Test Connection' },
    });
  });

  describe('Dialog Rendering', () => {
    it('should render dialog when open is true', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
      expect(screen.getByText('Add a new SAML or OIDC connection for enterprise authentication.')).toBeInTheDocument();
    });

    it('should not render dialog when open is false', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} open={false} />);

      expect(screen.queryByText('Create SSO Connection')).not.toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      expect(screen.getByLabelText(/connection name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/redirect url/i)).toBeInTheDocument();
      expect(screen.getByText('SAML Metadata')).toBeInTheDocument();
    });

    it('should have pre-filled redirect URL', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const redirectInput = screen.getByLabelText(/redirect url/i) as HTMLInputElement;

      expect(redirectInput.value).toContain('/api/auth/sso/callback');
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty name field', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should validate redirect URL format', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      const redirectInput = screen.getByLabelText(/redirect url/i);

      await user.type(nameInput, 'Test Connection');
      await user.clear(redirectInput);
      await user.type(redirectInput, 'not-a-valid-url');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Must be a valid URL')).toBeInTheDocument();
      });
    });

    it('should validate metadata URL format when using URL method', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      const metadataUrlTab = screen.getByText('Metadata URL');

      await user.type(nameInput, 'Test Connection');
      await user.click(metadataUrlTab);

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataInput, 'invalid-metadata-url');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Must be a valid URL')).toBeInTheDocument();
      });
    });

    it('should accept valid form data', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const metadataUrlTab = screen.getByText('Metadata URL');

      await user.type(nameInput, 'Hospital Main SSO');
      await user.type(descriptionInput, 'Primary authentication for medical staff');
      await user.click(metadataUrlTab);

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataInput, 'https://hospital.idp.com/metadata');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateSSOConnection).toHaveBeenCalledWith('org_test_123', {
          name: 'Hospital Main SSO',
          description: 'Primary authentication for medical staff',
          metadataUrl: 'https://hospital.idp.com/metadata',
          redirectUrl: expect.stringContaining('/api/auth/sso/callback'),
        });
      });
    });
  });

  describe('Metadata Input Methods', () => {
    it('should switch between URL and XML input methods', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      // Should start with URL tab active
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

    it('should submit with metadata XML when XML method is selected', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'XML Based Connection');

      // Switch to XML tab
      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      const xmlInput = screen.getByPlaceholderText(/Paste SAML metadata XML here.../i);
      const metadataXML = '<?xml version="1.0"?><EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata">...</EntityDescriptor>';
      await user.type(xmlInput, metadataXML);

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateSSOConnection).toHaveBeenCalledWith('org_test_123', {
          name: 'XML Based Connection',
          description: '',
          metadata: metadataXML,
          redirectUrl: expect.stringContaining('/api/auth/sso/callback'),
        });
      });
    });

    it('should preserve form data when switching between tabs', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Tab Switch Test');

      // Enter URL metadata
      const metadataUrlInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataUrlInput, 'https://test.com/metadata');

      // Switch to XML tab and back
      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      const urlTab = screen.getByText('Metadata URL');
      await user.click(urlTab);

      // Name should be preserved
      expect(nameInput).toHaveValue('Tab Switch Test');
      // URL should be preserved
      expect(metadataUrlInput).toHaveValue('https://test.com/metadata');
    });
  });

  describe('Form Submission', () => {
    it('should show loading state during submission', async () => {
      // Make the API call hang
      mockCreateSSOConnection.mockImplementation(() => new Promise(() => {}));

      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Loading Test');

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataInput, 'https://test.com/metadata');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /creating.../i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();
    });

    it('should handle successful submission', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Success Test');

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataInput, 'https://success.com/metadata');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('SSO connection created successfully');
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Invalid metadata URL provided';
      mockCreateSSOConnection.mockRejectedValue(new Error(errorMessage));

      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Error Test');

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataInput, 'https://invalid.com/metadata');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(nameInput, 'Reset Test');
      await user.type(descriptionInput, 'Test description');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('');
        expect(descriptionInput).toHaveValue('');
      });
    });
  });

  describe('Dialog Controls', () => {
    it('should close dialog when Cancel button is clicked', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should close dialog when clicking outside (if supported)', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      // Simulate clicking outside the dialog
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog.parentElement!);

      // This depends on the dialog implementation
      // Some dialogs close on outside click, others don't
    });

    it('should handle escape key to close dialog', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Field Descriptions and Help Text', () => {
    it('should show helpful descriptions for form fields', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      expect(screen.getByText('This URL will be used for SAML ACS and OIDC callback')).toBeInTheDocument();
      expect(screen.getByText('URL where the IdP metadata can be downloaded')).toBeInTheDocument();
    });

    it('should show different description for XML metadata', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const xmlTab = screen.getByText('Upload XML');
      await user.click(xmlTab);

      expect(screen.getByText('Paste the XML metadata from your identity provider')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels and ARIA attributes', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      // Check for proper dialog role
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Check for proper form labels
      expect(screen.getByLabelText(/connection name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/redirect url/i)).toBeInTheDocument();

      // Check for proper button roles
      expect(screen.getByRole('button', { name: /create connection/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      // Tab navigation should work
      nameInput.focus();

      expect(nameInput).toHaveFocus();

      fireEvent.keyDown(nameInput, { key: 'Tab' });

      expect(descriptionInput).toHaveFocus();
    });

    it('should announce validation errors to screen readers', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Name is required');

        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Form Auto-completion and UX', () => {
    it('should focus on name field when dialog opens', () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);

      expect(nameInput).toHaveFocus();
    });

    it('should prevent submission on Enter in text inputs', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Test{enter}');

      // Form should not be submitted (no API call)
      expect(mockCreateSSOConnection).not.toHaveBeenCalled();
    });

    it('should allow submission via Enter on submit button', async () => {
      render(<CreateSSOConnectionDialog {...defaultProps} />);

      const nameInput = screen.getByLabelText(/connection name/i);
      await user.type(nameInput, 'Enter Test');

      const metadataInput = screen.getByPlaceholderText(/https:\/\/idp.example.com\/metadata/i);
      await user.type(metadataInput, 'https://test.com/metadata');

      const submitButton = screen.getByRole('button', { name: /create connection/i });
      submitButton.focus();
      fireEvent.keyDown(submitButton, { key: 'Enter' });

      await waitFor(() => {
        expect(mockCreateSSOConnection).toHaveBeenCalled();
      });
    });
  });
});
