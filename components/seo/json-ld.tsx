import { safeJsonLdStringify } from '@/lib/utils';

type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>;

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script; serializer escapes HTML-sensitive chars
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}
    />
  );
}
