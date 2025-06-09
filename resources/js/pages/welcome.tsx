"use client"

import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"

export default function Welcome() {
  const { auth } = usePage<SharedData>().props
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const skills = [
    "Web Development",
    "Graphic Design",
    "Photography",
    "Music Production",
    "Writing",
    "Marketing",
    "Data Analysis",
    "Language Teaching",
    "Cooking",
    "Fitness Training",
    "Video Editing",
    "Public Speaking",
    "UX Design",
    "3D Modeling",
    "Animation",
    "Illustration",
  ]

  return (
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-black text-white antialiased">
        {/* Subtle background pattern */}
        <div className="fixed inset-0 z-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>

        {/* Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20">
                  <span className="text-sm font-medium">SS</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">SkillSwap</span>
              </div>

              <nav className="flex items-center gap-6">
                {auth.user ? (
                  <Link
                    href={route("home")}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href={route("login")}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Log in
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
            <div
              className={`mx-auto max-w-4xl space-y-10 text-center transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Exchange Skills, <br />
                  <span className="text-white/80">Expand Horizons</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-white/60 md:text-xl">
                  A sophisticated platform for professionals to exchange expertise, build meaningful connections, and
                  accelerate personal growth through collaborative skill sharing.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href={auth.user ? route("home") : route("login")}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  {auth.user ? "Access Dashboard" : "Start Swapping Skills"}
                </Link>
                <button className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-8 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black">
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* Skills Carousel */}
          <div className="relative w-full overflow-hidden border-y border-white/10 bg-white/5 py-6">
            <div className="animate-scroll flex gap-8 whitespace-nowrap">
              {[...skills, ...skills].map((skill, index) => (
                <div
                  key={index}
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How SkillSwap Works</h2>
                <p className="mx-auto max-w-[700px] text-white/60">
                  Our refined process ensures meaningful skill exchanges and professional growth
                </p>
              </div>

              <div className="grid gap-12 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Create Your Profile",
                    description:
                      "Craft a comprehensive profile showcasing your expertise, professional background, and the specific skills you're looking to exchange. Include your portfolio, certifications, and availability preferences.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    ),
                  },
                  {
                    step: "02",
                    title: "Find Perfect Matches",
                    description:
                      "Our sophisticated algorithm analyzes skill sets, experience levels, and learning objectives to connect you with ideal exchange partners. Filter by industry, expertise level, and specific competencies to find precise matches.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    ),
                  },
                  {
                    step: "03",
                    title: "Start Learning",
                    description:
                      "Schedule structured sessions through our integrated calendar system. Exchange knowledge through video conferencing, document sharing, and interactive whiteboards. Track progress and build lasting professional relationships.",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M18 6H5a2 2 0 0 0-2 2v3"></path>
                        <path d="M10 16H5a2 2 0 0 1-2-2v-3"></path>
                        <path d="M18 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5"></path>
                        <path d="m9 10 3-2"></path>
                        <path d="M12 8v8"></path>
                        <path d="m15 14-3 2"></path>
                      </svg>
                    ),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group relative rounded-lg border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:bg-white/[0.075]"
                    style={{
                      transform: `translateY(${scrollY * 0.03 * (index + 1)}px)`,
                    }}
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80">
                      {item.icon}
                    </div>
                    <div className="mb-2 text-sm font-medium text-white/60">{item.step}</div>
                    <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
                    <p className="text-white/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="border-t border-white/10 bg-white/[0.02] py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Platform Capabilities
                  </h2>
                  <p className="mx-auto max-w-[700px] text-white/60">
                    Designed with precision to facilitate seamless skill exchanges and professional development
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Global Network",
                      description:
                        "Access a diverse community of professionals from over 150 countries, spanning industries from technology to creative arts and beyond.",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                      ),
                    },
                    {
                      title: "Verified Credentials",
                      description:
                        "All members undergo a thorough verification process, including professional background checks and skill assessments to ensure quality exchanges.",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      ),
                    },
                    {
                      title: "Advanced Scheduling",
                      description:
                        "Integrated calendar system with timezone detection, availability preferences, and automated reminders to streamline session planning.",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5"></path>
                          <path d="M16 2v4"></path>
                          <path d="M8 2v4"></path>
                          <path d="M3 10h18"></path>
                          <path d="M18 16.5 15.5 14l2.5-2.5"></path>
                          <path d="M18.5 14h-4"></path>
                        </svg>
                      ),
                    },
                    {
                      title: "Secure Communication",
                      description:
                        "End-to-end encrypted messaging, video conferencing, and file sharing to protect your intellectual property and personal information.",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      ),
                    },
                    {
                      title: "Skill Analytics",
                      description:
                        "Comprehensive tracking of your learning journey with detailed analytics, progress indicators, and personalized improvement recommendations.",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M3 3v18h18"></path>
                          <path d="m19 9-5 5-4-4-3 3"></path>
                        </svg>
                      ),
                    },
                    {
                      title: "Tiered Membership",
                      description:
                        "Flexible membership options from free basic exchanges to premium tiers with advanced features, priority matching, and exclusive masterclasses.",
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M12 2v20"></path>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      ),
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.075]"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80">
                        {feature.icon}
                      </div>
                      <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Member Experiences</h2>
                <p className="mx-auto max-w-[700px] text-white/60">
                  Insights from professionals who have transformed their careers through skill exchange
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote:
                      "SkillSwap transformed my career trajectory. I exchanged my UX design expertise for advanced data visualization skills, which led to a promotion within three months.",
                    name: "Alexandra Chen",
                    title: "Senior UX Designer",
                    company: "TechVision Inc.",
                  },
                  {
                    quote:
                      "The structured approach to skill exchange on this platform is unparalleled. I've tried other networking sites, but none offer the same level of quality connections and measurable growth.",
                    name: "Marcus Johnson",
                    title: "Marketing Strategist",
                    company: "Global Reach Partners",
                  },
                  {
                    quote:
                      "As a freelance developer, SkillSwap has been invaluable for expanding my technical toolkit while teaching others. The verification system ensures every exchange is worthwhile.",
                    name: "Sophia Rodriguez",
                    title: "Full-Stack Developer",
                    company: "Independent Consultant",
                  },
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.075]"
                  >
                    <div className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-white/40"
                      >
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                      </svg>
                    </div>
                    <p className="mb-6 text-white/80">{testimonial.quote}</p>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-white/60">
                        {testimonial.title}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="border-t border-white/10 bg-white/[0.02] py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  {[
                    { number: "10K+", label: "Active Members" },
                    { number: "50K+", label: "Skills Exchanged" },
                    { number: "150+", label: "Countries" },
                    { number: "98%", label: "Satisfaction Rate" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-2 text-3xl font-bold md:text-4xl">{stat.number}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
                <p className="text-white/60">Everything you need to know about the SkillSwap platform</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "How does the skill matching algorithm work?",
                    answer:
                      "Our proprietary algorithm analyzes over 30 data points from your profile, including skill proficiency levels, learning objectives, industry experience, and communication preferences. It then identifies potential matches based on complementary skill sets, ensuring both parties benefit equally from the exchange.",
                  },
                  {
                    question: "Is there a cost to join SkillSwap?",
                    answer:
                      "SkillSwap offers a free tier that allows basic skill exchanges and limited profile features. Premium tiers start at $9.99/month and include advanced matching, unlimited exchanges, priority support, and access to exclusive masterclasses from industry experts.",
                  },
                  {
                    question: "How is the quality of exchanges maintained?",
                    answer:
                      "We implement a comprehensive verification system for all members, including professional background checks and skill assessments. Additionally, our peer review system after each exchange ensures accountability and maintains high standards across the platform.",
                  },
                  {
                    question: "Can I exchange skills across different industries?",
                    answer:
                      "Absolutely. Cross-industry exchanges are encouraged and often lead to the most innovative outcomes. Our platform specializes in identifying transferable skills and facilitating exchanges between professionals from diverse backgrounds.",
                  },
                  {
                    question: "What happens if a skill exchange doesn't meet expectations?",
                    answer:
                      "We have a structured resolution process managed by our support team. If an exchange doesn't meet the agreed standards, we offer mediation services and, if necessary, can arrange alternative exchanges or provide premium account credits.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.075]"
                  >
                    <h3 className="mb-3 text-lg font-medium">{faq.question}</h3>
                    <p className="text-white/60">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="border-t border-white/10 bg-white/[0.02] py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Ready to Transform Your Professional Journey?
                </h2>
                <p className="mb-10 text-white/60">
                  Join thousands of professionals who are expanding their skillsets and accelerating their careers
                  through collaborative learning.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href={auth.user ? route("home") : route("login")}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  >
                    {auth.user ? "Access Dashboard" : "Join SkillSwap"}
                  </Link>
                  <button className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-8 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black">
                    Schedule a Demo
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20">
                  <span className="text-sm font-medium">SS</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">SkillSwap</span>
              </div>

              <div className="flex gap-6">
                <a href="#" className="text-sm text-white/60 hover:text-white">
                  Terms
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-white">
                  Privacy
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-white">
                  Contact
                </a>
              </div>

              <div className="text-sm text-white/60">© 2024 SkillSwap. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
    </>
  )
}
