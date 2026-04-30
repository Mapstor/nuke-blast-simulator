import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArticleBody } from '@/components/blog/ArticleBody'
import {
  articleSchema,
  breadcrumbSchema,
  SITE_URL,
} from '@/lib/seo/schemas'
import { articles, findArticle, categoryLabel } from '@/lib/blog/articles'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = findArticle(slug)
  if (!article) return { title: 'Article Not Found' }

  return {
    title: `${article.title} | Nuclear Blast Simulator Blog`,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified ?? article.datePublished,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = findArticle(slug)
  if (!article) notFound()

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      <JsonLd
        id={`ld-blog-${article.slug}`}
        schema={[
          articleSchema({
            url: `/blog/${article.slug}`,
            headline: article.title,
            description: article.description,
            datePublished: article.datePublished,
            dateModified: article.dateModified ?? article.datePublished,
            authorName: article.author,
          }),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Blog', url: '/blog' },
            { name: article.title, url: `/blog/${article.slug}` },
          ]),
        ]}
      />

      <main className="max-w-3xl mx-auto p-8">
        <nav aria-label="Breadcrumb" className="text-sm text-green-300/70 mb-6">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-green-400">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-green-400">{article.title}</span>
        </nav>

        <header className="mb-10">
          <p className="text-xs uppercase tracking-wide text-green-300/70 mb-3">
            {categoryLabel(article.category)} · {article.readingMinutes} min read
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-yellow-400 mb-4">{article.description}</p>
          <p className="text-sm text-green-300/70">
            By <span className="text-green-300">{article.author}</span> ·{' '}
            <time dateTime={article.datePublished}>
              {new Date(article.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            {article.dateModified && article.dateModified !== article.datePublished ? (
              <> · Updated <time dateTime={article.dateModified}>{new Date(article.dateModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time></>
            ) : null}
          </p>
        </header>

        <ArticleBody sections={article.body} />

        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-green-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block bg-black/50 border border-green-500/30 rounded-lg p-4 hover:border-green-400 transition"
                >
                  <div className="font-semibold text-yellow-400">{r.title}</div>
                  <div className="text-xs text-green-300/70 mt-1">{r.description}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 text-sm text-green-300/70">
          See the full <Link href="/blog" className="text-yellow-400 hover:underline">blog</Link>, the{' '}
          <Link href="/glossary" className="text-yellow-400 hover:underline">glossary</Link>, or the{' '}
          <Link href="/" className="text-yellow-400 hover:underline">interactive simulator</Link>.
        </section>
      </main>
    </div>
  )
}
