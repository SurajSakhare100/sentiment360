import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BarChart2, 
  Brain, 
  TrendingUp, 
  MessageCircle, 
  Target, 
  ChartPie,
  Globe,
  Search,
  LineChart,
  Bell,
  Users,
  Zap,
  Shield,
  RefreshCcw,
  Share2
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container space-y-8 text-center">
          <Badge variant="secondary">Features</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything You Need for Customer Insights
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive tools to analyze, track, and understand customer sentiment in real-time
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="container pt-20 pb-10">
        <div className="grid gap-8 md:grid-cols-3">
          {coreFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 space-y-4">
                <div className="p-3 w-fit rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className=" py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Advanced Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools for deeper insights and analysis
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {advancedFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 w-fit rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {feature.capabilities.map((capability) => (
                      <li key={capability} className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-primary" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  )
}

const coreFeatures = [
  {
    title: "Real-Time Analytics",
    description: "Monitor customer sentiment and feedback as it happens with instant updates and alerts.",
    icon: <Bell className="w-6 h-6 text-primary" />,
  },
  {
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms for accurate sentiment classification and trend detection.",
    icon: <Brain className="w-6 h-6 text-primary" />,
  },
  {
    title: "Competitive Intelligence",
    description: "Track and compare your performance against competitors in real-time.",
    icon: <Target className="w-6 h-6 text-primary" />,
  },
]

const advancedFeatures = [
  {
    title: "Sentiment Analysis",
    description: "Deep dive into customer emotions and opinions",
    icon: <ChartPie className="w-6 h-6 text-primary" />,
    capabilities: [
      "Multi-language support",
      "Emotion detection",
      "Context awareness",
      "Custom classification models",
    ],
  },
  {
    title: "Trend Detection",
    description: "Stay ahead of market trends and customer preferences",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    capabilities: [
      "Automated trend detection",
      "Historical analysis",
      "Predictive insights",
      "Custom alerts",
    ],
  },
]

const integrations = [
  {
    name: "Slack",
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
  },
  {
    name: "Salesforce",
    icon: <Share2 className="w-8 h-8 text-primary" />,
  },
  {
    name: "Zendesk",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    name: "HubSpot",
    icon: <Globe className="w-8 h-8 text-primary" />,
  },
]

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
) 