import { notFound } from "next/navigation";

/**
 * Any URL no page matches. Without it, unknown URLs would get Next.js's bare
 * 404 outside the root layout (there is no app/layout.tsx above [lang]);
 * this way they get the app's not-found page, in the right language.
 */
export default function MissingPage() {
  notFound();
}
