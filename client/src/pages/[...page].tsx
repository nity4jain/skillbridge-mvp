import { builder } from '@builder.io/react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from 'next';

builder.init('cd0c1d5f02e0416c90f6af0fd252c2ba'); // Replace with your real API key

export async function getStaticProps(context: GetStaticPropsContext) {
  const pageParam = context.params?.page;
  const urlPath =
    '/' +
    (Array.isArray(pageParam)
      ? pageParam.join('/')
      : pageParam || '');

  console.log('Fetching page for path:', urlPath);

  const content = await builder
    .get('page', {
      url: urlPath,
    })
    .toPromise();

  console.log('Fetched content:', content);

  return {
    props: {
      content: content || null,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export default function Page({ content }: any) {
  const isPreviewing = useIsPreviewing();

  if (!content && !isPreviewing) {
    return <h1>404 - Page Not Found</h1>;
  }

  return <BuilderComponent model="page" content={content} />;
}
