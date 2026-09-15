'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { deleteArticle } from '@/lib/api';

interface ArticleActionsProps {
  articleId: number;
  authorId: number;
}

export default function ArticleActions({
  articleId,
  authorId,
}: ArticleActionsProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is the author
  const isAuthor = user && user.sub === authorId;

  const handleDelete = async () => {
    if (!token) {
      alert('You must be signed in to delete this article.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this article? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError(null);
      await deleteArticle(articleId, token);
      router.push('/articles');
      router.refresh();
    } catch (err: unknown) {
      console.error('Delete error:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete article';
      setError(message);
      setIsDeleting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Article'}
          </button>
        )}
      </div>
    </div>
  );
}
