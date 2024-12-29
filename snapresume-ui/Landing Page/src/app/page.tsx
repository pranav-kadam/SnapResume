import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, FileCheck, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex flex-1 items-center justify-between">
            <a className="flex items-center space-x-2" href="/">
              <span className="font-bold text-xl ml-16">SnapResume</span>
            </a>
            <div className="flex items-center gap-8 mr-16">
              <div className="hidden md:flex items-center gap-6">
                <a 
                  className="text-sm font-medium transition-colors hover:text-primary" 
                  href="/portfolio"
                >
                  Portfolio
                </a>
                <a 
                  className="text-sm font-medium transition-colors hover:text-primary" 
                  href="/resume"
                >
                  Resume
                </a>
                <a 
                  className="text-sm font-medium transition-colors hover:text-primary" 
                  href="/cover-letter"
                >
                  Cover Letter
                </a>
              </div>
              <Button className="shadow-sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge 
              variant="secondary" 
              className="rounded-full px-4 py-1 text-sm font-medium transition-colors hover:bg-secondary/80"
            >
              Trusted by 50,000+ professionals
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              Build Your Perfect Resume
              <br />
              in 5 Minutes
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Designed for FAANG interviews. ATS-optimized. LaTeX-ready.
              <br />
              Professional templates trusted by Meta, Google, Microsoft recruiters.
            </p>
          </div>
          <div className="space-x-4 pt-4">
            <Button 
              size="lg" 
              className="h-12 px-8 shadow-lg transition-all hover:scale-105"
            >
              Build Your Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 shadow-sm transition-all hover:scale-105"
            >
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
         <section className="container px-4 md:px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/harvard.png?height=600&width=480"
                  alt="Harvard Resume Template"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Harvard Resume</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Clean and professional Harvard-style template
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="absolute right-4 top-4 z-10">
                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90">
                  Highly Recommended
                </Badge>
              </div>
              <div className="relative aspect-[4/5]">
                <Image
                  src="/FAANG.png?height=600&width=480"
                  alt="FAANG Template"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">FAANG Template</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Most widely used among FAANG professionals
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/FAANG2.png?height=600&width=480"
                  alt="MMANGA Template"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">MMANGA Template</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Modern design for creative professionals
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="container px-4 md:px-6 py-12 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="group flex flex-col items-center space-y-4 text-center transition-all hover:scale-105">
            <div className="bg-primary/10 p-3 rounded-full transition-colors group-hover:bg-primary/20">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">5-Minute Builder</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create a professional resume in minutes with our intuitive builder
            </p>
          </div>
          <div className="group flex flex-col items-center space-y-4 text-center transition-all hover:scale-105">
            <div className="bg-primary/10 p-3 rounded-full transition-colors group-hover:bg-primary/20">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">ATS-Optimized</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Ensure your resume passes Applicant Tracking Systems every time
            </p>
          </div>
          <div className="group flex flex-col items-center space-y-4 text-center transition-all hover:scale-105">
            <div className="bg-primary/10 p-3 rounded-full transition-colors group-hover:bg-primary/20">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">FAANG-Ready</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Templates and formats preferred by top tech companies
            </p>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
   

      {/* Stats Section */}
      <section className="container px-4 md:px-6 py-12 border-t">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="group flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105">
            <h3 className="text-3xl font-bold text-primary">50K+</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Happy Users</p>
          </div>
          <div className="group flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105">
            <h3 className="text-3xl font-bold text-primary">95%</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          </div>
          <div className="group flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105">
            <h3 className="text-3xl font-bold text-primary">24/7</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Support</p>
          </div>
          <div className="group flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105">
            <h3 className="text-3xl font-bold text-primary">100+</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Templates</p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="container px-4 md:px-6 py-12 border-t">
        <div className="flex flex-col items-center space-y-8">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            TRUSTED BY PROFESSIONALS FROM
          </p>
          <div className="flex flex-wrap justify-center gap-8 grayscale opacity-60 transition-opacity hover:opacity-100">
            <Image 
              src="/meta.png?height=40&width=120" 
              alt="Meta" 
              width={120} 
              height={40} 
              className="object-contain transition-transform hover:scale-105" 
            />
            <Image 
              src="/google.png?height=40&width=120" 
              alt="Google" 
              width={120} 
              height={40} 
              className="object-contain transition-transform hover:scale-105" 
            />
            <Image 
              src="/microsoft.avif?height=40&width=120" 
              alt="Microsoft" 
              width={120} 
              height={40} 
              className="object-contain transition-transform hover:scale-105" 
            />
            <Image 
              src="/amazon.png?height=40&width=120" 
              alt="Amazon" 
              width={120} 
              height={40} 
              className="object-contain transition-transform hover:scale-105" 
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
<section className="container px-4 md:px-6 py-12 md:py-24">
  <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
  <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
    <div>
      <h3 className="text-xl font-semibold mb-2">How does the 5-minute builder work?</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Our intuitive builder guides you through each section of your resume. With pre-written content suggestions and easy customization options, you can create a professional resume in just minutes.
      </p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">Are the templates really ATS-friendly?</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Yes, all our templates are designed to be ATS-friendly. They use proper formatting, standard fonts, and clear section headings to ensure your resume can be easily parsed by Applicant Tracking Systems.
      </p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">Can I use SnapResume for free?</h3>
      <p className="text-gray-500 dark:text-gray-400">
        We offer a free tier that allows you to create a basic resume. For access to premium templates, ATS optimization features, and unlimited downloads, check out our affordable subscription plans.
      </p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">How often can I update my resume?</h3>
      <p className="text-gray-500 dark:text-gray-400">
        You can update your resume as often as you like! We recommend keeping your resume up-to-date and tailoring it for each job application for the best results.
      </p>
    </div>
  </div>
</section>
    </div>
  )
}