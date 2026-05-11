import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getSession();
  if (session) {
    redirect(`/dashboard/${session.role}`);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MyTutor</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#subjects" className="hover:text-indigo-600 transition-colors">Subjects</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link
              href="/register"
              className="btn btn-primary text-sm px-4 py-2 rounded-lg"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Online Education Platform — Uganda & Beyond
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Connect with Expert{" "}
              <span className="text-indigo-600">Tutors</span>{" "}
              & Unlock Your Potential
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              MyTutor links students with qualified teachers for personalized, one-on-one or
              group learning sessions. All subjects. All levels. Any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register?role=student"
                className="btn btn-primary px-8 py-3 text-base rounded-xl"
              >
                Find a Tutor Now →
              </Link>
              <Link
                href="/register?role=tutor"
                className="btn btn-secondary px-8 py-3 text-base rounded-xl"
              >
                Become a Tutor
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">Free to join. No credit card required.</p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { value: "500+", label: "Qualified Tutors" },
              { value: "5,000+", label: "Active Students" },
              { value: "20+", label: "Subjects Covered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How MyTutor Works</h2>
            <p className="text-gray-500 text-lg">Get learning in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Sign up as a student or tutor. Tell us your subject interests and learning goals.",
                color: "bg-indigo-100 text-indigo-700",
              },
              {
                step: "02",
                title: "Find the Right Tutor",
                desc: "Browse verified tutors by subject, price, and availability. Read reviews and profiles.",
                color: "bg-purple-100 text-purple-700",
              },
              {
                step: "03",
                title: "Book & Start Learning",
                desc: "Book a session, connect via Zoom or in-person, and track your progress over time.",
                color: "bg-blue-100 text-blue-700",
              },
            ].map((item) => (
              <div key={item.step} className="card text-center">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mx-auto mb-4 font-bold`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg">Built for students, tutors, and administrators</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "👨‍🏫", title: "Verified Tutors", desc: "All tutors are reviewed and verified by our admin team before going live." },
              { icon: "📅", title: "Easy Scheduling", desc: "Book sessions at your convenience. Zoom links generated automatically." },
              { icon: "💳", title: "Flexible Payments", desc: "Pay via Mobile Money, Visa, Mastercard, or PayPal. Monthly, weekly, or per-session." },
              { icon: "📊", title: "Progress Tracking", desc: "Students and tutors can track learning progress with detailed dashboards." },
              { icon: "💬", title: "Direct Messaging", desc: "Chat directly with your tutor or student before and after sessions." },
              { icon: "📱", title: "All Devices", desc: "Works seamlessly on phone, tablet, and computer. Native-feeling web app." },
            ].map((f) => (
              <div key={f.title} className="card hover:border-indigo-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-20 bg-indigo-600 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subjects We Cover</h2>
          <p className="text-indigo-200 text-lg mb-10">Primary, Secondary, University & Professional</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Mathematics","Physics","Chemistry","Biology","English","Kiswahili",
              "History","Geography","Computer Science","Economics","Business Studies",
              "French","Music","Art","Physical Education","Literature"
            ].map((s) => (
              <span key={s} className="bg-white/10 text-white border border-white/20 text-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=student" className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-base rounded-xl font-semibold">
              Start Learning Today
            </Link>
            <Link href="/register?role=tutor" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-base rounded-xl font-semibold">
              Teach on MyTutor
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Role Cards */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Three Portals, One Platform</h2>
            <p className="text-gray-500">Each user type gets their own dedicated dashboard</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: "Student",
                color: "border-green-200 bg-green-50",
                icon: "🎓",
                iconBg: "bg-green-100",
                features: ["Browse & book tutors", "Track session progress", "Manage enrollments", "Direct tutor messaging"],
                cta: "Join as Student",
                ctaColor: "bg-green-600 text-white hover:bg-green-700",
                href: "/register?role=student",
              },
              {
                role: "Tutor",
                color: "border-blue-200 bg-blue-50",
                icon: "👨‍🏫",
                iconBg: "bg-blue-100",
                features: ["Create & manage sessions", "View enrolled students", "Set your own pricing", "Get verified badge"],
                cta: "Join as Tutor",
                ctaColor: "bg-blue-600 text-white hover:bg-blue-700",
                href: "/register?role=tutor",
              },
              {
                role: "Admin",
                color: "border-purple-200 bg-purple-50",
                icon: "⚙️",
                iconBg: "bg-purple-100",
                features: ["Full user management", "Verify tutors", "Platform analytics", "Manage all sessions"],
                cta: "Admin Portal",
                ctaColor: "bg-purple-600 text-white hover:bg-purple-700",
                href: "/login",
              },
            ].map((r) => (
              <div key={r.role} className={`card border-2 ${r.color}`}>
                <div className={`w-12 h-12 ${r.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {r.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{r.role} Portal</h3>
                <ul className="space-y-2 mb-6">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={r.href} className={`btn w-full justify-center ${r.ctaColor} rounded-lg`}>
                  {r.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MT</span>
                </div>
                <span className="text-white font-bold text-lg">MyTutor</span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                Connecting students with expert tutors across Uganda and beyond.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Platform</div>
                <ul className="space-y-2">
                  <li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li>
                  <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
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
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 MyTutor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
