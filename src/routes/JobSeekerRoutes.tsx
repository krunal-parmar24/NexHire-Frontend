import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MyApplicationsPage from '../pages/jobseeker/MyApplicationsPage'

export default function JobSeekerRoutes() {
  return (
    <Routes>
      <Route path="/applications" element={<MyApplicationsPage />} />
    </Routes>
  )
}
