// Single source of truth for all home page copy and design tokens.
// Keeping static content outside JSX (separation of concerns) makes edits safe and easy.

export const BRAND = {
  name: "SyncSpace",
  primary: "#A9744F",
  primaryDark: "#8B5E3C",
  primaryDarker: "#6F472F",
  tint: "#f4ece6",
  surface: "#f8fafc",
  border: "#e5e7eb",
  textMuted: "#6b7280",
  textDark: "#1f2937",
  headingFont: "Georgia, serif",
};

// Routes already registered in App.jsx
export const ROUTES = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
};

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export const HERO = {
  badge: "Real time collaboration",
  title: "Plan, discuss and ship work together, in one shared space.",
  subtitle:
    "SyncSpace brings boards, chat and documents into a single workspace, so every update reaches your team the moment it happens.",
};

export const HERO_POINTS = [
  "Drag and drop task boards",
  "Live team chat",
  "Instant notifications",
];

// iconKey is mapped to an MUI icon inside FeatureCard (keeps this file free of JSX).
export const FEATURES = [
  {
    iconKey: "boards",
    title: "Kanban Boards",
    description:
      "Organise work into boards, lists and cards. Move cards with drag and drop to update task status.",
  },
  {
    iconKey: "chat",
    title: "Workspace Chat",
    description:
      "Talk with your team inside the workspace. Messages are delivered instantly over WebSockets.",
  },
  {
    iconKey: "documents",
    title: "Shared Documents",
    description:
      "Keep notes, specs and files next to your tasks so context never gets lost.",
  },
  {
    iconKey: "notifications",
    title: "Live Notifications",
    description:
      "Get alerted about assignments, comments and changes without refreshing the page.",
  },
  {
    iconKey: "members",
    title: "Team Management",
    description:
      "Invite members to a workspace and manage who can see and edit each board.",
  },
  {
    iconKey: "activity",
    title: "Activity Timeline",
    description:
      "Track who changed what and when, with a clear history of every workspace action.",
  },
];

export const STEPS = [
  {
    title: "Create your account",
    description: "Register in under a minute and sign in securely with your email.",
  },
  {
    title: "Set up a workspace",
    description: "Create a workspace, add boards and invite your teammates.",
  },
  {
    title: "Collaborate live",
    description: "Move cards, chat and share updates. Everyone sees changes in real time.",
  },
];

// Sample data for the decorative board preview (not fetched from the API).
export const PREVIEW_COLUMNS = [
  {
    title: "To Do",
    cards: [
      { text: "Design onboarding flow", tag: "Design" },
      { text: "Write API docs", tag: "Docs" },
    ],
  },
  {
    title: "In Progress",
    cards: [
      { text: "Socket.io notifications", tag: "Backend" },
      { text: "Board drag and drop", tag: "Frontend" },
    ],
  },
  {
    title: "Done",
    cards: [{ text: "JWT authentication", tag: "Backend" }],
  },
];

export const PREVIEW_MEMBERS = ["A", "R", "G", "S"];
