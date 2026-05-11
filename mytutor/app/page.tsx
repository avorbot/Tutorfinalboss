import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import {
  ChalkboardTeacher, CalendarBlank, CreditCard, ChartBar,
  ChatCircle, DeviceMobile, GraduationCap, Gear, CheckCircle,
  Star, Users, Rocket,
} from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "MyTutor — Expert Tutors for Every Level",
};

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect(`/dashboard/${session.role}`);

  const features = [
    { Icon: ChalkboardTeacher, title: "Verified Tutors",      desc: "All tutors are reviewed and approved by our admin team before going live." },
    { Icon: CalendarBlank,     title: "Easy Scheduling",       desc: "Book sessions at your convenience. Confirmation sent instantly." },
    { Icon: CreditCard,        title: "Flexible Payments",     desc: "Pay via Mobile Money, Stripe, PayPal, or Amazon Pay. Per-session or monthly." },
    { Icon: ChartBar,          title: "Progress Tracking",     desc: "Detailed dashboards so students and tutors can track learning milestones." },
    { Icon: ChatCircle,        title: "Direct Messaging",      desc: "Chat with your tutor or student before and after every session." },
    { Icon: DeviceMobile,      title: "All Devices",           desc: "Seamless experience on phone, tablet, and computer. No app download needed." },
  ];

  const subjects = [
    "Mathematics","Physics","Chemistry","Biology","English","Kiswahili",
    "History","Geography","Computer Science","Economics","Business Studies",
    "French","Music","Art","Physical Education","Literature",
  ];

  const roles = [
    {
      label: "Student", Icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-600",
      features: ["Browse & book tutors","Track session progress","Manage enrollments","Access approved content"],
      cta: "Join as Student", href: "/register?role=student",
    },
    {
      label: "Tutor", Icon: ChalkboardTeacher,
      gradient: "from-blue-500 to-cyan-600",
      features: ["Create & manage sessions","Set your own pricing","View enrolled students","Get verified badge"],
      cta: "Join as Tutor", href: "/register?role=tutor",
    },
    {
      label: "Admin", Icon: Gear,
      gradient: "from-purple-500 to-indigo-600",
      features: ["Full user management","Approve/reject content","Platform analytics","Manage all sessions"],
      cta: "Admin Portal", href: "/login",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "var(--neon-blue)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "var(--neon-green)" }} />

        <div className="max-w-6xl mx-auto text-center relative">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(59,130,246,0.1)", color: "var(--neon-blue)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-blue)" }} />
              Online Education Platform — Uganda & Beyond
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 text-[var(--text-primary)]">
              Connect with Expert{" "}
              <span className="gradient-text">Tutors</span>{" "}
              &amp; Unlock Your Potential
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-xl text-[var(--text-muted)] mb-10 leading-relaxed max-w-2xl mx-auto">
              MyTutor links students with qualified teachers for personalized, one-on-one or
              group learning sessions. All subjects. All levels. Any device.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=student" className="btn btn-neon text-base">
                Find a Tutor Now →
              </Link>
              <Link href="/register?role=tutor" className="btn btn-secondary text-base px-8 py-3 rounded-full">
                Become a Tutor
              </Link>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">Free to join. No credit card required.</p>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={0.4}>
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { value: "500+", label: "Verified Tutors", icon: Users },
                { value: "5,000+", label: "Active Students", icon: GraduationCap },
                { value: "20+", label: "Subjects Covered", icon: Star },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">{value}</div>
                  <div className="flex items-center justify-center gap-1 text-sm text-[var(--text-muted)] mt-1">
                    <Icon size={14} />
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">How MyTutor Works</h2>
            <p className="text-[var(--text-muted)] text-lg">Get learning in 3 simple steps</p>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Account", desc: "Sign up as a student or tutor. Tell us your subject interests and learning goals.", color: "from-blue-500 to-indigo-600" },
              { step: "02", title: "Find the Right Tutor", desc: "Browse verified tutors by subject, price, and availability. Read reviews and profiles.", color: "from-purple-500 to-pink-600" },
              { step: "03", title: "Book & Start Learning", desc: "Book a session, connect via Zoom or in-person, and track your progress over time.", color: "from-emerald-500 to-teal-600" },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="card-neon text-center h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 font-bold text-white text-lg shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4 sm:px-6" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">Everything You Need</h2>
            <p className="text-[var(--text-muted)] text-lg">Built for students, tutors, and administrators</p>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="card-neon h-full">
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.1)", color: "var(--neon-blue)" }}>
                    <Icon size={24} weight="duotone" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Subjects ── */}
      <section id="subjects" className="py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #065f46 100%)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #10b981 0%, transparent 50%)" }} />
        <div className="max-w-6xl mx-auto text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Subjects We Cover</h2>
            <p className="text-blue-200 text-lg mb-10">Primary, Secondary, University &amp; Professional</p>
          </ScrollReveal>
          <StaggerContainer className="flex flex-wrap gap-3 justify-center">
            {subjects.map((s, i) => (
              <StaggerItem key={s}>
                <span className="bg-white/10 text-white border border-white/20 text-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all cursor-pointer hover:scale-105 inline-block">
                  {s}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <ScrollReveal delay={0.3} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=student" className="btn bg-white text-blue-800 hover:bg-blue-50 px-8 py-3 text-base rounded-full font-bold">
              Start Learning Today
            </Link>
            <Link href="/register?role=tutor" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-base rounded-full font-bold">
              Teach on MyTutor
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Kids CTA ── */}
      <ScrollReveal>
        <section className="py-16 px-4 sm:px-6" style={{ background: "var(--bg-secondary)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="card-neon text-center p-10 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0f0a2e, #0a1628)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{ background: "#8b5cf6" }} />
              <div className="relative">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-3xl font-bold text-white mb-3">Kids Under 9? We Have a Special Place!</h2>
                <p className="text-blue-200 text-lg mb-6 max-w-lg mx-auto">
                  Our gamified 3D Kids Zone makes learning feel like an adventure. Created by parents, loved by children.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/kids" className="btn btn-neon">
                    <Rocket size={20} weight="fill" /> Explore Kids Zone
                  </Link>
                  <Link href="/parent/register" className="btn border-2 border-purple-400 text-purple-300 hover:bg-purple-900/20 rounded-full px-8 py-3">
                    I&apos;m a Parent →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Three Portals ── */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">Three Portals, One Platform</h2>
            <p className="text-[var(--text-muted)]">Each user type gets their own dedicated dashboard</p>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {roles.map(({ label, Icon, gradient, features: feats, cta, href }) => (
              <StaggerItem key={label}>
                <div className="card-neon h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon size={28} weight="fill" className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{label} Portal</h3>
                  <ul className="space-y-2 mb-6 flex-1">
                    {feats.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <CheckCircle size={16} weight="fill" className="text-[var(--neon-green)] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={href} className={`btn w-full justify-center bg-gradient-to-r ${gradient} text-white rounded-xl py-2.5`}>
                    {cta}
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-4 sm:px-6" style={{ background: "#050814", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--gradient-accent)" }}>
                  <GraduationCap size={18} weight="bold" className="text-white" />
                </div>
                <span className="text-white font-bold text-lg">MyTutor</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Connecting students with expert tutors across Uganda and beyond.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm text-gray-500">
              <div>
                <div className="text-white font-semibold mb-3">Platform</div>
                <ul className="space-y-2">
                  <li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li>
                  <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                  <li><Link href="/kids" className="hover:text-white transition-colors">Kids Zone</Link></li>
                </ul>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Contact</div>
                <ul className="space-y-2">
                  <li>hello@mytutor.app</li>
                  <li>Kampala, Uganda</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-sm text-gray-600" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            © 2026 MyTutor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
