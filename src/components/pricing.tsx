import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen" id="pricing">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container space-y-8 text-center">
          <Badge variant="secondary">Pricing</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the perfect plan for your business needs
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={plan.featured ? "border-primary" : ""}>
              {plan.featured && (
                <div className="absolute top-0 right-0 -translate-y-1/2">
                  <Badge variant="default">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{plan.description}</p>
                <Button className="w-full" variant={plan.featured ? "default" : "outline"}>
                  Get Started
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our pricing and products
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-2">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground">
            Join thousands of businesses already using our platform
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="outline">Contact Sales</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const pricingPlans = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 1,000 mentions/month",
      "Basic sentiment analysis",
      "3 social channels",
      "Email support",
      "Basic reporting",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "99",
    description: "Ideal for growing businesses needing more insights",
    features: [
      "Up to 5,000 mentions/month",
      "Advanced sentiment analysis",
      "Unlimited social channels",
      "Priority support",
      "Advanced reporting",
      "Competitor tracking",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "249",
    description: "For large organizations requiring full capabilities",
    features: [
      "Unlimited mentions",
      "Custom AI models",
      "API access",
      "24/7 support",
      "Custom reporting",
      "Multi-user access",
      "Data retention",
    ],
    featured: false,
  },
]

const faqs = [
  {
    question: "How does the pricing work?",
    answer: "Our pricing is based on monthly mentions and features. You can upgrade or downgrade at any time.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "We'll notify you when you're close to your limit. You can upgrade your plan or purchase additional mentions.",
  },
  {
    question: "Can I change plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "Do you offer custom plans?",
    answer: "Yes, we offer custom enterprise plans for organizations with specific needs. Contact our sales team.",
  },
] 