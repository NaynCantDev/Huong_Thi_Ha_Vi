import type { PageSlug } from '../content/types'
import { getPage } from '../data/pages'
import { SITE } from '../data/site'

/** Per-page <title> and description (React 19 hoists these into <head>). */
export function Seo({ slug }: { slug: PageSlug }) {
  const page = getPage(slug)
  const title = slug === 'gioi-thieu' ? `${SITE.name} — Portfolio` : `${page.title} — ${SITE.name}`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={page.description} />
    </>
  )
}
