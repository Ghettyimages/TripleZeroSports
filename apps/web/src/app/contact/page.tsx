import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the TripleZeroSports team.',
};

export default function ContactPage() {
  return (
    <div className="container py-8 lg:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
          Contact Us
        </h1>

        <div className="space-y-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you! Whether you have a story tip, feedback, or just want to connect, 
              don't hesitate to reach out.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-semibold">General Inquiries</h2>
              <p className="text-muted-foreground mb-4">
                For general questions, partnership opportunities, or media inquiries.
              </p>
              <p className="font-medium">
                Email: <a href="mailto:hello@triplezerosports.com" className="text-primary hover:underline">
                  hello@triplezerosports.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Editorial</h2>
              <p className="text-muted-foreground mb-4">
                Have a story tip or want to contribute content?
              </p>
              <p className="font-medium">
                Email: <a href="mailto:editorial@triplezerosports.com" className="text-primary hover:underline">
                  editorial@triplezerosports.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Technical Support</h2>
              <p className="text-muted-foreground mb-4">
                Experiencing issues with the website? Let us know.
              </p>
              <p className="font-medium">
                Email: <a href="mailto:support@triplezerosports.com" className="text-primary hover:underline">
                  support@triplezerosports.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Social Media</h2>
              <p className="text-muted-foreground mb-4">
                Connect with us on social media for the latest updates.
              </p>
              <div className="space-y-2">
                {siteConfig.social.x && (
                  <p>
                    <a
                      href={`https://x.com/${siteConfig.social.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @{siteConfig.social.x} on X
                    </a>
                  </p>
                )}
                {siteConfig.social.instagram && (
                  <p>
                    <a
                      href={`https://instagram.com/${siteConfig.social.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @{siteConfig.social.instagram} on Instagram
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-6">
            <h3 className="mb-2 text-lg font-semibold">Response Time</h3>
            <p className="text-muted-foreground">
              We typically respond to emails within 24-48 hours during business days. 
              For urgent matters, please indicate "URGENT" in your subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

