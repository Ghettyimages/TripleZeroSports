import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about TripleZeroSports and our mission to deliver the best sports content.',
};

export default function AboutPage() {
  return (
    <div className="container py-8 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
          About TripleZeroSports
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            Welcome to TripleZeroSports, your ultimate destination for sports news, analysis, and culture.
          </p>

          <h2>Our Mission</h2>
          <p>
            At TripleZeroSports, we're passionate about delivering comprehensive sports coverage that goes beyond the game. 
            We believe in the power of sports to unite communities, inspire individuals, and create lasting cultural impact.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li><strong>Culture:</strong> Exploring the cultural significance of sports in society</li>
            <li><strong>Breakdown:</strong> In-depth analysis and tactical breakdowns</li>
            <li><strong>Deals:</strong> The best sports equipment and merchandise deals</li>
            <li><strong>Beyond:</strong> Stories that extend beyond the playing field</li>
          </ul>

          <h2>Our Team</h2>
          <p>
            Our team consists of passionate sports journalists, analysts, and enthusiasts who bring years of experience 
            and diverse perspectives to our content. We're committed to providing accurate, engaging, and insightful 
            coverage across all major sports.
          </p>

          <h2>Contact Us</h2>
          <p>
            Have a story tip, feedback, or just want to say hello? We'd love to hear from you. 
            Reach out to us through our <a href="/contact">contact page</a> or connect with us on social media.
          </p>

          <div className="mt-8 flex space-x-4">
            {siteConfig.social.x && (
              <a
                href={`https://x.com/${siteConfig.social.x}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                Follow us on X
              </a>
            )}
            {siteConfig.social.instagram && (
              <a
                href={`https://instagram.com/${siteConfig.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                Follow us on Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

