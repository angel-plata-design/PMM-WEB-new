import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import pmmApi from "../lib/api";

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { pmmApi.posts().then(setPosts).catch(() => {}); }, []);

  return (
    <>
      <Seo
        title="Insights logísticos · Blog"
        description="Guías, consejos y novedades sobre paquetería, mensajería y logística en México. PMM Insights."
        path="/blog"
      />
      <PageHeader
        overline="Insights"
        title={<>Conocimiento<br /><em className="not-italic text-[#E30613]">que mueve negocios.</em></>}
        description="Guías prácticas, comparativas y novedades del mundo de la paquetería y mensajería en México."
        breadcrumbs={[{ label: "Blog" }]}
      />
      <section className="section-pad">
        <div className="container-pmm">
          {posts[0] && (
            <Link to={`/blog/${posts[0].slug}`} data-testid="blog-featured" className="block mb-20 group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="aspect-[4/3] overflow-hidden bg-zinc-900">
                  <img src={posts[0].cover} alt={posts[0].title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div>
                  <div className="text-overline mb-4">Destacado · {posts[0].category} · {posts[0].read_time}</div>
                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tighter leading-[0.95] group-hover:text-[#E30613] transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-zinc-400 mt-6 text-lg leading-relaxed">{posts[0].excerpt}</p>
                </div>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {posts.slice(1).map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} data-testid={`blog-card-${p.slug}`} className="group">
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-zinc-900">
                  <img src={p.cover} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="text-overline mb-3">{p.category} · {p.read_time}</div>
                <h3 className="font-display text-2xl text-white tracking-tight group-hover:text-[#E30613] transition-colors">{p.title}</h3>
                <p className="text-zinc-400 mt-3 text-sm">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
