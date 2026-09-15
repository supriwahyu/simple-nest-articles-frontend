import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 ArticleHub. Connected to NestJS backend.</p>

        <div className="flex gap-6">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link href="/articles" className="hover:text-slate-900">
            Articles
          </Link>
          <a
            href="http://localhost:3000/api"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            Swagger API Docs ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
