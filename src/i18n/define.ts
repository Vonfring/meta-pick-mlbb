import type { Locale } from "./config";

/**
 * A group of texts in every language. The English object sets the shape;
 * the Indonesian one must have exactly the same keys, and functions with the
 * same parameters, or the build fails. Use functions for texts with values
 * in them: `heroCount: (n: number) => \`${n} heroes\``.
 *
 *   export const tierListText = defineMessages({
 *     en: { title: "Tier list" },
 *     id: { title: "Tier list" },
 *   });
 *   tierListText[locale].title
 */
export function defineMessages<T>(messages: {
  en: T;
  id: NoInfer<T>;
}): Record<Locale, T> {
  return messages;
}
