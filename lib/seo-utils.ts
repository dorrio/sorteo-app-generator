export function buildKnowledgeGraphFields(tSorteoSeo: (key: string) => string) {
  return {
    about: {
      "@type": "Thing" as const,
      name: tSorteoSeo("about.name"),
      description: tSorteoSeo("about.description"),
    },
    mentions: [
      {
        "@type": "Thing" as const,
        name: tSorteoSeo("mentions.randomNumber.name"),
        sameAs: "https://en.wikipedia.org/wiki/Random_number_generation",
      },
      {
        "@type": "Thing" as const,
        name: tSorteoSeo("mentions.socialMedia.name"),
      },
    ],
    sameAs: ["https://github.com/sorteopro", "https://twitter.com/sorteopro"],
  };
}
