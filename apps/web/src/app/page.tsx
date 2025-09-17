import { fetchPosts } from "@/lib/cms";

export const revalidate = 300; // ISR

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Triple Zero Sports</h1>
      <p className="text-gray-600">Sports news, culture, business & analytics.</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Latest</h2>
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.slug} className="border p-3 rounded">
              <div className="font-semibold">{p.title}</div>
              {p.description && <div className="text-sm text-gray-600">{p.description}</div>}
            </li>
          ))}
          {posts.length === 0 && <li className="text-gray-500">No posts yet.</li>}
        </ul>
      </section>
    </main>
  );
}