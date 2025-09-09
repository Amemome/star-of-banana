import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface PostData {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  // posts 디렉토리에서 파일 이름들을 가져옵니다
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 파일 이름에서 ".md"를 제거하여 slug를 만듭니다
    const slug = fileName.replace(/\.md$/, '');

    // 마크다운 파일을 문자열로 읽습니다
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter를 사용하여 포스트 메타데이터 섹션을 파싱합니다
    const matterResult = matter(fileContents);

    // 데이터를 slug와 함께 결합합니다
    return {
      id: matterResult.data.id,
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date,
      excerpt: matterResult.data.excerpt,
    } as PostData;
  });

  // 포스트를 id 역순으로 정렬합니다 (최신 id가 위로)
  return allPostsData.sort((a, b) => b.id - a.id);
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // gray-matter를 사용하여 포스트 메타데이터 섹션을 파싱합니다
  const matterResult = matter(fileContents);

  // remark를 사용하여 마크다운을 HTML 문자열로 변환합니다
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 데이터를 slug, contentHtml과 함께 결합합니다
  return {
    id: matterResult.data.id,
    slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    excerpt: matterResult.data.excerpt,
    content: contentHtml,
  };
}
