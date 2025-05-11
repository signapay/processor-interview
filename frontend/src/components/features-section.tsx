import { CreditCard, Shield, Clock, BarChart, Smartphone, Globe } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <CreditCard className="h-10 w-10 text-green-500" />,
      title: "Multiple Payment Methods",
      description: "Accept credit cards, debit cards, and digital wallets with ease.",
    },
    {
      icon: <Shield className="h-10 w-10 text-green-500" />,
      title: "Secure Transactions",
      description: "End-to-end encryption and fraud protection for all transactions.",
    },
    {
      icon: <Clock className="h-10 w-10 text-green-500" />,
      title: "Real-time Processing",
      description: "Instant transaction processing and settlement within 24 hours.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-green-500" />,
      title: "Detailed Analytics",
      description: "Comprehensive reporting and insights on your payment activity.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-green-500" />,
      title: "Mobile Optimized",
      description: "Seamless payment experience across all devices.",
    },
    {
      icon: <Globe className="h-10 w-10 text-green-500" />,
      title: "Global Support",
      description: "Process payments in multiple currencies from around the world.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features for Your Business
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our payment processing platform offers everything you need to manage transactions efficiently and
              securely.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800"
            >
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
