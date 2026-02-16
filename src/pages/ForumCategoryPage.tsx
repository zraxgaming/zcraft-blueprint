import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, MessageSquare, Clock, User, Loader, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { forumService, Forum, ForumPost } from "@/services/forumService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function ForumCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    loadForum();
  }, [slug]);

  const loadForum = async () => {
    try {
      if (!slug) {
        navigate("/forums");
        return;
      }

      const forumData = await forumService.getForumBySlug(slug);
      setForum(forumData);

      const postsData = await forumService.getForumPosts(forumData.id);
      setPosts(postsData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to load forum",
        variant: "destructive",
      });
      navigate("/forums");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    !searchQuery ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!newPostTitle || !newPostContent || !forum) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await forumService.createForumPost({
        forum_id: forum.id,
        author_id: user.id,
        title: newPostTitle,
        content: newPostContent,
      } as any);

      toast({
        title: "Success",
        description: "Your post has been created!",
      });

      setShowNewPost(false);
      setNewPostTitle("");
      setNewPostContent("");
      loadForum();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create post",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      </Layout>
    );
  }

  if (!forum) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Forum not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout seo={{
      title: `${forum.title} - ZCraft Network Forums`,
      description: forum.description || "ZCraft Network community forum",
      keywords: `forum, ${forum.category}, zcraft network, discussion`,
      url: `https://z-craft.xyz/forums/${forum.slug}`,
      type: "website",
    }}>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/forums"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forums
          </Link>

          {/* Forum Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{forum.title}</h1>
                  <Badge>{forum.category}</Badge>
                </div>
                <p className="text-muted-foreground">{forum.description}</p>
              </div>
            </div>

            {/* Forum Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Posts</p>
                  <p className="text-2xl font-bold">{forum.post_count || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Replies</p>
                  <p className="text-2xl font-bold">{forum.reply_count || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-card">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                  <p className="text-sm font-medium">
                    {forum.last_post_date
                      ? new Date(forum.last_post_date).toLocaleDateString()
                      : "No activity"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-12 h-12"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Create Post Button */}
          {user && (
            <Button
              className="mb-6 gap-2"
              onClick={() => setShowNewPost(!showNewPost)}
            >
              <PlusCircle className="h-4 w-4" />
              New Post
            </Button>
          )}

          {/* New Post Form */}
          {showNewPost && (
            <Card className="mb-6 border-0 bg-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Create New Post</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Post title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Write your post content..."
                    className="w-full p-3 rounded-md bg-muted border border-input min-h-[150px]"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleCreatePost}>
                      Post
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNewPost(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card className="border-0 bg-card">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No posts match your search."
                      : "No posts yet. Be the first to post!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition cursor-pointer border-0 bg-card hover:bg-muted/50"
                    onClick={() => navigate(`/forums/${slug}/${post.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Author */}
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                by {post.author?.username || "Unknown"}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted whitespace-nowrap ml-2">
                              {post.replies || 0} replies
                            </span>
                          </div>

                          <p className="text-muted-foreground mt-2 line-clamp-2">
                            {post.content}
                          </p>

                          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(post.created_at || "").toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {post.views || 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
