'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { getArticles, Article } from '@/lib/api';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = () => {
    setIsLoading(true);
    setError(null);
    getArticles()
      .then((data) => {
        setArticles(data);
      })
      .catch((err: unknown) => {
        console.error(err);
        const message =
          err instanceof Error ? err.message : 'Failed to load articles from backend';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getArticles()
      .then((data) => {
        if (isMounted) {
          setArticles(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error(err);
          const message =
            err instanceof Error ? err.message : 'Failed to load articles from backend';
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredArticles = articles.filter((article) => {
    const query = search.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      (article.author?.name && article.author.name.toLowerCase().includes(query)) ||
      (article.slug && article.slug.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Explore Stories
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              All Articles
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Browse through all publications stored in the NestJS MySQL database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/articles/new"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              + Create Article
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="my-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by title, content, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 p-6"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={loadArticles}
              className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <p className="text-slate-500">
              {search
                ? `No articles match "${search}"`
                : 'No articles found in the database.'}
            </p>
            <div className="mt-4">
              <Link
                href="/articles/new"
                className="inline-block rounded-full bg-blue-600 px-5 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
              >
                Publish the first one
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
