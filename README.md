# Real-Time Collaborative Workspace

**Plan · Collaborate · Sync**

Real-Time Collaborative Workspace is a full-stack, Trello-style team collaboration platform. It combines Kanban boards, card comments, shared documents, workspace chat, notifications, and an activity feed in one place, and keeps every connected member in sync instantly using WebSockets.

The project was built as a team project. Team members worked on separate Git branches (frontend, backend, QA, and feature work) and merged them into a shared `main` branch.

## Overview

Teams usually spread their work across separate tools: a task board, a chat app, a document editor, and a notification inbox. This project brings those pieces into one workspace.

- Users register, log in, and create or join **workspaces**.
- Each workspace contains **boards**, each board contains **lists**, and each list contains **cards** (tasks).
- Changes made by one member (a card created, edited, or deleted) appear on the screens of the other members without a page refresh.
- Workspace members can chat, edit shared documents, comment on cards, and follow an activity timeline.

The goal was to understand how a real-time application works end to end: authentication, authorization by role, a relational data model in MongoDB, caching with Redis, and bidirectional communication with Socket.io.

## Key Features

### Authentication and Account
- User registration and login with JWT (JSON Web Token) authentication
- Protected routes on the frontend and protected API routes on the backend
- Profile management, preferences (email and workspace notification toggles), and change password

### Workspaces and Members
- Create and update workspaces
- Workspace switcher with the selected workspace remembered across reloads
- Member management with three roles: `owner`, `admin`, `member`
- Add members, change a member's role, and remove members

### Boards, Lists, and Cards
- Create, edit, and delete boards
- Create, rename, and delete lists inside a board
- Create, edit, delete, and assign cards to workspace members
- Card priority (`low`, `medium`, `high`), description, and due date
- Drag and drop cards between lists, with an optimistic UI update
- Comments on cards (add, edit, delete)

### Real-Time Collaboration
- Live card and board updates across all connected members
- Workspace chat over WebSockets
- Workspace rooms with membership verification before joining

### Productivity Tools
- Shared workspace documents (create, list, update)
- Dashboard with overview cards, boards section, and recent activity
- Activity feed with filters
- Notification bell with unread count, mark as read, and mark all as read

### Performance
- Redis caching of a workspace's board list with a 60 second TTL (time to live) and cache invalidation when boards change

## Real-Time Sync Pipeline

Instead of polling the server on a timer, the app pushes changes to clients as they happen.

```
User A edits a card
        │
        ▼
REST request (PUT /api/cards/:id) with JWT
        │
        ▼
Express controller
        │
        ├── Verify authentication and workspace membership
        ├── Save change in MongoDB
        ├── Create an activity record and notifications
        └── Emit a Socket.io event to the workspace room
        │
        ▼
Socket.io room: workspace:<workspaceId>
        │
        ▼
User B, User C ... receive "card:updated"
        │
        ▼
React state is updated, UI re-renders without a refresh
```

## Application Workflow

```
User registers / logs in
          ↓
JWT is stored and attached to every request
          ↓
User creates or selects a workspace
          ↓
Owner/admin adds members and assigns roles
          ↓
Members create boards, lists, and cards
          ↓
Socket connection joins the workspace room
          ↓
Cards are moved, edited, and commented on
          ↓
Other members see updates instantly
          ↓
Activity feed and notifications record what happened
```

## System Architecture

```
                 ┌──────────────────────────┐
                 │      React Frontend      │
                 │  MUI + Tailwind + Router │
                 └───────┬──────────┬───────┘
                         │          │
              REST (Axios)          │ WebSocket (socket.io-client)
                         │          │
                         ▼          ▼
                 ┌──────────────────────────┐
                 │   Node + Express API     │
                 │   + Socket.io Server     │
                 └───────┬──────────┬───────┘
                         │          │
              ┌──────────┘          └──────────┐
              ▼                                ▼
      ┌───────────────┐                ┌───────────────┐
      │    MongoDB    │                │     Redis     │
      │  App data     │                │  Board cache  │
      └───────────────┘                └───────────────┘
```

