import { getJacksonControllers } from './jackson';
import type { CreateSSOConnectionParams, SSOConnection, SSOConnectionListResponse } from './types';

export async function createSSOConnection(params: CreateSSOConnectionParams): Promise<SSOConnection> {
  const { apiController } = await getJacksonControllers();

  const connectionParams: any = {
    tenant: params.organizationId,
    product: 'hospitalos',
    name: params.name,
    description: params.description,
    redirectUrl: [params.redirectUrl],
    defaultRedirectUrl: params.redirectUrl,
  };

  // Add either metadataUrl or metadata
  if (params.metadataUrl) {
    connectionParams.metadataUrl = params.metadataUrl;
  } else if (params.metadata) {
    connectionParams.encodedRawMetadata = Buffer.from(params.metadata).toString('base64');
  }

  const result = await apiController.createSAMLConnection(connectionParams);

  // Ensure the result has all required fields
  return {
    ...result,
    name: result.name || params.name,
    enabled: result.enabled !== undefined ? result.enabled : true,
  } as SSOConnection;
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
