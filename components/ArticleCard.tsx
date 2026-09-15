import Link from 'next/link';
import { Article } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  // Short snippet from content
  const snippet =
    article.content.length > 120
      ? article.content.substring(0, 120) + '...'
      : article.content;

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            {article.slug || 'Article'}
          </span>
          <span className="text-xs text-slate-400">{formattedDate}</span>
        </div>

        <h3 className="mt-4 text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition">
          <Link href={`/articles/${article.id}`}>{article.title}</Link>
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
          {snippet}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs">
          <p className="font-medium text-slate-800">
            {article.author?.name || 'Anonymous Author'}
          </p>
          <p className="text-slate-400">{article.author?.email || ''}</p>
        </div>

        <Link
          href={`/articles/${article.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