**Main flow:** the React frontend talks to the Express backend through REST for data operations and through Socket.io for live events. MongoDB (via Mongoose) is the source of truth. Redis caches the boards list per workspace to reduce repeated database reads, and the backend falls back to MongoDB if Redis is unavailable.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router v7, Material UI, Tailwind CSS v4, Axios |
| Drag and Drop | @hello-pangea/dnd |
| Real-Time Client | socket.io-client |
| State / Context | React Context API (workspace context), local component state |
| Backend | Node.js, Express 5 |
| Real-Time Server | Socket.io |
| Database | MongoDB, Mongoose |
| Cache | Redis |
| Authentication | JWT, bcryptjs |
| Deployment | Render |
| Development | Git, GitHub, VS Code, ESLint |

## Important Engineering Decisions

### JWT Authentication on REST and WebSocket
REST routes use an `authMiddleware` that verifies the `Authorization: Bearer <token>` header. The Socket.io server uses an `io.use` middleware that verifies the token sent in the handshake `auth` object and attaches the user id to the socket.

### Membership Checks Before Joining Rooms
A client emits `workspace:join` with a workspace id. The server looks up the user in the `WorkspaceMember` collection and only then adds the socket to the `workspace:<id>` room. This stops a logged-in user from listening to workspaces they do not belong to.

### Role-Based Workspace Membership
Each membership document stores a `role` (`owner`, `admin`, `member`). The role decides who can manage members and workspace settings.

### Shared Axios Instance
`axiosInstance.js` sets the base URL from `VITE_API_URL` and uses a request interceptor to attach the token automatically, so API modules do not repeat header code.

### One Shared Socket Instance
`socket.js` exports a single socket with `autoConnect: false`. Pages connect when needed and always remove their listeners with `socket.off` in the `useEffect` cleanup function to avoid duplicate handlers.

### Deduplicating Socket Events
When the same user both receives an HTTP response and a socket event for the same card or list, the handlers check `_id` before adding to state so items do not appear twice.

### Optimistic UI for Drag and Drop
When a card is dropped, local state is updated immediately for a smooth experience, then the move is sent to the server. If the request fails, the board is refetched to restore the correct state.

### Redis Cache with Safe Fallback
Board lists are cached per workspace and invalidated whenever a board changes. Every cache call is wrapped in try/catch so a Redis problem never breaks the request.

### Frontend and Backend Separation
```
client/    React application
server/    Express REST API and Socket.io server
```
This allows the two parts to be developed, tested, and deployed independently.

## Project Structure

```
real-time-collaborative-workspace/
│
├── client/
│   ├── public/
│   └── src/
│       ├── api/            Axios API modules (auth, boards, cards, ...)
│       ├── components/
│       │   ├── activity/
│       │   ├── auth/       ProtectedRoute
│       │   ├── boards/
│       │   ├── chat/       WorkspaceChat
│       │   ├── common/     Navbar, Sidebar
│       │   ├── dashboard/
│       │   ├── documents/
│       │   ├── home/       Landing page sections
│       │   ├── members/
│       │   ├── notifications/
│       │   ├── profile/
│       │   └── settings/
│       ├── context/        workspaceContext
│       ├── hooks/          useResponsiveSidebar
│       ├── pages/          Home, Login, Register, Dashboard, MyBoards,
│       │                   BoardDetail, Members, Activity, Profile, Settings
│       ├── socket.js
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/             db.js, redis.js
│   ├── controllers/
│   ├── middleware/         authmiddleware.js
│   ├── models/
│   ├── routes/
│   ├── utils/              boardCache, createActivity, createNotification
│   ├── app.js              Express app and route mounting
│   ├── socket.js           Socket.io setup, auth, rooms, chat
│   └── server.js           HTTP server, DB and Redis startup
│
└── README.md
```

