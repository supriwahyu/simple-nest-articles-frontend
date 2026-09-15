'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { createArticle } from '@/lib/api';

export default function NewArticlePage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugCustom) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugCustom(true);
    setSlug(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to create an article.');
      return;
    }

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }

    if (slug.trim().length < 3) {
      setError('Slug must be at least 3 characters long.');
      return;
    }

    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const article = await createArticle(
        {
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
        },
        token
      );
      router.push(`/articles/${article.id}`);
    } catch (err: unknown) {
      console.error('Failed to create article:', err);
      const message = err instanceof Error ? err.message : 'Failed to create article.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center p-6">
          <div className="text-slate-500">Checking authentication...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Sign In to Write
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              You need an account to write and publish articles on the NestJS platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login?redirect=/articles/new"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Sign in to existing account
              </Link>
              <Link
                href="/register?redirect=/articles/new"
                className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Create new account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-8">
          <Link
            href="/articles"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            ← Back to Articles
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Create New Article
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Publish your article to the NestJS database. Author: <span className="font-semibold text-slate-800">{user.email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-800"
            >
              Article Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Understanding Next.js and NestJS Integration"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-semibold text-slate-800"
            >
              Unique Slug
            </label>
            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g. understanding-nextjs-nestjs"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Must be unique in the system. Generated automatically from title.
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-slate-800"
            >
              Article Content
            </label>
            <textarea
              id="content"
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full content of your article here (min 10 characters)..."
              className="mt-2 w-full rounded-xl border border-slate-300 p-4 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
            <Link
              href="/articles"
              className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
