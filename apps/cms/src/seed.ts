import payload from 'payload';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    local: true,
  });

  try {
    // Create admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@triplezerosports.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
      },
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create tags
    const cultureTag = await payload.create({
      collection: 'tags',
      data: {
        name: 'Culture',
        slug: 'culture',
        description: 'Sports culture and lifestyle content',
        color: 'blue',
      },
    });

    const breakdownTag = await payload.create({
      collection: 'tags',
      data: {
        name: 'Breakdown',
        slug: 'breakdown',
        description: 'In-depth analysis and breakdowns',
        color: 'green',
      },
    });

    const dealsTag = await payload.create({
      collection: 'tags',
      data: {
        name: 'Deals',
        slug: 'deals',
        description: 'Sports deals and offers',
        color: 'red',
      },
    });

    const beyondTag = await payload.create({
      collection: 'tags',
      data: {
        name: 'Beyond',
        slug: 'beyond',
        description: 'Beyond the game coverage',
        color: 'purple',
      },
    });

    console.log('✅ Created tags');

    // Create authors
    const staffAuthor = await payload.create({
      collection: 'authors',
      data: {
        name: 'TripleZero Staff',
        slug: 'triplezeero-staff',
        bio: 'The editorial team at TripleZeroSports bringing you the latest in sports news, analysis, and culture.',
        social: {
          x: 'triplezerosports',
          instagram: 'triplezerosports',
          site: 'https://triplezerosports.com',
        },
      },
    });

    const guestAuthor = await payload.create({
      collection: 'authors',
      data: {
        name: 'Guest Writer',
        slug: 'guest-writer',
        bio: 'Contributing writer with expertise in sports journalism and analysis.',
      },
    });

    console.log('✅ Created authors');

    // Sample posts data
    const posts = [
      {
        title: 'The Evolution of Sports Culture in the Digital Age',
        description: 'How social media and streaming platforms are reshaping how we consume and engage with sports.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The landscape of sports culture has undergone a dramatic transformation in recent years. From traditional broadcast television to streaming platforms, and from newspaper sports sections to social media highlights, the way fans engage with their favorite teams and athletes has evolved significantly.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Social media platforms like Instagram, TikTok, and Twitter have become primary sources of sports content for younger demographics. Athletes now have direct channels to communicate with fans, share behind-the-scenes content, and build personal brands that extend far beyond their performance on the field.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This shift has created new opportunities for engagement but also new challenges for traditional sports media. Teams and leagues must now think beyond game coverage to create compelling digital experiences that capture and retain fan attention in an increasingly crowded content landscape.',
                },
              ],
            },
          ],
        },
        tags: [cultureTag.id],
        author: staffAuthor.id,
        featured: true,
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      {
        title: 'Breaking Down the Perfect Play: Anatomy of Elite Performance',
        description: 'A deep dive into what separates good athletes from great ones through performance analysis.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Elite athletic performance is the result of countless factors working in perfect harmony. From biomechanics to psychology, nutrition to recovery, every element plays a crucial role in determining success at the highest levels of competition.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Modern sports science has given us unprecedented insight into what makes athletes tick. Advanced analytics, wearable technology, and video analysis tools allow coaches and players to optimize performance in ways that were unimaginable just a decade ago.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'But beyond the technology and data lies something more fundamental: the mindset and preparation that separates the good from the great. Mental resilience, strategic thinking, and the ability to perform under pressure remain as important as ever.',
                },
              ],
            },
          ],
        },
        tags: [breakdownTag.id],
        author: guestAuthor.id,
        featured: true,
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        title: 'Best Sports Equipment Deals This Season',
        description: 'Comprehensive guide to the best sports gear deals available right now.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Finding quality sports equipment at affordable prices can be challenging, but with the right knowledge and timing, significant savings are possible. This guide covers the best deals across major sports categories.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'From running shoes to basketball gear, tennis rackets to golf clubs, we\'ve scoured the market to find legitimate deals that offer real value. Our team verifies each deal to ensure quality and authenticity.',
                },
              ],
            },
          ],
        },
        tags: [dealsTag.id],
        author: staffAuthor.id,
        featured: false,
        publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      },
      {
        title: 'Beyond the Game: Athletes Making Social Impact',
        description: 'How modern athletes are using their platforms to drive positive social change.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Today\'s athletes are more than just competitors; they\'re advocates, entrepreneurs, and community leaders. The modern athlete understands the power of their platform and many are using it to address social issues and create positive change.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'From educational initiatives to environmental causes, healthcare access to social justice, athletes across all sports are stepping up to make a difference beyond their respective playing fields.',
                },
              ],
            },
          ],
        },
        tags: [beyondTag.id],
        author: guestAuthor.id,
        featured: false,
        publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      },
      {
        title: 'The Science of Sports Recovery: What Really Works',
        description: 'Evidence-based approaches to recovery that can improve athletic performance.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Recovery is where adaptation happens. While training provides the stimulus for improvement, it\'s during recovery that the body actually gets stronger, faster, and more resilient.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Modern recovery science has evolved far beyond simple rest and ice baths. From sleep optimization to nutrition timing, active recovery protocols to stress management, there are numerous evidence-based strategies that can accelerate recovery and enhance performance.',
                },
              ],
            },
          ],
        },
        tags: [breakdownTag.id, cultureTag.id],
        author: staffAuthor.id,
        featured: false,
        publishedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      },
      {
        title: 'Game-Changing Gear: Latest Sports Technology Innovations',
        description: 'Exploring the cutting-edge technology that\'s revolutionizing sports equipment.',
        body: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Technology continues to push the boundaries of what\'s possible in sports equipment. From smart fabrics that regulate temperature to AI-powered training tools, innovation is happening at every level.',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'These advancements aren\'t just for elite athletes anymore. Consumer-grade sports technology is becoming more accessible and affordable, allowing recreational athletes to benefit from professional-level insights and equipment.',
                },
              ],
            },
          ],
        },
        tags: [dealsTag.id, breakdownTag.id],
        author: guestAuthor.id,
        featured: false,
        publishedAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      },
    ];

    // Create posts
    for (const postData of posts) {
      await payload.create({
        collection: 'posts',
        data: postData,
      });
    }

    console.log('✅ Created sample posts');
    console.log('🎉 Seeding completed successfully!');
    console.log('\n📧 Admin credentials:');
    console.log('Email: admin@triplezerosports.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }

  process.exit(0);
};

seed();

