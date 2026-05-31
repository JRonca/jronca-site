export const languages = {
  pt: 'PT',
  en: 'EN',
} as const;

export const defaultLang = 'pt';

export const ui = {
  pt: {
    'nav.home': 'Início',
    'nav.artigos': 'Artigos',
    'nav.projetos': 'Projetos',
    'nav.sobre': 'Sobre',
    'sidebar.social': 'Social',
    'theme.toggle': 'Alternar tema',
    'project.stars': 'stars',
    'project.language': 'linguagem',
    'project.lastCommit': 'último commit',
    'project.status': 'status',
    'project.status.ativo': 'Ativo',
    'project.status.arquivado': 'Arquivado',
    'project.status.wip': 'WIP',
    'article.readingTime': 'min de leitura',
    'article.publishedAt': 'Publicado em',
    'article.updatedAt': 'Atualizado em',
    'article.back': '← Voltar para artigos',
    'article.medium': 'Leia também no Medium',
    'home.terminal.greeting': 'Olá, sou o Ronca.',
    'home.terminal.role': 'Engenheiro Backend / DevOps / DevSecOps',
    'home.featured.articles': 'Artigos Destacados',
    'home.featured.projects': 'Projetos Destacados',
    'home.viewAll.articles': 'Ver todos os artigos',
    'home.viewAll.projects': 'Ver todos os projetos',
  },
  en: {
    'nav.home': 'Home',
    'nav.artigos': 'Articles',
    'nav.projetos': 'Projects',
    'nav.sobre': 'About',
    'sidebar.social': 'Social',
    'theme.toggle': 'Toggle theme',
    'project.stars': 'stars',
    'project.language': 'language',
    'project.lastCommit': 'last commit',
    'project.status': 'status',
    'project.status.ativo': 'Active',
    'project.status.arquivado': 'Archived',
    'project.status.wip': 'WIP',
    'article.readingTime': 'min read',
    'article.publishedAt': 'Published on',
    'article.updatedAt': 'Updated on',
    'article.back': '← Back to articles',
    'article.medium': 'Also on Medium',
    'home.terminal.greeting': 'Hi, I am Ronca.',
    'home.terminal.role': 'Backend / DevOps / DevSecOps Engineer',
    'home.featured.articles': 'Featured Articles',
    'home.featured.projects': 'Featured Projects',
    'home.viewAll.articles': 'View all articles',
    'home.viewAll.projects': 'View all projects',
  },
} as const;

export type Locale = keyof typeof ui;

export function useTranslations(lang: Locale = defaultLang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Locale = defaultLang) {
  return function translatePath(path: string, l: Locale = lang) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (l === defaultLang) {
      return cleanPath;
    }
    return `/${l}${cleanPath === '/' ? '' : cleanPath}`;
  };
}
