import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Star of Banana Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Markdown 기반의 간단한 블로그입니다
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-6">최신 포스트</h2>
          <div className="space-y-6">
            {allPostsData.map((post) => (
              <article 
                key={post.slug}
                className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Link href={`/posts/${post.slug}`} className="block group">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {post.excerpt}
                  </p>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          © 2025 Star of Banana Blog. Powered by Next.js
        </p>
      </footer>
    </div>
  );
}
