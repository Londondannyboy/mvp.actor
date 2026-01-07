# EsportsJobs.quest v2 - Moonshot Plan

## Vision
Create the most interactive, visually stunning esports job board with AI-powered job discovery, 3D animations, and seamless CopilotKit integration.

---

## Phase 1: Core CopilotKit Features ✅ COMPLETED

### What Works Now
- [x] CopilotKit sidebar with Pydantic AI agent
- [x] Job search tool returning real jobs from Neon DB
- [x] User context via `get_my_profile` tool
- [x] Company lookup tool
- [x] Neon Auth for user login
- [x] AG-UI protocol working

### Breakthrough Solution (documented in CLAUDE.md)
The LLM needs a TOOL to access user data - created `get_my_profile` tool.

---

## Phase 2: Generative UI - Job Cards in CopilotKit

### Goal
When user searches jobs, show beautiful interactive cards IN the CopilotKit sidebar with:
- Company logo/image
- Job title, company, location
- Salary badge
- Video background (Mux streaming)
- "Apply Now" button
- "Save Job" action

### Implementation

**Frontend (app/page.tsx):**
```tsx
import { useRenderToolCall } from "@copilotkit/react-core";

// Rich job card for sidebar
function JobCardRich({ job }: { job: Job }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 hover:border-cyan-500 transition-all">
      {/* Video background */}
      {job.videoUrl && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src={job.videoUrl}
        />
      )}
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <img src={job.logoUrl || "/placeholder-logo.png"} className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="font-bold text-white">{job.title}</h3>
            <p className="text-cyan-400 text-sm">{job.company}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs bg-green-600 px-2 py-1 rounded">{job.salary}</span>
          <span className="text-xs text-gray-400">{job.location}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <a href={job.url} className="flex-1 bg-cyan-500 text-center py-2 rounded-lg text-sm font-medium">
            Apply Now
          </a>
          <button className="px-3 py-2 bg-gray-700 rounded-lg">❤️</button>
        </div>
      </div>
    </div>
  );
}

// Render job cards when search_esports_jobs returns
useRenderToolCall({
  name: "search_esports_jobs",
  render: ({ result, status }) => {
    if (status !== "complete") return <LoadingSpinner />;
    return (
      <div className="grid gap-3">
        {result.jobs.map(job => <JobCardRich key={job.id} job={job} />)}
      </div>
    );
  }
});
```

### Tasks
- [ ] Add `logo_url` and `video_url` columns to jobs table
- [ ] Update job search tool to return these fields
- [ ] Create `JobCardRich` component with video background
- [ ] Add Mux playback IDs for video streaming
- [ ] Implement save job functionality (HITL)

---

## Phase 3: Three.js Interactive Hero Banner

### Concept
Animated 3D gaming character (soldier/gamer) that:
- Idles when page loads
- Walks/runs when user scrolls
- Reacts to cursor movement
- Transitions between animations smoothly

### Reference Examples (MIT Licensed)
- https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_blending.html
- Uses Mixamo's free "Soldier.glb" model with Idle/Walk/Run animations

### Implementation

**components/three/GamerHero.tsx:**
```tsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";

function GamerCharacter() {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/Soldier.glb");
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Start with idle animation
    actions["Idle"]?.play();
  }, [actions]);

  // Blend to walk/run on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        actions["Idle"]?.fadeOut(0.5);
        actions["Walk"]?.fadeIn(0.5).play();
      } else {
        actions["Walk"]?.fadeOut(0.5);
        actions["Idle"]?.fadeIn(0.5).play();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [actions]);

  return <primitive ref={group} object={scene} scale={2} />;
}

export function GamerHero() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <GamerCharacter />
      </Canvas>
    </div>
  );
}
```

### Tasks
- [ ] Install three.js deps: `npm install three @react-three/fiber @react-three/drei`
- [ ] Download Soldier.glb from Mixamo (free, credit not required for personal use)
- [ ] Create GamerHero component with animation blending
- [ ] Add scroll-reactive animation transitions
- [ ] Add cursor-follow eye tracking (optional)
- [ ] WebGL fallback for unsupported browsers

---

## Phase 4: Design from v1 (esportsjobs.quest)

### Components to Port
From `/Users/dankeegan/esportsjobs.quest/app/`:

