import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { config } from '../config';

export async function GET(context: APIContext) {
  const articles = await getCollection('artigos', ({ id, data }) => {
    return id.startsWith('pt/') && !data.draft;
  });

  articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'JRONCA — Artigos',
    description: 'Notas técnicas e artigos sobre Kubernetes, segurança, DevOps e DevSecOps.',
    site: context.site || config.siteUrl,
    items: articles.map(post => {
      const slug = post.id.split('/').pop()?.replace(/\.(md|mdx)$/, '') || post.id;
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/artigos/${slug}`,
      };
    }),
  });
}
