/**
 * SSO Connection List Component Tests
 * Tests the main SSO management interface
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, vi } from 'vitest';

import { SSOConnectionList } from '@/features/sso/components/SSOConnectionList';

import { mockSSOConnection } from '../setup';

// Mock the hooks
const mockMutate = vi.fn();
const mockUseSSOConnections = vi.fn();

vi.mock('@/hooks/useSSOConnections', () => ({
  useSSOConnections: () => mockUseSSOConnections(),
  deleteSSOConnection: vi.fn().mockResolvedValue({ success: true }),
  createSSOConnection: vi.fn().mockResolvedValue({ connection: mockSSOConnection }),
  updateSSOConnection: vi.fn().mockResolvedValue({ connection: mockSSOConnection }),
}));

// Mock toast notifications
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock('sonner', () => ({
  toast: mockToast,
}));

// Mock file download for metadata
global.URL.createObjectURL = vi.fn(() => 'blob:url');
global.URL.revokeObjectURL = vi.fn();

describe('SSOConnectionList Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock implementation
    mockUseSSOConnections.mockReturnValue({
      connections: [],
      isLoading: false,
      isError: false,
      mutate: mockMutate,
    });
  });

  describe('Loading and Empty States', () => {
    it('should show loading spinner when data is loading', () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [],
        isLoading: true,
        isError: false,
        mutate: mockMutate,
      });

      render(<SSOConnectionList />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should show empty state when no connections exist', () => {
      render(<SSOConnectionList />);

      expect(screen.getByText('No SSO connections')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating your first SAML or OIDC connection')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add connection/i })).toBeInTheDocument();
    });

    it('should show error state when there is an error', () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [],
        isLoading: false,
        isError: new Error('Failed to load connections'),
        mutate: mockMutate,
      });

      render(<SSOConnectionList />);

      expect(screen.getByText('Error loading SSO connections')).toBeInTheDocument();
    });
  });

  describe('Connection List Display', () => {
    const mockConnections = [
      {
        tenant: 'org_123',
        name: 'Hospital Main SSO',
        description: 'Primary identity provider for medical staff',
        defaultRedirectUrl: 'http://localhost:3000/callback',
        product: 'hospitalos',
      },
      {
        tenant: 'org_123',
        name: 'Emergency Department SSO',
        description: 'Emergency staff authentication',
        defaultRedirectUrl: 'http://localhost:3000/callback',
        product: 'hospitalos',
      },
    ];

    beforeEach(() => {
      mockUseSSOConnections.mockReturnValue({
        connections: mockConnections,
        isLoading: false,
        isError: false,
        mutate: mockMutate,
      });
    });

    it('should display list of connections', () => {
      render(<SSOConnectionList />);

      expect(screen.getByText('Hospital Main SSO')).toBeInTheDocument();
      expect(screen.getByText('Primary identity provider for medical staff')).toBeInTheDocument();
      expect(screen.getByText('Emergency Department SSO')).toBeInTheDocument();
      expect(screen.getByText('Emergency staff authentication')).toBeInTheDocument();
    });

    it('should show connection details correctly', () => {
      render(<SSOConnectionList />);

      // Check for SAML badges
      const samlBadges = screen.getAllByText('SAML');

      expect(samlBadges).toHaveLength(2);

      // Check for tenant information
      expect(screen.getAllByText('Tenant: org_123')).toHaveLength(2);

      // Check for redirect URLs
      expect(screen.getAllByText('Redirect URL: http://localhost:3000/callback')).toHaveLength(2);
    });

    it('should show action buttons for each connection', () => {
      render(<SSOConnectionList />);

      const moreButtons = screen.getAllByRole('button', { name: /more/i });

      expect(moreButtons).toHaveLength(2);
    });
  });

  describe('Connection Actions', () => {
    const singleConnection = [{
      tenant: 'org_123',
      name: 'Test SSO Connection',
      description: 'Test connection for unit tests',
      defaultRedirectUrl: 'http://localhost:3000/callback',
      product: 'hospitalos',
    }];

    beforeEach(() => {
      mockUseSSOConnections.mockReturnValue({
        connections: singleConnection,
        isLoading: false,
        isError: false,
        mutate: mockMutate,
      });
    });

    it('should open dropdown menu when more button is clicked', async () => {
      render(<SSOConnectionList />);

      const moreButton = screen.getByRole('button', { name: /more/i });
      await user.click(moreButton);

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should open edit dialog when edit is clicked', async () => {
      render(<SSOConnectionList />);

      const moreButton = screen.getByRole('button', { name: /more/i });
      await user.click(moreButton);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(screen.getByText('Edit SSO Connection')).toBeInTheDocument();
    });

    it('should handle connection deletion with confirmation', async () => {
      // Mock window.confirm to return true
      global.confirm = vi.fn(() => true);

      render(<SSOConnectionList />);

      const moreButton = screen.getByRole('button', { name: /more/i });
      await user.click(moreButton);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete the SSO connection "Test SSO Connection"?',
      );

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('SSO connection deleted successfully');
        expect(mockMutate).toHaveBeenCalled();
      });
    });

    it('should cancel deletion when user rejects confirmation', async () => {
      // Mock window.confirm to return false
      global.confirm = vi.fn(() => false);

      render(<SSOConnectionList />);

      const moreButton = screen.getByRole('button', { name: /more/i });
      await user.click(moreButton);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(global.confirm).toHaveBeenCalled();
      expect(mockToast.success).not.toHaveBeenCalled();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should handle deletion errors gracefully', async () => {
      global.confirm = vi.fn(() => true);

      // Mock deletion to fail
      const { deleteSSOConnection } = await import('@/hooks/useSSOConnections');
      vi.mocked(deleteSSOConnection).mockRejectedValueOnce(new Error('Deletion failed'));

      render(<SSOConnectionList />);

      const moreButton = screen.getByRole('button', { name: /more/i });
      await user.click(moreButton);

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to delete SSO connection');
      });
    });
  });

  describe('Create Connection Dialog', () => {
    it('should open create dialog when Add Connection button is clicked', async () => {
      render(<SSOConnectionList />);

      const addButton = screen.getByRole('button', { name: /add connection/i });
      await user.click(addButton);

      expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
    });

    it('should close create dialog when cancelled', async () => {
      render(<SSOConnectionList />);

      const addButton = screen.getByRole('button', { name: /add connection/i });
      await user.click(addButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByText('Create SSO Connection')).not.toBeInTheDocument();
    });

    it('should refresh data when connection is created successfully', async () => {
      render(<SSOConnectionList />);

      const addButton = screen.getByRole('button', { name: /add connection/i });
      await user.click(addButton);

      // Simulate successful creation (this would normally come from the dialog)
      const createDialog = screen.getByTestId('create-sso-dialog');
      fireEvent(createDialog, new CustomEvent('onSuccess'));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });
  });

  describe('Metadata Download', () => {
    beforeEach(() => {
      // Mock fetch for metadata download
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob(['<metadata>xml content</metadata>'], { type: 'application/xml' })),
      });

      // Mock DOM methods for file download
      const mockLink = {
        style: { display: '' },
        href: '',
        download: '',
        click: vi.fn(),
      };

      document.createElement = vi.fn().mockReturnValue(mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
    });

    it('should download metadata when Download Metadata button is clicked', async () => {
      render(<SSOConnectionList />);

      const downloadButton = screen.getByRole('button', { name: /download metadata/i });
      await user.click(downloadButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/organizations/org_test_123/sso/metadata',
        );
        expect(mockToast.success).toHaveBeenCalledWith('Metadata downloaded successfully');
      });
    });

    it('should handle metadata download errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      render(<SSOConnectionList />);

      const downloadButton = screen.getByRole('button', { name: /download metadata/i });
      await user.click(downloadButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to download metadata');
      });
    });

    it('should create download link with correct filename', async () => {
      render(<SSOConnectionList />);

      const downloadButton = screen.getByRole('button', { name: /download metadata/i });
      await user.click(downloadButton);

      await waitFor(() => {
        const mockLink = document.createElement.mock.results[0].value;

        expect(mockLink.download).toBe('saml-metadata-org_test_123.xml');
      });
    });
  });

  describe('Header and Navigation', () => {
    it('should display correct page title and description', () => {
      render(<SSOConnectionList />);

      expect(screen.getByText('SSO Connections')).toBeInTheDocument();
      expect(screen.getByText('Manage SAML and OIDC connections for enterprise authentication')).toBeInTheDocument();
    });

    it('should have correct button layout in header', () => {
      render(<SSOConnectionList />);

      const headerButtons = screen.getAllByRole('button');
      const downloadButton = screen.getByRole('button', { name: /download metadata/i });
      const addButton = screen.getByRole('button', { name: /add connection/i });

      expect(downloadButton).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();

      // Download button should come before Add button
      const buttonElements = headerButtons.filter(btn =>
        btn.textContent?.includes('Download Metadata') || btn.textContent?.includes('Add Connection'),
      );

      expect(buttonElements[0]).toBe(downloadButton);
      expect(buttonElements[1]).toBe(addButton);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [mockSSOConnection],
        isLoading: false,
        isError: false,
        mutate: mockMutate,
      });

      render(<SSOConnectionList />);

      // Check for proper button roles
      expect(screen.getByRole('button', { name: /add connection/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download metadata/i })).toBeInTheDocument();

      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('SSO Connections');
    });

    it('should support keyboard navigation', async () => {
      mockUseSSOConnections.mockReturnValue({
        connections: [mockSSOConnection],
        isLoading: false,
        isError: false,
        mutate: mockMutate,
      });

      render(<SSOConnectionList />);

      const addButton = screen.getByRole('button', { name: /add connection/i });

      // Focus should work
      addButton.focus();

      expect(addButton).toHaveFocus();

      // Enter key should work
      fireEvent.keyDown(addButton, { key: 'Enter', code: 'Enter' });

      expect(screen.getByText('Create SSO Connection')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should handle mobile layout correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<SSOConnectionList />);

      // Component should still render all essential elements
      expect(screen.getByText('SSO Connections')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add connection/i })).toBeInTheDocument();
    });
  });
});
