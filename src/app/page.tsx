import { IMAGES } from "@/lib/constants"
import { 
  TrendingUp, 
  BarChart2, 
  Search,
  MessageCircle,
  LineChart,
  ArrowUpDown,
  Target,
  Clock,
  Users
} from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dashboard from "../../public/images/image.png"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import FeaturesPage from "@/components/features"
import PricingPage from "@/components/pricing"
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Nav/>

      {/* Hero Section with Real-time Focus */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container flex flex-col lg:flex-row items-center gap-12">
          <div className="flex flex-col space-y-8 lg:w-1/2">
            <Badge className="w-fit" variant="secondary">
              Real-Time Customer Insights
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
              Track Customer Sentiment
              <span className="text-primary"> in Real-Time</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Instantly analyze customer feedback, compare with competitors, and make data-driven decisions with our AI-powered sentiment analysis platform.
            </p>
            {/* ... existing CTA buttons ... */}
          </div>
          <div className="lg:w-1/2">
            <Image
              src={dashboard}
              alt="Sentiment Analysis Dashboard"
              width={800}
              height={600}
              className="rounded-2xl shadow-2xl scale-110"
            />
          </div>
        </div>
      </section>
      <FeaturesPage/>
      
      <section className="bg-muted py-24">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Competitive Analysis</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare your performance against competitors in real-time
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comparisonFeatures.map((feature) => (
              <Card key={feature.title} className="p-6">
                <CardContent className="space-y-4">
                  <div className="p-3 w-fit rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PricingPage/>
      

      <Footer/>
    </div>
  )
}

const features = [
  {
    title: "Real-Time Monitoring",
    description: "Track customer sentiment as it happens with instant feedback analysis and alerts.",
    icon: <Clock className="w-6 h-6 text-primary" />,
  },
  {
    title: "Trend Analysis",
    description: "Identify emerging patterns and sentiment shifts in customer feedback.",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
  },
  {
    title: "Competitor Insights",
    description: "Compare your performance against competitors across multiple metrics.",
    icon: <ArrowUpDown className="w-6 h-6 text-primary" />,
  },
]

const comparisonFeatures = [
  {
    title: "Sentiment Benchmarking",
    description: "Compare your customer sentiment scores against industry averages and competitors.",
    icon: <BarChart2 className="w-6 h-6 text-primary" />,
  },
  {
    title: "Market Position Analysis",
    description: "Track your market position and identify opportunities for improvement.",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
  {
    title: "Customer Feedback Trends",
    description: "Monitor how customer sentiment evolves over time compared to competitors.",
    icon: <LineChart className="w-6 h-6 text-primary" />,
  },
  {
    title: "Audience Insights",
    description: "Understand your customer demographics and how they compare to competitor audiences.",
    icon: <Users className="w-6 h-6 text-primary" />,
  },
]

// Add a new section for real-time metrics
const metrics = [
  {
    title: "Sentiment Score",
    value: "92%",
    description: "Positive customer feedback",
  },
  {
    title: "Response Time",
    value: "< 5min",
    description: "Average analysis time",
  },
  {
    title: "Competitors Tracked",
    value: "25+",
    description: "Industry benchmarks",
  },
]