## Data Model

| Model | Purpose | Key relations |
| --- | --- | --- |
| User | Account, avatar, preferences | Referenced by almost every model |
| Workspace | A team space | `owner` is a User |
| WorkspaceMember | Membership and role | `workspace`, `user` |
| Board | A project board | `workspace`, `createdBy` |
| List | A column on a board | `board`, `position` |
| Card | A task | `list`, `assignedTo`, `createdBy`, `priority`, `position`, `dueDate` |
| Comment | Discussion on a card | `card`, `user` |
| Document | Shared workspace document | `workspace`, `createdBy`, `updatedBy` |
| Message | Chat message | `workspace`, `sender` |
| Activity | Audit trail entry | `user`, `workspace`, `board`, `card` |
| Notification | Per user alert | `recipient`, `sender`, `workspace`, `isRead` |

## Challenges We Faced

### Keeping Many Clients in Sync
Real-time events can arrive in a different order than HTTP responses. We handled this with `_id` based deduplication and by scoping events to workspace rooms.

### Securing WebSockets
HTTP middleware does not protect a WebSocket connection. We added a separate handshake authentication step and a membership check before a socket can join a room.

### Route Order in Express
Static paths such as `/workspace/:workspaceId/stats` must be declared before `/:id`, otherwise Express matches the wrong handler.

### Cache Invalidation
A cached board list must be cleared when boards are created, updated, or deleted, or users see stale data for up to the TTL.

### Deployment Differences
The deployed frontend and backend run on different origins, so CORS (Cross-Origin Resource Sharing), API URLs, and environment variables had to be configured for both local and production environments.

### Drag and Drop State
Keeping positions correct across lists while updating the UI optimistically needed careful state handling.

### Git Collaboration
Several people worked on separate branches (for example frontend, backend, and QA branches), so merging and resolving conflicts was a regular part of the workflow.

## Getting Started

### Prerequisites
- Node.js 18 or later
- A MongoDB database (local or MongoDB Atlas)
- A Redis server (local, Docker, or a hosted instance)

### 1. Clone the Repository
```bash
git clone https://github.com/nehajaiswal-cse/real-time-collaborative-workspace.git
cd real-time-collaborative-workspace
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
Open another terminal:
```bash
cd client
npm install
```

### 4. Configure Environment Variables
Create `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
REDIS_URL=redis://127.0.0.1:6379
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Never commit real secrets. `server/.env` is listed in `.gitignore`.

### 5. Start the Backend
```bash
cd server
npm run dev
```

### 6. Start the Frontend
```bash
cd client
npm run dev
```
Vite prints the local URL in the terminal (usually `http://localhost:5173`).

### Available Scripts

| Location | Script | Purpose |
| --- | --- | --- |
| server | `npm run dev` | Start API with nodemon (auto restart) |
| server | `npm start` | Start API with Node |
| client | `npm run dev` | Start Vite dev server |
| client | `npm run build` | Production build |
| client | `npm run preview` | Preview the production build |
| client | `npm run lint` | Run ESLint |

## Environment Variables

### Server

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on (default 5000) |
| `CLIENT_URL` | Frontend URL |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `REDIS_URL` | Redis connection URL (default `redis://127.0.0.1:6379`) |

### Client

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the REST API (default `http://localhost:5000/api`) |
| `VITE_SOCKET_URL` | Socket.io server URL (default `http://localhost:5000`) |

Vite only exposes variables that start with `VITE_` to browser code.

## API Overview

Base URL: `/api`. All routes except register and login require an `Authorization: Bearer <token>` header.

