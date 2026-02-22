import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { changelogService, Changelog } from "@/services/changelogService";
import { Loader, ArrowLeft, GitCommit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const typeConfig = {
  feature: { label: "Feature", color: "bg-emerald-500/10 text-emerald-600" },
  fix: { label: "Bug Fix", color: "bg-red-500/10 text-red-600" },
  improvement: { label: "Improvement", color: "bg-blue-500/10 text-blue-600" },
  patch: { label: "Patch", color: "bg-amber-500/10 text-amber-600" },
};

export default function ChangelogDetailPage() {
  const { version } = useParams();
  const [changelog, setChangelog] = useState<Changelog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!version) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await changelogService.getChangelogByVersion(decodeURIComponent(version));
        setChangelog(data);
      } catch (err: any) {
        setError(err?.message || "Changelog not found");
        toast({ title: "Not found", description: "This changelog could not be loaded." });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [version]);

  const publishedTime = changelog?.released_at ? new Date(changelog.released_at).toISOString() : undefined;
  const typeInfo = changelog ? typeConfig[changelog.type] : null;

  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Changelogs", href: "/changelogs" }]}>
        <div className="flex items-center justify-center py-16">
          <Loader className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !changelog) {
    return (
      <Layout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Changelogs", href: "/changelogs" }]}>
        <div className="py-16 text-center text-red-500">{error || "Changelog not found"}</div>
      </Layout>
    );
  }

  return (
    <Layout
      seo={{
        title: `${changelog.title} - ZCraft`,
        description: changelog.description,
        url: `https://z-craft.xyz/changelogs/${encodeURIComponent(changelog.version)}`,
        type: "article",
        publishedTime,
        keywords: `zcraft changelog ${changelog.version}, release notes, ${changelog.type}`,
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Changelogs", href: "/changelogs" },
          { label: `v${changelog.version}`, href: `/changelogs/${encodeURIComponent(changelog.version)}` },
        ],
      }}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Changelogs", href: "/changelogs" },
        { label: `v${changelog.version}`, href: `/changelogs/${encodeURIComponent(changelog.version)}` },
      ]}
    >
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/changelogs"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Changelogs
            </Link>

            <Card className="border-0 bg-card">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {typeInfo && <Badge className={typeInfo.color}>{typeInfo.label}</Badge>}
                  <Badge variant="outline" className="font-mono">
                    v{changelog.version}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-display flex items-center gap-2">
                  <GitCommit className="h-6 w-6 text-primary" />
                  {changelog.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Released{" "}
                  {new Date(changelog.released_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{changelog.description}</p>
                {changelog.changes && changelog.changes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Changes</h3>
                    <ul className="space-y-3">
                      {changelog.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Version {changelog.version} · {changelog.type}
                  </div>
                  <Button asChild variant="outline">
                    <Link to="/changelogs">View all releases</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
