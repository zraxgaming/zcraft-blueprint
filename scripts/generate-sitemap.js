import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SITE_URL = process.env.SITE_URL || 'https://z-craft.xyz';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function main() {
  console.log('Generating sitemap...');

  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/play', changefreq: 'weekly', priority: '0.9' },
    { loc: '/forums', changefreq: 'weekly', priority: '0.8' },
    { loc: '/wiki', changefreq: 'weekly', priority: '0.7' },
    { loc: '/store', changefreq: 'weekly', priority: '0.7' },
    { loc: '/server-listings', changefreq: 'weekly', priority: '0.6' },
    { loc: '/news', changefreq: 'daily', priority: '0.8' },
    { loc: '/changelogs', changefreq: 'weekly', priority: '0.6' },
    { loc: '/events', changefreq: 'weekly', priority: '0.6' },
    { loc: '/support', changefreq: 'monthly', priority: '0.4' },
    { loc: '/search', changefreq: 'weekly', priority: '0.4' },
    { loc: '/status', changefreq: 'hourly', priority: '0.9' }
  ];

  const dynamicUrls = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Fetch news slugs
      const { data: news } = await supabase.from('news').select('slug, updated_at').limit(1000);
      if (news) {
        for (const n of news) {
          dynamicUrls.push({ loc: `/news/${n.slug}`, lastmod: n.updated_at?.slice(0, 10) || null, changefreq: 'weekly' });
        }
      }

      // Fetch wiki slugs
      const { data: wiki } = await supabase.from('wiki').select('slug, updated_at').limit(1000);
      if (wiki) {
        for (const w of wiki) {
          dynamicUrls.push({ loc: `/wiki/${w.slug}`, lastmod: w.updated_at?.slice(0, 10) || null, changefreq: 'monthly' });
        }
      }

      // Fetch changelogs versions
      const { data: changelogs } = await supabase.from('changelogs').select('version, released_at').limit(1000);
      if (changelogs) {
        for (const c of changelogs) {
          // Use version as path (e.g., /changelogs/v1.2.3)
          const v = encodeURIComponent(c.version);
          dynamicUrls.push({ loc: `/changelogs/${v}`, lastmod: c.released_at?.slice(0,10) || null, changefreq: 'monthly' });
        }
      }

      // Fetch events
      const { data: events } = await supabase.from('events').select('id, date').limit(1000);
      if (events) {
        for (const e of events) {
          dynamicUrls.push({ loc: `/events/${e.id}`, lastmod: e.date?.slice(0,10) || null, changefreq: 'weekly' });
        }
      }

      // Fetch recent forum threads (limit configurable via SITEMAP_FORUM_LIMIT)
      const forumLimit = parseInt(process.env.SITEMAP_FORUM_LIMIT || '500', 10);
      const { data: threads } = await supabase.from('forum_posts').select('id, title, updated_at, created_at').order('created_at', { ascending: false }).limit(forumLimit);
      if (threads) {
        for (const t of threads) {
          dynamicUrls.push({ loc: `/forums/${t.id}`, lastmod: (t.updated_at || t.created_at)?.slice(0,10) || null, changefreq: 'weekly' });
        }
      }
    } catch (err) {
      console.warn('Failed to query Supabase for dynamic pages, continuing with static pages only.', err.message || err);
    }
  } else {
    console.warn('Supabase env vars not found; generating sitemap with static pages only. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable dynamic pages.');
  }

  const urls = [...staticPages, ...dynamicUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => {
      const full = `${SITE_URL}${u.loc}`;
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
      const changefreq = u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : '';
      const priority = u.priority ? `\n    <priority>${u.priority}</priority>` : '';
      return `  <url>\n    <loc>${full}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
    })
    .join('\n')}\n</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap, 'utf8');
  console.log(`Wrote public/sitemap.xml with ${urls.length} entries.`);
}

main().catch((e) => {
  console.error('Error generating sitemap', e);
  process.exit(1);
});
