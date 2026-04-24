import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/sitemap*.xml'] },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // eslint-config-next 16.2 flags setState inside useEffect as an error.
      // Our usages (SSR hydration flags, media-query subscribers) are the
      // legitimate "sync external system" exception the rule's own docs call
      // out. Demoting to warn until React Hooks upstream tightens the rule.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
