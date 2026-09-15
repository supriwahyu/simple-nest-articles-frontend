import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleActions from './ArticleActions';
import { getArticle, Article } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let article: Article | null = null;

  try {
    article = await getArticle(id);
  } catch (error) {
    console.error('Failed to get article:', error);
  }

  if (!article || !article.id) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Article Not Found</h1>
          <p className="mt-4 text-slate-500">
            The article with ID &quot;{id}&quot; does not exist or has been removed.
          </p>
          <Link
            href="/articles"
            className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            ← Back to Articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <Link
            href="/articles"
            className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Articles
          </Link>

          <ArticleActions
            articleId={article.id}
            authorId={article.authorId}
          />
        </div>

        {/* Article Header */}
        <header className="py-10">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              {article.slug || 'Article'}
            </span>
            <span className="text-xs text-slate-400">ID #{article.id}</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            {article.title}
          </h1>

          <div className="mt-8 flex items-center gap-4 border-y border-slate-100 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-lg">
              {(article.author?.name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {article.author?.name || 'Anonymous Author'}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{article.author?.email}</span>
                {formattedDate && <span>• {formattedDate}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-slate max-w-none pb-20 leading-relaxed text-slate-700">
          {article.content.split('\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            return (
              <p key={index} className="mt-5 text-base sm:text-lg leading-8 text-slate-700">
                {trimmed}
              </p>
            );
          })}
        </article>
      </main>

      <Footer />
    </div>
  );
}
