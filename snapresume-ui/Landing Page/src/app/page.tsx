import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, FileCheck, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient animate-gradient"></div>
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-4 z-50 mx-4 border border-white/20 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/20 rounded-3xl shadow-lg">
          <div className="container mx-auto flex h-16 items-center px-4">
            <div className="flex flex-1 items-center justify-between">
              <a className="flex items-center space-x-2" href="/">
                <span className="font-bold text-xl ml-4 sm:ml-16 text-white">SnapResume</span>
              </a>
              <div className="flex items-center gap-4 sm:gap-8 mr-4 sm:mr-16">
                <div className="hidden md:flex items-center gap-6">
                  <a className="text-sm font-medium transition-colors hover:text-gray-300" href="/portfolio">
                    Portfolio
                  </a>
                  <a className="text-sm font-medium transition-colors hover:text-gray-300" href="/resume">
                    Resume
                  </a>
                  <a className="text-sm font-medium transition-colors hover:text-gray-300" href="/cover-letter">
                    Cover Letter
                  </a>
                </div>
                <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="rounded-full px-4 py-1 text-sm font-medium bg-white/20 text-white hover:bg-white/30"
              >
                Trusted by 50,000+ professionals
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Build Your Perfect Resume
                <br />
                in 5 Minutes
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl mt-4">
                Designed for FAANG interviews. ATS-optimized. LaTeX-ready.
                <br />
                Professional templates trusted by Meta, Google, Microsoft recruiters.
              </p>
            </div>
            <div className="space-x-4 pt-4">
              <Button
                size="lg"
                className="h-12 px-8 shadow-lg transition-all hover:scale-105 bg-white text-black hover:bg-gray-200"
                asChild
              >
                <a href="#templates">
                  Build Your Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 shadow-sm transition-all hover:scale-105 bg-transparent border-white text-white hover:bg-white/20"
                asChild
              >
                <a href="#templates">View Templates</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="templates" className="container px-4 md:px-6 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {templates.map((template, idx) => (
              <Link href={template.href} key={idx}>
                <div className="group relative overflow-hidden transition-all hover:shadow-lg rounded-xl">
                  <Card className="bg-black/40 border-white/20 backdrop-blur">
                    <CardContent className="p-0">
                      {template.badge && (
                        <div className="absolute right-4 top-4 z-10">
                          <Badge className="bg-white text-black hover:bg-gray-200">
                            {template.badge}
                          </Badge>
                        </div>
                      )}
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={template.image}
                          alt={template.alt}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white">{template.title}</h3>
                        <p className="text-sm text-gray-300">{template.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* More Sections */}
        {/* Reduce redundant component code */}
        {sections.map((section, idx) => (
          <section
            key={idx}
            className="container px-4 md:px-6 py-12 lg:py-24 border-t border-white/20"
          >
            <div className={section.wrapperClasses}>
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className={item.classes}>
                  {item.icon && <item.icon className={item.iconClasses} />}
                  <h3 className={item.titleClasses}>{item.title}</h3>
                  <p className={item.textClasses}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// Reusable Data for Features, Templates, and Sections
const templates = [
  {
    href: "/Forms/harvard.html",
    image: "/harvard.png?height=600&width=480",
    alt: "Harvard Resume Template",
    title: "Harvard Resume",
    description: "Clean and professional Harvard-style template",
  },
  {
    href: "/Forms/faang.html",
    image: "/FAANG.png?height=600&width=480",
    alt: "FAANG Template",
    title: "FAANG Template",
    description: "Most widely used among FAANG professionals",
    badge: "Highly Recommended",
  },
  {
    href: "/Forms/faang.html",
    image: "/FAANG2.png?height=600&width=480",
    alt: "MMANGA Template",
    title: "MMANGA Template",
    description: "Modern design for creative professionals",
  },
];

const sections = [
  {
    wrapperClasses: "grid gap-8 lg:grid-cols-3 lg:gap-12",
    items: [
      {
        classes:
          "group flex flex-col items-center space-y-4 text-center transition-all hover:scale-105 bg-black/40 backdrop-blur p-6 rounded-xl border border-white/20",
        icon: Clock,
        iconClasses: "bg-white/20 p-3 rounded-full transition-colors group-hover:bg-white/30",
        title: "5-Minute Builder",
        titleClasses: "text-xl font-bold text-white",
        text: "Create a professional resume in minutes with our intuitive builder",
        textClasses: "text-gray-300",
      },
      {
        classes:
          "group flex flex-col items-center space-y-4 text-center transition-all hover:scale-105 bg-black/40 backdrop-blur p-6 rounded-xl border border-white/20",
        icon: FileCheck,
        iconClasses: "bg-white/20 p-3 rounded-full transition-colors group-hover:bg-white/30",
        title: "ATS-Optimized",
        titleClasses: "text-xl font-bold text-white",
        text: "Ensure your resume passes Applicant Tracking Systems every time",
        textClasses: "text-gray-300",
      },
      {
        classes:
          "group flex flex-col items-center space-y-4 text-center transition-all hover:scale-105 bg-black/40 backdrop-blur p-6 rounded-xl border border-white/20",
        icon: Star,
        iconClasses: "bg-white/20 p-3 rounded-full transition-colors group-hover:bg-white/30",
        title: "FAANG-Ready",
        titleClasses: "text-xl font-bold text-white",
        text: "Templates and formats preferred by top tech companies",
        textClasses: "text-gray-300",
      },
    ],
  },
];
