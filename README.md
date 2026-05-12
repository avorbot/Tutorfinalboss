# MyTutor Platform

A full-stack tutoring platform built with **Django LMS/CMS** (backend) and **React + Webpack** (frontend). Inspired by the edX architecture — completely original and owned.

## Architecture

```
mytutor/
├── lms/                    # Learning Management System (student-facing)
│   ├── djangoapps/         # Feature apps
│   │   ├── users/          # Auth, profiles, roles
│   │   ├── tutors/         # Tutor profiles & discovery
│   │   ├── sessions/       # TutorSession & Enrollment
│   │   ├── bookings/       # Booking management
│   │   ├── payments/       # Stripe, PayPal, MTN, Airtel, Amazon Pay
│   │   ├── messaging/      # Direct messaging
│   │   ├── kids/           # Kids Zone & progress
│   │   ├── parents/        # Parent Portal
│   │   └── submissions/    # Content submissions to CMS
│   ├── envs/               # Settings (base/dev/prod)
│   ├── static/             # CSS design system + React components
│   └── templates/          # Django HTML templates
├── cms/                    # Content Management Studio
│   ├── djangoapps/content/ # Content library & review
│   ├── envs/               # CMS settings
│   ├── static/             # CMS-specific styles
│   └── templates/          # CMS HTML templates
├── requirements/           # Python dependencies
├── webpack.*.config.js     # Webpack build configs
├── .babelrc                # Babel (preset-env + preset-react)
├── jest.config.js          # Jest test runner
└── package.json            # JS dependencies
```

## Design System

| Token | Value |
|---|---|
| `--primary` | `#1a7a3c` (green) |
| `--accent` | `#f97316` (orange) |
| `--font-heading` | Poppins 600–800 |
| `--font-body` | Plus Jakarta Sans 400–600 |
| Default theme | Dark (`data-theme="dark"`) |

## User Roles

| Role | Dashboard | Features |
|---|---|---|
| **Student** | `/dashboard/student` | Book sessions, messaging, payments |
| **Tutor** | `/dashboard/tutor` | Manage sessions, CMS Studio, earnings |
| **Admin** | `/dashboard/admin` | Approve tutors, review content, stats |
| **Kid** | `/dashboard/kids` | Gamified planet learning, XP, badges |
| **Parent** | `/dashboard/parent` | Monitor children, spending control |

## Quick Start

```bash
# 1. Clone & install dependencies
git clone https://github.com/avorbot/Tutorfinalboss.git
cd Tutorfinalboss
make install

# 2. Set up environment
cp .env.example .env
# Edit .env with your SECRET_KEY, Stripe keys, etc.

# 3. Run migrations
make migrate

# 4. Create superuser
make superuser

# 5. Build frontend assets
make build

# 6. Start development server
make run
```

Visit `http://localhost:8000`

## Environment Variables

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
MTN_MOMO_API_KEY=...
AIRTEL_MONEY_API_KEY=...

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Celery / Redis (optional, for async tasks)
CELERY_BROKER_URL=redis://localhost:6379/0
```

## Tech Stack

**Backend**: Python 3.11 · Django 4.2 · Django REST Framework · SimpleJWT · Celery

**Frontend**: React 18 · JSX · Webpack 5 · Babel 7 · Framer Motion · Phosphor Icons

**Database**: SQLite (dev) · PostgreSQL (prod)

**Payments**: Stripe · PayPal · MTN Mobile Money · Airtel Money · Amazon Pay

**Auth**: JWT (SimpleJWT) · Google OAuth (django-allauth)
