# Placement Suite

Unified placement operating system built by integrating:
- Job Notification Tracker
- Placement Readiness
- Resume Builder

## What is integrated

- Unified dashboard with:
  - Daily top job matches
  - Resume ATS score
  - JD readiness score
  - Application pipeline stats
  - Weak skill alerts
  - Next action recommendation
- Cross-module automation flow:
  - Save Job -> Analyze JD -> Extract skills -> Compare with resume -> Highlight gaps -> Update score
- Central readiness score (0-100):
  - Job Match Quality 30%
  - JD Skill Alignment 25%
  - Resume ATS Score 25%
  - Application Progress 10%
  - Practice Completion 10%
- Application stages:
  - Saved, Applied, Interview Scheduled, Interview Completed, Offer, Rejected
- Notification intelligence triggers:
  - High match job found
  - Resume score below 70
  - JD analyzed but poor alignment
  - Interview in next 24 hours
  - No activity for 3 days

## Tech

- React + Vite
- React Router
- LocalStorage for deterministic persisted state

## Run

```bash
npm install
npm run dev
```

## Pages

- `/dashboard` Unified control center
- `/jobs` Job tracker + JD analyze trigger
- `/readiness` JD analyzer output
- `/resume` Resume builder + ATS + gap hints
- `/pipeline` Stage management + practice contribution
- `/proof` Final platform proof checklist
