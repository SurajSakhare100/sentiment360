import Link from 'next/link'
import { LoginButton } from '@/components/auth/LoginButton'

export default function Home() {
  return (
    <div className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Sentiment360
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Get real-time insights into customer opinions from Reddit and Google Reviews.
                Make data-driven decisions with advanced sentiment analysis.
              </p>
            </div>
            <div className="space-x-4">
              <LoginButton />
              <Link
                href="/about"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
            <FeatureCard
              title="Real-time Analysis"
              description="Monitor customer sentiment across platforms in real-time"
            />
            <FeatureCard
              title="AI-Powered Insights"
              description="Advanced sentiment analysis using Hugging Face AI models"
            />
            <FeatureCard
              title="Competitive Edge"
              description="Compare your performance with competitors"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-xl font-semibold leading-none tracking-tight mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