| Component | Purpose |
|-----------|---------|
| `UnifiedHeader.tsx` | Navigation with logo, search, auth |
| `UnifiedFooter.tsx` | Footer with links, SEO |
| `JobSearch.tsx` | Search bar with autocomplete |
| `AnimatedTagline.tsx` | Rotating job titles animation |
| `NewsSection.tsx` | Esports news cards |
| `HeyCompanies.tsx` | "For Companies" CTA section |
| `CrossLinkBanner.tsx` | Related pages banner |
| `MuxVideo.tsx` | Video player with Mux |
| `LazyYouTube.tsx` | Lazy-loaded YouTube embeds |

### Design Elements
- Dark theme with cyan/purple gradients
- Job cards with video backgrounds
- Stats bar: "$1.8B Market", "540M Viewers", etc.
- Career paths grid (Competition, Content, Broadcast, Business)
- Company logos ticker
- FAQ section with schema.org markup

### Tasks
- [ ] Copy and adapt UnifiedHeader/Footer
- [ ] Port JobSearch with CopilotKit integration
- [ ] Add AnimatedTagline to hero
- [ ] Port video components (Mux, YouTube)
- [ ] Add stats bar with real-time data
- [ ] Create career paths section

---

## Phase 5: Advanced Interactivity

### Voice Input (Hume EVI)
```tsx
// Already have CLM endpoint at /chat/completions
// Add voice widget that sends to same agent
<VoiceProvider configId="esports-evi-config">
  <VoiceWidget />
</VoiceProvider>
```

### 3D Job Visualization
- Force-directed graph of jobs by category/location
- Click node to filter jobs
- Zoom into clusters

### Live Job Alerts
- WebSocket for new job notifications
- Toast notifications in sidebar
- "New jobs matching your skills!" prompt

### Profile Building
- Skills radar chart
- Career path recommendation
- "Jobs for you" personalized feed

---

## Database Schema Updates

```sql
-- Add to jobs table
ALTER TABLE jobs ADD COLUMN logo_url TEXT;
ALTER TABLE jobs ADD COLUMN video_url TEXT;
ALTER TABLE jobs ADD COLUMN mux_playback_id TEXT;

-- User preferences
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  preferred_categories TEXT[],
  preferred_locations TEXT[],
  salary_min INTEGER,
  remote_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved jobs
CREATE TABLE saved_jobs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| AI Chat | CopilotKit, Pydantic AI, Gemini |
| Voice | Hume EVI (future) |
| Database | Neon PostgreSQL |
| Auth | Neon Auth |
| Video | Mux streaming |
| Hosting | Vercel (frontend), Railway (agent) |

---

## Priority Order

1. **Phase 2: Job Cards** - Immediate visual impact
2. **Phase 4: v1 Design** - Professional look
3. **Phase 3: Three.js Hero** - Wow factor
4. **Phase 5: Voice/Advanced** - Differentiation

---

## Three.js Resources (Free, Open Source)

### Models
- **Mixamo** (mixamo.com) - Free rigged characters with animations
  - Soldier, Robot, Zombie characters
  - Idle, Walk, Run, Jump animations
  - Export as GLTF/GLB

### Examples to Adapt
- `webgl_animation_skinning_blending.html` - Character animation blending
- `webgl_loader_gltf.html` - Loading 3D models
- `webgl_postprocessing_unreal_bloom.html` - Glow effects

### Credits
Three.js examples are MIT licensed. Credit: "Three.js by mrdoob"
Mixamo models are free for personal/commercial use, no attribution required.

---

## Quick Start Commands

```bash
# Install 3D dependencies
npm install three @react-three/fiber @react-three/drei @types/three

# Download Soldier model
# Go to mixamo.com, download Soldier with Idle/Walk/Run animations as GLB
# Place in public/models/Soldier.glb

# Run development
npm run dev

# Deploy
git push  # Vercel auto-deploys frontend
cd agent && railway up . --path-as-root  # Deploy agent
```

---

## Success Metrics

- [ ] User can search jobs via voice or text
- [ ] Job cards show with video backgrounds in sidebar
- [ ] 3D character animates on scroll
- [ ] Page looks as good as v1 esportsjobs.quest
- [ ] Mobile responsive
- [ ] < 3s initial load time
- [ ] 90+ Lighthouse score
