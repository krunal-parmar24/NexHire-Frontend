import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import AuthRoutes from './routes/AuthRoutes'
import JobSeekerRoutes from './routes/JobSeekerRoutes'
import RecruiterRoutes from './routes/RecruiterRoutes'

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/seeker/*" element={<JobSeekerRoutes />} />
      <Route path="/recruiter/*" element={<RecruiterRoutes />} />
    </Routes>
  )
}
