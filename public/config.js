/* ==========================================================================
   CENTRAL CONFIG — edit this file to update the site's content.
   Projects live in projects.js. The CV is the Word document at assets/Ahmed-Abdullateef-Resume.doc.

   Fields marked  TODO  are intentionally left for you to confirm.
   Empty strings / arrays are hidden on the page.
   ========================================================================== */
window.PORTFOLIO = {
  site: {
    url: "https://ahmed-s-digital-portfolio.vercel.app",
    title: "Ahmed Abdullateef — Full-Stack Developer, Lagos",
  },

  person: {
    name: "Ahmed Abdullateef",
    title: "Full-Stack Developer",
    location: "Lagos, Nigeria",
    timezone: "Africa/Lagos",
    coords: "6.5244° N, 3.3792° E",
    experienceYears: "3+",
    available: true,
    availabilityText: "Available for opportunities",
    email: "lateefahmed3852@gmail.com",
    github: "https://github.com/lateef123442",
    linkedin: "https://www.linkedin.com/in/ahmed-abdullateef-9b198434a",
    // The CV is the existing Word resume copied to public/assets/Ahmed-Abdullateef-Resume.doc.
    // The site checks the file exists: if it does, the buttons download it; if not, they say
    // "Request CV" and open a pre-filled email. No fake downloads.
    cv: "assets/Ahmed-Abdullateef-Resume.doc",
    cvFilename: "Ahmed-Abdullateef-Resume.doc",
  },

  hero: {
    eyebrow: "Portfolio · 2026",
    tagline: ["I turn ideas into", "powerful digital", "experiences."],
    accentLine: 1, // which tagline line gets the accent treatment
    intro:
      "Full-Stack Developer with 3+ years of experience building web applications, backend systems, responsive interfaces and API integrations. I care about how products work, how systems connect, and what they actually do for people.",
  },

  about: {
    heading: "I think beyond the interface.",
    lead:
      "I'm a Full-Stack Developer who enjoys the whole path from idea to working product: the data model, the API, the interface and the deployment.",
    paragraphs: [
      "Over three-plus years I've built web applications, developed backend systems, engineered responsive user interfaces, integrated third-party APIs and worked with both SQL and NoSQL databases. What holds my attention is how the parts fit together, and whether the result solves a real problem for the person using it.",
      "I like practical engineering: clear data models, sensible APIs, interfaces that stay readable on a phone, and code that the next person can work in. I'm also curious about emerging technology, AI in particular, and I'm always picking up something new.",
      "I'm looking for remote engineering roles, innovative startups and teams building real products, and I enjoy collaborating with people who care about the craft as much as I do.",
    ],
    facts: [
      ["Based in", "Lagos, Nigeria (WAT, UTC+1)"],
      ["Experience", "3+ years, full-stack"],
      ["Works best", "Remote, product teams"],
      ["Status", "Immediately available"],
    ],
  },

  experience: [
    {
      org: "McBaysel Intellitoria / McBaysel Global System Ltd.",
      // TODO: replace role, period and points with your real details.
      role: "Software Developer",
      period: "",
      summary: "Software development and software-related work.",
      points: [], // TODO: add 3–4 verified responsibilities, e.g. "Built X using Y".
      tags: ["Software development"],
    },
  ],
  experienceNote:
    "Roles, dates and responsibilities are being finalised. Happy to walk through my background in detail on a call.",

  skills: [
    {
      group: "Frontend",
      blurb: "Responsive, accessible interfaces.",
      items: [
        { name: "HTML5", icon: "html5" },
        { name: "CSS3", icon: "css3" },
        { name: "JavaScript", icon: "javascript" },
        { name: "TypeScript", icon: "typescript" },
        { name: "React.js", icon: "react" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "Bootstrap", icon: "bootstrap" },
        { name: "jQuery", icon: "jquery" },
      ],
    },
    {
      group: "Backend",
      blurb: "APIs and server-side logic.",
      items: [
        { name: "Node.js", icon: "nodejs" },
        { name: "Express.js", icon: "express" },
        { name: "REST APIs", icon: "api" },
      ],
    },
    {
      group: "Databases",
      blurb: "Relational and document data.",
      items: [
        { name: "MongoDB", icon: "mongodb" },
        { name: "Mongoose", icon: "mongoose" },
        { name: "MySQL", icon: "mysql" },
        { name: "PostgreSQL", icon: "postgresql" },
      ],
    },
    {
      group: "Performance",
      blurb: "Caching and background work.",
      items: [
        { name: "Redis", icon: "redis" },
        { name: "BullMQ", icon: "queue" },
      ],
    },
    {
      group: "Engineering",
      blurb: "How the work gets shipped.",
      items: [
        { name: "Git", icon: "git" },
        { name: "GitHub", icon: "github" },
        { name: "Authentication", icon: "lock" },
        { name: "API integration", icon: "plug" },
        { name: "Database management", icon: "database" },
        { name: "Full-stack application development", icon: "layers" },
      ],
    },
  ],

  interests: {
    heading: "What I'm drawn to.",
    items: [
      ["Software engineering", "Clean architecture, sensible APIs and code that lasts."],
      ["Product development", "Turning a rough idea into something people actually use."],
      ["AI & emerging tech", "Applying new tools to practical problems."],
      ["SaaS", "Building software businesses can run on."],
      ["Digital products", "Craft across the whole experience, not just the code."],
      ["Entrepreneurship", "Thinking like an owner about what's worth building."],
    ],
  },

  contact: {
    heading: "Let's build something remarkable.",
    text:
      "Open to remote roles, startups, product teams and ambitious projects. Tell me what you're working on.",
    // Optional: paste a form-backend URL (e.g. a Formspree endpoint like https://formspree.io/f/xxxx).
    // While empty, the form opens the visitor's email app instead.
    formEndpoint: "",
  },
};
