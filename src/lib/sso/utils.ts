import { getJacksonControllers } from './jackson';
import type { CreateSSOConnectionParams, SSOConnection, SSOConnectionListResponse } from './types';

export async function createSSOConnection(params: CreateSSOConnectionParams): Promise<SSOConnection> {
  const { apiController } = await getJacksonControllers();

  const connectionParams = {
    tenant: params.organizationId,
    product: 'hospitalos',
    name: params.name,
    description: params.description,
    metadataUrl: params.metadataUrl,
    metadata: params.metadata,
    redirectUrl: [params.redirectUrl],
    defaultRedirectUrl: params.redirectUrl,
  };

  return await apiController.createSAMLConnection(connectionParams);
}

export async function getSSOConnections(organizationId: string): Promise<SSOConnectionListResponse> {
  const { apiController } = await getJacksonControllers();

  return await apiController.getConnections({
    tenant: organizationId,
    product: 'hospitalos',
  });
}

export async function getSSOConnection(organizationId: string, connectionId: string): Promise<SSOConnection> {
  const { apiController } = await getJacksonControllers();

  return await apiController.getConnection({
    tenant: organizationId,
    product: 'hospitalos',
    clientID: connectionId,
  });
}

export async function updateSSOConnection(
  organizationId: string,
  connectionId: string,
  updates: Partial<CreateSSOConnectionParams>,
): Promise<SSOConnection> {
  const { apiController } = await getJacksonControllers();

  const updateParams = {
    tenant: organizationId,
    product: 'hospitalos',
    clientID: connectionId,
    ...updates,
  };

  return await apiController.updateSAMLConnection(updateParams);
}

export async function deleteSSOConnection(organizationId: string, connectionId: string): Promise<void> {
  const { apiController } = await getJacksonControllers();

  await apiController.deleteConnections({
    tenant: organizationId,
    product: 'hospitalos',
    clientID: connectionId,
  });
}

export async function getSSOMetadata(organizationId: string): Promise<string> {
  const { spConfig } = await getJacksonControllers();

  return await spConfig.get({
    tenant: organizationId,
    product: 'hospitalos',
  });
}

export function generateRedirectUrl(baseUrl: string): string {
  return `${baseUrl}/api/auth/sso/callback`;
}

export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' || parsedUrl.hostname === 'localhost';
  } catch {
    return false;
  }
}

export function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@(.+)$/);
  return match ? match[1] : null;
}

export function sanitizeTenant(organizationId: string): string {
  return organizationId.replace(/[^\w-]/g, '');
}
