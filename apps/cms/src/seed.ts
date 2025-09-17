import payload from "payload";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    local: true,
  });

  // Ensure author
  const author = await payload.create({
    collection: "authors",
    data: { name: "Triple Zero Staff", slug: "staff" }
  });

  // Ensure tags
  const tags = await Promise.all(
    ["culture", "breakdown", "deals", "beyond"].map(name =>
      payload.create({
        collection: "tags",
        data: { name, slug: name }
      })
    )
  );

  // Create two posts
  await payload.create({
    collection: "posts",
    data: {
      title: "Welcome to Triple Zero Sports",
      slug: "welcome",
      description: "Launch post",
      author: author.id,
      tags: [tags[0].id, tags[1].id],
      featured: true,
      publishedAt: new Date().toISOString(),
      body: [{ type: "paragraph", children: [{ text: "We're live." }] }],
      _status: "published"
    }
  });

  await payload.create({
    collection: "posts",
    data: {
      title: "Culture Watch: Week One",
      slug: "culture-watch-week-one",
      description: "Notes on storylines we're tracking.",
      author: author.id,
      tags: [tags[0].id],
      featured: false,
      publishedAt: new Date().toISOString(),
      body: [{ type: "paragraph", children: [{ text: "Early trends and vibes." }] }],
      _status: "published"
    }
  });

  payload.logger.info("Seed complete");
  process.exit(0);
}

run();