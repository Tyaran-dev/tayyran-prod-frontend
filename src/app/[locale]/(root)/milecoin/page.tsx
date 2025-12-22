"use client";
import { useTranslations } from 'next-intl';
import Section from "@/app/components/shared/section";
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  MapPin,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Smartphone,
  BarChart3,
  Wallet,
  Car,
  Bike,
  Footprints,
} from "lucide-react";

// Custom Tailwind Components
function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none";
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    secondary: "bg-white text-blue-600 hover:bg-gray-100",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-gray-600 text-sm ${className}`}>{children}</p>;
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${className}`}>
      {children}
    </span>
  );
}

export default function MileCoinPage() {
  const t = useTranslations('MileCoinPage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            {t('hero.badge')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.headline')}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
              {t('hero.tagline')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group">
              {t('hero.ctaPrimary')}
              <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </section>

      {/* What is MileCoin Section */}
      <Section>
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('whatIsMileCoin.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('whatIsMileCoin.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Coins className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{t('whatIsMileCoin.points.bookings')}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>{t('whatIsMileCoin.points.interaction')}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>{t('whatIsMileCoin.points.loyalty')}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('whatIsMileCoin.howItWorks')}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('whatIsMileCoin.howPoints.booking')}
                    </h4>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('whatIsMileCoin.howPoints.interaction')}
                    </h4>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('whatIsMileCoin.howPoints.usage')}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {t('whatIsMileCoin.usage.discounts')}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Car className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {t('whatIsMileCoin.usage.bookings')}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {t('whatIsMileCoin.usage.upgrades')}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {t('whatIsMileCoin.usage.offers')}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-xl border-l-4 border-blue-500">
                <p className="text-lg font-semibold text-gray-900">
                  {t('whatIsMileCoin.value')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Membership Benefits */}
      <Section>
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('membership.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('membership.features')}
                </h3>
                <div className="space-y-4">
                  {Object.values(t.raw('membership.benefits')).map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('membership.levels')}
                </h3>
                <div className="space-y-4">
                  {Object.values(t.raw('membership.tiers')).map((tier: any, index) => (
                    <Card key={index} className="border-l-4 border-blue-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{tier.name}</CardTitle>
                          <Badge className={`
                            ${index === 0 ? 'bg-gray-100 text-gray-800' : ''}
                            ${index === 1 ? 'bg-gray-200 text-gray-800' : ''}
                            ${index === 2 ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${index === 3 ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white' : ''}
                          `}>
                            {tier.name}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">{tier.features}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Sales Plan Section */}
      <Section>
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('salesPlan.title')}
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{t('salesPlan.model')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {Object.values(t.raw('salesPlan.points')).map((point, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>{t('salesPlan.whyBuy')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {Object.values(t.raw('salesPlan.reasons')).map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                        </div>
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>{t('salesPlan.strengths')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {Object.values(t.raw('salesPlan.strengthsList')).map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-purple-600 rounded-full" />
                        </div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Marketing Strategy */}
      {/* <Section>
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('marketing.title')}
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{t('marketing.target')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.values(t.raw('marketing.audience')).map((audience, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-gray-800">{audience}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>{t('marketing.channels')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(t.raw('marketing.channelsList')).map(([key, channel]) => (
                        <div key={key} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <Smartphone className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-gray-800">{channel}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {t.raw('marketing.channelsList.partnerships')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(t.raw('marketing.partners')).map((partner, index) => (
                          <Badge key={index} className="bg-gray-100 text-gray-800">
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t('marketing.messages')}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(t.raw('marketing.messagesList')).map((message, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">"{message}"</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section> */}

      {/* Branding & Differentiators */}
      <Section>
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t('branding.title')}
                </h2>
                
                <div className="mb-8">
                  {/* <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('branding.taglines')}
                  </h3> */}
                  <div className="space-y-3">
                    {Object.values(t.raw('branding.taglinesList')).map((tagline, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-800 font-medium">{tagline}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('branding.description')}
                  </h4>
                  <p className="text-gray-700 italic">
                    "{t('branding.fullDescription')}"
                  </p>
                </div> */}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {t('differentiator.title')}
                </h2>
                
                <div className="space-y-6">
                  {Object.values(t.raw('differentiator.points')).map((point, index) => (
                    <Card key={index} className="border-l-4 border-purple-500">
                      <CardHeader>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {index === 0 && <Globe className="h-5 w-5 text-purple-600" />}
                            {index === 1 && <Coins className="h-5 w-5 text-purple-600" />}
                            {index === 2 && <Zap className="h-5 w-5 text-purple-600" />}
                            {index === 3 && <Smartphone className="h-5 w-5 text-purple-600" />}
                            {index === 4 && <TrendingUp className="h-5 w-5 text-purple-600" />}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{point}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="group">
              {t('cta.ios')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              {t('cta.android')}
            </Button>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            {t('cta.note')}
          </p>
        </div>
      </section> */}
    </div>
  );
}