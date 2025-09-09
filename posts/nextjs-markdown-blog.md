---
id: 2
title: "Next.js와 Markdown으로 블로그 만들기"
date: "2025-01-02"
excerpt: "Next.js 15와 Markdown을 사용해서 간단한 정적 블로그를 만드는 방법을 알아봅시다."
slug: "nextjs-markdown-blog"
---

# Next.js와 Markdown으로 블로그 만들기

Next.js는 React 기반의 풀스택 웹 프레임워크로, 정적 사이트 생성에 매우 적합합니다.

## 주요 기능

### 1. 정적 사이트 생성 (SSG)
- 빌드 시점에 페이지를 미리 생성
- 빠른 로딩 속도
- SEO 최적화

### 2. 파일 기반 라우팅
- `pages` 또는 `app` 디렉토리 구조를 따라 자동 라우팅
- 동적 라우팅 지원

### 3. 이미지 최적화
```jsx
import Image from 'next/image';

<Image 
  src="/my-image.jpg" 
  alt="설명" 
  width={500} 
  height={300} 
/>
```

## Markdown의 활용

Markdown을 사용하면:
1. 작성이 쉽고 빠름
2. Git으로 버전 관리 가능
3. 다양한 포맷으로 변환 가능

> **팁**: `gray-matter`를 사용하면 front matter를 쉽게 파싱할 수 있습니다.

이렇게 간단하게 블로그를 만들 수 있습니다!
