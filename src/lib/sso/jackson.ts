import type {
  IConnectionAPIController,
  IDirectorySyncController,
  IOAuthController,
  ISPSSOConfig,
  JacksonOption,
} from '@boxyhq/saml-jackson';
import jackson from '@boxyhq/saml-jackson';
import { Env } from '@/libs/Env';

const opts: JacksonOption = {
  externalUrl: Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
  samlPath: '/api/auth/sso/callback',
  oidcPath: '/api/auth/sso/oidc',
  samlAudience: Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
  db: {
    engine: 'sql',
    type: 'postgres',
    url: Env.DATABASE_URL || '',
  },
  idpDiscoveryPath: '/auth/sso/idp-select',
  idpEnabled: true,
  clientSecretVerifier: Env.JACKSON_CLIENT_SECRET_VERIFIER || 'dummy',
};

let apiController: IConnectionAPIController;
let oauthController: IOAuthController;
let directorySyncController: IDirectorySyncController;
let spConfig: ISPSSOConfig;

const g = global as any;

export default async function init() {
  if (!g.jackson) {
    g.jackson = await jackson(opts);
  }

  apiController = g.jackson.apiController;
  oauthController = g.jackson.oauthController;
  directorySyncController = g.jackson.directorySyncController;
  spConfig = g.jackson.spConfig;

  return {
    apiController,
    oauthController,
    directorySyncController,
    spConfig,
  };
}

export async function getJacksonControllers() {
  if (!apiController || !oauthController || !directorySyncController || !spConfig) {
    const controllers = await init();
    return controllers;
  }

  return {
    apiController,
    oauthController,
    directorySyncController,
    spConfig,
  };
}

export {
  apiController,
  directorySyncController,
  oauthController,
  spConfig,
};
