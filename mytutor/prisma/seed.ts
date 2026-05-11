import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MyTutor demo data...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.tutorProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const hash = (p: string) => bcrypt.hash(p, 10);

  // ─── Admin ───────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@mytutor.app",
      password: await hash("demo1234"),
      role: "admin",
    },
  });

  // ─── Tutors ──────────────────────────────────────────────────────────────
  const tutorData = [
    {
      name: "Dr. Sarah Nalwoga",
      email: "tutor@mytutor.app",
      bio: "PhD Mathematics from Makerere University. 10+ years teaching O-Level and A-Level Mathematics. Specialised in calculus, statistics, and exam preparation. My students consistently improve by 2 grades.",
      subjects: "Mathematics, Physics",
      hourlyRate: 50000,
      currency: "UGX",
      experience: 10,
      education: "PhD Mathematics, Makerere University",
      verified: true,
      rating: 4.9,
      totalReviews: 47,
    },
    {
      name: "Mr. James Odhiambo",
      email: "james.tutor@mytutor.app",
      bio: "Former secondary school teacher with 8 years experience. Passionate about making science exciting and accessible. Available evenings and weekends.",
      subjects: "Chemistry, Biology",
      hourlyRate: 40000,
      currency: "UGX",
      experience: 8,
      education: "BSc Chemistry, University of Nairobi",
      verified: true,
      rating: 4.7,
      totalReviews: 31,
    },
    {
      name: "Ms. Grace Akello",
      email: "grace.tutor@mytutor.app",
      bio: "English and Literature specialist. I help students improve their writing, grammar, and comprehension. UACE exam preparation expert.",
      subjects: "English, Literature, French",
      hourlyRate: 35000,
      currency: "UGX",
      experience: 6,
      education: "BA English Literature, Kyambogo University",
      verified: true,
      rating: 4.8,
      totalReviews: 28,
    },
    {
      name: "Mr. Peter Mwangi",
      email: "peter.tutor@mytutor.app",
      bio: "Computer Science graduate from Strathmore University. Teach programming, web development, and ICT. Both beginner and advanced levels welcome.",
      subjects: "Computer Science, Mathematics",
      hourlyRate: 60000,
      currency: "UGX",
      experience: 5,
      education: "BSc Computer Science, Strathmore University",
      verified: false,
      rating: 4.5,
      totalReviews: 12,
    },
    {
      name: "Mrs. Fatuma Hassan",
      email: "fatuma.tutor@mytutor.app",
      bio: "Kiswahili and History expert. Native speaker, 12 years teaching experience. Excellent results with KCSE and UCE students.",
      subjects: "Kiswahili, History, Geography",
      hourlyRate: 30000,
      currency: "UGX",
      experience: 12,
      education: "BA Education, University of Dar es Salaam",
      verified: true,
      rating: 4.6,
      totalReviews: 39,
    },
  ];

  const tutors = [];
  for (const t of tutorData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        password: await hash("demo1234"),
        role: "tutor",
        tutorProfile: {
          create: {
            bio: t.bio,
            subjects: t.subjects,
            hourlyRate: t.hourlyRate,
            currency: t.currency,
            experience: t.experience,
            education: t.education,
            verified: t.verified,
            rating: t.rating,
            totalReviews: t.totalReviews,
          },
        },
      },
    });
    tutors.push(user);
  }

  // ─── Sessions ────────────────────────────────────────────────────────────
  const sessionsData = [
    {
      tutorIdx: 0,
      sessions: [
        { title: "O-Level Mathematics Intensive", subject: "Mathematics", description: "Comprehensive coverage of all UCE Mathematics topics. Focus on past paper practice and exam technique.", price: 50000, duration: 90, maxStudents: 1 },
        { title: "A-Level Pure Mathematics", subject: "Mathematics", description: "Advanced calculus, algebra, and statistics for UACE students. Small group sessions available.", price: 65000, duration: 90, maxStudents: 3, sessionType: "group" },
        { title: "Statistics & Probability", subject: "Mathematics", description: "Dedicated statistics module. Covers probability, data analysis, and hypothesis testing.", price: 55000, duration: 60, maxStudents: 1 },
      ],
    },
    {
      tutorIdx: 1,
      sessions: [
        { title: "O-Level Chemistry Mastery", subject: "Chemistry", description: "Complete UCE Chemistry syllabus. Includes practical skills and lab techniques.", price: 40000, duration: 60, maxStudents: 1 },
        { title: "Biology for Medicine Students", subject: "Biology", description: "Tailored for students pursuing medical sciences. Advanced A-Level Biology.", price: 45000, duration: 90, maxStudents: 2, sessionType: "group" },
      ],
    },
    {
      tutorIdx: 2,
      sessions: [
        { title: "English Comprehension & Writing", subject: "English", description: "Improve reading, comprehension, essay writing and grammar. UCE/UACE preparation.", price: 35000, duration: 60, maxStudents: 1 },
        { title: "Literature in English", subject: "Literature", description: "Set texts analysis, essay technique, and exam skills for Literature students.", price: 35000, duration: 60, maxStudents: 1 },
        { title: "Beginners French", subject: "French", description: "Introduction to French language for secondary school students.", price: 40000, duration: 60, maxStudents: 5, sessionType: "group" },
      ],
    },
    {
      tutorIdx: 3,
      sessions: [
        { title: "Introduction to Programming", subject: "Computer Science", description: "Learn Python from zero. Variables, loops, functions, and your first projects.", price: 60000, duration: 90, maxStudents: 1 },
        { title: "Web Development Basics", subject: "Computer Science", description: "HTML, CSS and JavaScript. Build your first website.", price: 60000, duration: 90, maxStudents: 1 },
      ],
    },
    {
      tutorIdx: 4,
      sessions: [
        { title: "Kiswahili for UCE", subject: "Kiswahili", description: "Comprehensive Kiswahili preparation for UCE examinations. Native speaker instruction.", price: 30000, duration: 60, maxStudents: 1 },
        { title: "East African History", subject: "History", description: "UCE and UACE History. Pre-colonial, colonial and post-colonial Africa.", price: 30000, duration: 60, maxStudents: 4, sessionType: "group" },
      ],
    },
  ];

  const createdSessions = [];
  for (const tutorSessions of sessionsData) {
    for (const s of tutorSessions.sessions) {
      const session = await prisma.session.create({
        data: {
          tutorId: tutors[tutorSessions.tutorIdx].id,
          title: s.title,
          subject: s.subject,
          description: s.description,
          price: s.price,
          currency: "UGX",
          duration: s.duration,
          maxStudents: s.maxStudents,
          sessionType: (s as { sessionType?: string }).sessionType || "one-on-one",
          status: "active",
        },
      });
      createdSessions.push(session);
    }
  }

  // ─── Students ────────────────────────────────────────────────────────────
  const studentData = [
    { name: "Alice Nakato", email: "student@mytutor.app" },
    { name: "Brian Otieno", email: "brian.student@mytutor.app" },
    { name: "Christine Mbeki", email: "christine.student@mytutor.app" },
    { name: "David Ssemwanga", email: "david.student@mytutor.app" },
    { name: "Emma Achola", email: "emma.student@mytutor.app" },
  ];

  const students = [];
  for (const s of studentData) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: await hash("demo1234"),
        role: "student",
        studentProfile: { create: { level: "secondary", interests: "Mathematics, Science" } },
      },
    });
    students.push(user);
  }

  // ─── Enrollments & Bookings ───────────────────────────────────────────────
  const enrollmentPairs = [
    [0, 0], [0, 5], [1, 0], [1, 1], [1, 8],
    [2, 3], [2, 5], [3, 0], [4, 6], [4, 7],
  ];

  for (const [studentIdx, sessionIdx] of enrollmentPairs) {
    if (studentIdx >= students.length || sessionIdx >= createdSessions.length) continue;
    await prisma.enrollment.create({
      data: {
        studentId: students[studentIdx].id,
        sessionId: createdSessions[sessionIdx].id,
        status: "active",
      },
    });

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14) + 1);
    await prisma.booking.create({
      data: {
        studentId: students[studentIdx].id,
        sessionId: createdSessions[sessionIdx].id,
        scheduledAt: scheduledDate,
        status: "confirmed",
        notes: "Looking forward to this session!",
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("DEMO LOGIN CREDENTIALS (all use password: demo1234)");
  console.log("─────────────────────────────────────────");
  console.log(`Admin:   admin@mytutor.app`);
  console.log(`Tutor:   tutor@mytutor.app`);
  console.log(`Student: student@mytutor.app`);
  console.log("─────────────────────────────────────────");
  console.log(`Total: ${admin ? 1 : 0} admin, ${tutors.length} tutors, ${students.length} students`);
  console.log(`Sessions: ${createdSessions.length} | Enrollments: ${enrollmentPairs.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
