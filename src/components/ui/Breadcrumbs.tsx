import { Link } from "react-router-dom";
import React from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (!crumbs || crumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="bg-transparent py-3">
      <ol className="container mx-auto px-4 flex items-center gap-2 text-sm text-muted-foreground">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center">
            {c.href ? (
              c.href.startsWith("http") ? (
                <a href={c.href} className="hover:underline" rel="noopener noreferrer">
                  {c.label}
                </a>
              ) : (
                <Link to={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )
            ) : (
              <span>{c.label}</span>
            )}
            {i < crumbs.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
