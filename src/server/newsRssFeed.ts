import { NextFunction, Request, Response } from "express";
import { newsService } from "../src/services/newsService";

export async function newsRssFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const news = await newsService.getNews();
    const items = news.map((article: any) => `
      <item>
        <title>${article.title}</title>
        <link>https://z-craft.xyz/news/${article.slug}</link>
        <description>${article.description}</description>
        <pubDate>${new Date(article.updated_at || article.created_at).toUTCString()}</pubDate>
        <guid>https://z-craft.xyz/news/${article.slug}</guid>
      </item>
    `).join("");
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>ZCraft News Feed</title>
          <link>https://z-craft.xyz/news</link>
          <description>Latest news from ZCraft Network</description>
          <language>en-us</language>
          ${items}
        </channel>
      </rss>`;
    res.set("Content-Type", "application/xml");
    res.send(rss);
  } catch (err) {
    next(err);
  }
}
