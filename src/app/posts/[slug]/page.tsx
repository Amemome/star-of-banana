import Link from "next/link";
import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.params.slug,
  }));
}

export default async function Post({ params }: PostPageProps) {
  const { slug } = await params;
  
  try {
    const postData = await getPostData(slug);

    return (
      <div className="min-h-screen p-8 pb-20 sm:p-20">
        <main className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <Link 
              href="/" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← 블로그 목록으로 돌아가기
            </Link>
          </nav>

          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="not-prose mb-8">
              <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
              <div className="text-gray-600 dark:text-gray-300 mb-4">
                <time>
                  {new Date(postData.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 border-l-4 border-blue-500 pl-4 italic">
                {postData.excerpt}
              </p>
            </header>

            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: postData.content }} 
            />
          </article>

          <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← 다른 포스트 보기
            </Link>
          </nav>
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
