export type SSOConnection = {
  tenant: string;
  product: string;
  name: string;
  description?: string;
  metadataUrl?: string;
  metadata?: string;
  redirectUrl: string[];
  defaultRedirectUrl: string;
  oidcDiscoveryUrl?: string;
  oidcClientId?: string;
  oidcClientSecret?: string;
  clientID?: string;
  clientSecret?: string;
};

export type SSOUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  groups?: string[];
  raw: Record<string, any>;
};

export type SSOProfile = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  raw: Record<string, any>;
};

export type SSOError = {
  message: string;
  description?: string;
};

export type CreateSSOConnectionParams = {
  organizationId: string;
  name: string;
  description?: string;
  metadataUrl?: string;
  metadata?: string;
  redirectUrl: string;
};

export type SSOConnectionListResponse = {
  data: SSOConnection[];
  pageToken?: string;
};

export type SSOCallbackParams = {
  SAMLResponse?: string;
  RelayState?: string;
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
  [key: string]: string | undefined;
};

export type JacksonSAMLResponse = {
  redirect_url?: string;
  app_select_form?: string;
  response_form?: string;
  error?: string;
};

export type JacksonOIDCResponse = {
  redirect_url?: string;
  response_form?: string;
  error?: string;
};

export type JacksonAuthorizeParams = {
  tenant: string;
  product: string;
  redirect_uri: string;
  state?: string;
  idp_hint?: string;
  client_id?: string;
  response_type?: string;
  code_challenge?: string;
  code_challenge_method?: string;
};
