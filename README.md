## Local Setup

### clone from github
`git clone https://github.com/agbad/theflex-fe.git`

### change working directory
`cd theflex-fe`

### Create .env in the frontend root
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### install dependencies
`npm install`

### run dev server
`npm run dev`

## Notes
- The app runs at http://localhost:3000.
- FE → BE base URL
  - The FE axios base is added in the .env  but defaults to http://localhost:5000/api in FE-lib/axios.ts.
  - If you change the backend port, update it there accordingly.
- Login flow
  - Open http://localhost:3000/login.
  - Use the manager credentials you put in the backend .env.
  - Successful login stores { token, user } in localStorage under auth.
- Pages to check
  - /dashboard — shows KPIs and recent reviews; lets you Publish reviews.
  - /hostaway — lists Hostaway reviews (uses ?mock=1 under the hood for sandbox).
  - / — landing page with Reviews Carousel (auto-rotating, displays published reviews only).
