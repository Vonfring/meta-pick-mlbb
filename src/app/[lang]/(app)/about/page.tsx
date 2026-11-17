import Link from "@/components/locale-link";
import { CatalogCredit } from "@/components/meta/catalog-credit";
import { PageHeader } from "@/components/meta/page-header";
import { aboutText } from "@/i18n/messages/about";
import { common } from "@/i18n/messages/common";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = aboutText[locale];
  return pageMetadata(locale, "/about", {
    title: t.title,
    description: t.metaDescription,
  });
}

// Links inside running text need more than color to stand out (WCAG 1.4.1).
const link = "text-ally-text underline underline-offset-2 hover:decoration-2";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = aboutText[locale];
  const { site, nav, and } = common[locale];
  return (
    <article className="flex max-w-[68ch] flex-col gap-8">
      <PageHeader className="pb-0" title={t.title} description={t.intro} />

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">
          {t.source.heading}
        </h2>
        <p className="text-muted-foreground">{t.source.body}</p>
        <p className="text-muted-foreground">{t.source.builds}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">
          {t.numbers.heading}
        </h2>
        <p className="text-muted-foreground">{t.numbers.body}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">
          {t.curated.heading}
        </h2>
        <p className="text-muted-foreground">{t.curated.body}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">
          {t.tools.heading}
        </h2>
        <p className="text-muted-foreground">{t.tools.body}</p>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
          <li>
            <Link href="/tier-list" className={link}>
              {nav.items["/tier-list"].label}
            </Link>
            : {t.tools.tierList}
          </li>
          <li>
            <Link href="/counter-pick" className={link}>
              {nav.items["/counter-pick"].label}
            </Link>{" "}
            {and}{" "}
            <Link href="/matchup" className={link}>
              {nav.items["/matchup"].label}
            </Link>
            : {t.tools.counterAndMatchup}
          </li>
          <li>
            <Link href="/team-composition" className={link}>
              {nav.items["/team-composition"].label}
            </Link>{" "}
            {and}{" "}
            <Link href="/draft" className={link}>
              {nav.items["/draft"].label}
            </Link>
            : {t.tools.compositionAndDraft}
          </li>
        </ul>
        <p className="text-muted-foreground">{t.tools.estimates}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">
          {t.disclaimerHeading}
        </h2>
        <p className="text-muted-foreground">
          {site.disclaimer} {site.attribution}
        </p>
        <CatalogCredit className="text-muted-foreground" />
      </section>
    </article>
  );
}
