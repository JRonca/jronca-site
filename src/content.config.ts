import { defineCollection } from 'astro:content';
import { z } from 'astro/zod'
import { glob } from 'astro/loaders';

const artigos = defineCollection({
  loader: glob({ pattern: '{pt,en}/**/*.{md,mdx}', base: './src/content/artigos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(['security', 'devops', 'k8s', 'systems', 'outros']),
      tags: z.array(z.string()).min(1),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      heroImage: image().optional(),
      canonical: z.string().url().optional(),
      mediumUrl: z.string().url().optional(),
    }),
});

const projetos = defineCollection({
  loader: glob({ pattern: '{pt,en}/**/*.{md,mdx}', base: './src/content/projetos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo: z.string().optional(),
    featured: z.boolean().default(false),
    year: z.number(),
    role: z.string().optional(),
    stack: z.array(z.string()).min(1),
    links: z
      .object({
        demo: z.string().url().optional(),
        repo: z.string().url().optional(),
        writeup: z.string().url().optional(),
      })
      .optional(),
    status: z.enum(['ativo', 'arquivado', 'wip']).optional(),
  }),
});

export const collections = { artigos, projetos };