| Module | Base path | Main endpoints |
| --- | --- | --- |
| Auth | `/auth` | `POST /register`, `POST /login`, `GET /me` |
| Users | `/users` | `GET/PATCH /me`, `GET/PATCH /me/preferences`, `POST /me/change-password` |
| Workspaces | `/workspaces` | `POST /`, `GET /`, `GET /:id`, `PATCH /:id` |
| Workspace Members | `/workspace-members` | `POST /`, `GET /workspace/:workspaceId`, `PUT /:id`, `DELETE /:id` |
| Boards | `/boards` | `POST /`, `GET /workspace/:workspaceId`, `GET /workspace/:workspaceId/stats`, `GET/PUT/DELETE /:id` |
| Lists | `/lists` | `POST /`, `GET /board/:boardId`, `GET/PUT/DELETE /:id` |
| Cards | `/cards` | `POST /`, `GET /list/:listId`, `GET/PUT/DELETE /:id`, `PUT /:id/move` |
| Comments | `/comments` | `GET/POST /card/:cardId`, `PUT/DELETE /:commentId` |
| Documents | `/documents` | `GET/POST /workspace/:workspaceId`, `PUT /:documentId` |
| Messages | `/messages` | `GET/POST /workspace/:workspaceId` |
| Activities | `/activities` | `GET /` |
| Notifications | `/notifications` | `GET /`, `GET /unread-count`, `PATCH /read-all`, `PATCH /:notificationId/read` |

### Socket.io Events

| Direction | Event | Purpose |
| --- | --- | --- |
| Client to server | `workspace:join`, `workspace:leave` | Enter or leave a workspace room (membership is verified) |
| Client to server | `board:join`, `board:leave` | Enter or leave a board room |
| Client to server | `chat:send` | Send a chat message to the workspace |
| Server to client | `workspace:joined`, `workspace:error` | Join result |
| Server to client | `workspace:user-joined`, `workspace:user-left` | Presence updates |
| Server to client | `chat:message`, `chat:error` | Incoming chat message or error |
| Server to client | `board:created`, `board:updated`, `board:deleted` | Board changes |
| Server to client | `card:created`, `card:updated`, `card:deleted` | Card changes |

## Screenshots

Screenshots can be added once they are committed to the repository.

```
screenshots/
├── landing-page.png
├── dashboard.png
├── board-detail.png
├── members.png
└── activity.png
```

Then reference them like this:

```md
![Dashboard](./screenshots/dashboard.png)
![Board Detail](./screenshots/board-detail.png)
```

## What I Learned

- Building a full-stack application with React, Node.js, Express, and MongoDB
- Designing a REST API and consuming it with Axios and an interceptor
- Implementing JWT authentication and role-based authorization
- Adding real-time features with Socket.io: rooms, events, and handshake authentication
- Managing React state for live data, including cleanup of socket listeners in `useEffect`
- Implementing drag and drop with optimistic UI updates
- Modeling relationships in MongoDB with Mongoose references and `populate`
- Caching with Redis and handling cache invalidation
- Debugging CORS, environment variables, and deployment problems on Render
- Using Git branches, merges, and conflict resolution in a team

## Future Improvements

These are planned improvements and are not presented as current features.

- Move all HTTP calls in the board page to the shared Axios instance and add a global 401 handler
- Split the large board page into custom hooks and smaller components
- Protect the Activity, Settings, and Profile routes with the route guard
- Re-index sibling cards after a drag and drop so local order always matches the server
- Store the auth token in an httpOnly cookie instead of localStorage
- Presence indicators (who is online) and typing indicators in chat
- Real-time collaborative document editing
- Card due date reminders and email notifications
- Code splitting with `React.lazy` and `Suspense`
- Automated tests (unit, integration, and end-to-end)

## Team

This project was developed by a team. Each member contributed to different areas such as frontend UI, backend APIs, real-time features, QA and testing, and deployment.

## Project Repository

GitHub: https://github.com/nehajaiswal-cse/real-time-collaborative-workspace

## License

This project was developed as an educational/team project. 
If you plan to reuse or extend it, please refer to the repository for the applicable terms.
