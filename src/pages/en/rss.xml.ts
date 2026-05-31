import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { config } from '../../config';

export async function GET(context: APIContext) {
  const articles = await getCollection('artigos', ({ id, data }) => {
    return id.startsWith('en/') && !data.draft;
  });

  articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'JRONCA — Articles',
    description: 'Technical notes and articles about Kubernetes, security, DevOps, and DevSecOps.',
    site: context.site || config.siteUrl,
    items: articles.map(post => {
      const slug = post.id.split('/').pop()?.replace(/\.(md|mdx)$/, '') || post.id;
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/en/artigos/${slug}`,
      };
    }),
  });
}
