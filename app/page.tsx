import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getArticles, Article } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let articles: Article[] = [];
  let isConnected = true;

  try {
    articles = await getArticles();
  } catch (error) {
    console.error("Failed to fetch articles from backend:", error);
    isConnected = false;
  }

  const featured = articles.length > 0 ? articles[0] : null;
  const latestArticles = articles.length > 1 ? articles.slice(1) : articles;

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />

      {!isConnected && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-center text-xs text-amber-800">
          ⚠️ Could not reach NestJS backend at <code className="font-mono">http://localhost:3000</code>. Please ensure the backend server is running.
        </div>
      )}

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Powered by NestJS & Next.js
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Stories, ideas, and knowledge for curious minds.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Discover articles written and published in real time. Read, explore, and share your own stories.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/articles"
              className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Explore all articles ({articles.length})
            </Link>

            <Link
              href="/articles/new"
              className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Write a story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section id="featured" className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                FEATURED STORY
              </p>
              <h2 className="mt-2 text-3xl font-bold">Latest Publication</h2>
            </div>

            <Link
              href="/articles"
              className="hidden text-sm font-medium text-slate-600 hover:text-blue-600 sm:block"
            >
              View all articles →
            </Link>
          </div>

          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {featured.slug || "Featured"}
              </span>
              <span className="text-xs text-slate-500">
                {featured.createdAt
                  ? new Date(featured.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "long",
                    })
                  : ""}
              </span>
            </div>

            <h3 className="mt-5 text-3xl font-bold leading-tight md:text-5xl text-slate-900">
              {featured.title}
            </h3>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
              {featured.content.length > 250
                ? featured.content.substring(0, 250) + "..."
                : featured.content}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {featured.author?.name || "Author"}
                </p>
                <p className="text-xs text-slate-500">
                  {featured.author?.email || ""}
                </p>
              </div>

              <Link
                href={`/articles/${featured.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Read full article →
              </Link>
            </div>
          </article>
        </section>
      )}

      {/* Latest Articles */}
      <section className="border-y border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                DISCOVER MORE
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Recent Articles
              </h2>
            </div>
            <Link
              href="/articles"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Browse all →
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-lg font-medium text-slate-700">
                No articles yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Be the first person to publish an article!
              </p>
              <Link
                href="/articles/new"
                className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Create Article
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Backend API banner */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center text-white md:px-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Fullstack Integration
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
            Connected to NestJS REST API
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-slate-400 text-sm md:text-base">
            This Next.js app communicates seamlessly with the NestJS backend, offering JWT authentication, Prisma ORM MySQL persistence, and Swagger documentation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="http://localhost:3000/api"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 text-sm"
            >
              Explore Swagger Docs
            </a>
            <Link
              href="/articles"
              className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:bg-slate-800 text-sm"
            >
              View Articles List
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}