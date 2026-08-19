import { getAllPostsMeta } from "@/lib/markdown";
import Link from "next/link";
import ArticleCard from "./ArticleCard";

export default function FeaturedBlogs() {
  const posts = getAllPostsMeta();

  return (
    <>
      {/* ---------- Blogs ---------- */}
      <section id="blogs" className="mx-auto max-w-3xl px-6 py-10">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <ArticleCard
              imgSrc={post.cover}
              title={post.title}
              description={post.subtitle}
            />
          </Link>
        ))}
      </section>
    </>
  );
}