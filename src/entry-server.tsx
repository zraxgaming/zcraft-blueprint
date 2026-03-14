import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App, { SSRSafeApp } from './App';
import fs from 'fs';
import path from 'path';

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        enabled: false, // Disable queries during SSR
      },
    },
  });

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={url}>
        <SSRSafeApp />
      </StaticRouter>
    </QueryClientProvider>
  );

  const template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  const renderedHtml = template.replace('<!--ssr-outlet-->', appHtml);

  return renderedHtml;
}