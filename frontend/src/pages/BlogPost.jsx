import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/Seo";
import pmmApi from "../lib/api";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null); setError("");
    pmmApi.post(slug).then(setPost).catch(() => setError("No encontrado"));
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-4xl text-white">Artículo no encontrado</h2>
          <Link to="/blog" className="mt-6 inline-block text-[#E30613] hover:underline">Volver al blog</Link>
        </div>
      </div>
    );
  }

  if (!post) return <div className="min-h-[60vh]" />;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.date,
    author: { "@type": "Organization", name: "PMM" },
    publisher: {
      "@type": "Organization",
      name: "PMM",
      logo: { "@type": "ImageObject", url: "https://pmm.com.mx/logo.png" },
    },
  };

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover}
        type="article"
        jsonLd={articleSchema}
      />

      <article className="pt-32 pb-24">
        <div className="container-pmm max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-mono uppercase tracking-wider mb-12">
            <ArrowLeft size={14} /> Insights
          </Link>
          <div className="text-overline mb-6">{post.category} · {post.read_time} · {post.date}</div>
          <h1 className="font-display text-white text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] mb-10">
            {post.title}
          </h1>
          <div className="aspect-[16/9] overflow-hidden bg-zinc-900 mb-12">
            <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="prose prose-invert max-w-none">
            {post.content.split(/\n\n+/).map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="font-display text-3xl text-white mt-12 mb-4">{para.replaceAll("**", "")}</h3>;
              }
              // bold-prefixed paragraph
              const m = para.match(/^\*\*(.+?)\*\*\s*(.*)$/s);
              if (m) {
                return (
                  <p key={i} className="text-zinc-300 text-lg leading-relaxed mb-6">
                    <strong className="text-white">{m[1]}</strong> {m[2]}
                  </p>
                );
              }
              return <p key={i} className="text-zinc-300 text-lg leading-relaxed mb-6 whitespace-pre-line">{para}</p>;
            })}
          </div>
        </div>
      </article>
    </>
  );
}
