import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

const localePrefix: LocalePrefix = 'as-needed';

// Hospital Management System Configuration - Indian Healthcare Context
export const AppConfig = {
  name: 'Sanjeevani HMS', // Hospital Management System for Indian healthcare
  locales: [
    {
      id: 'en',
      name: 'English',
    },
    { id: 'hi', name: 'हिन्दी' }, // Hindi support for Indian users
  ],
  defaultLocale: 'en',
  localePrefix,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);
