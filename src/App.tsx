'use client'

import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AadhaarInput from './components/AadhaarInput'
import OTPValidation from './components/OTPValidation'
import Dashboard from './components/Dashboard'

interface AadhaarData {
  trans_id: string
  random_key: string
  udin_header_token: string
}

interface UserData {
  aadhar_verified_token: boolean
  token: string
  udin_profile: string
  photo_base64: string
  random_key: string
  udin_header_token: string
}

export default function App() {
  const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

  return (
    <Router>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/login_background.webp')" }}>
        <div className="min-h-screen bg-black bg-opacity-50"> {/* This adds a semi-transparent overlay */}
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="max-w-md w-full space-y-8 p-8 bg-white bg-opacity-90 rounded-xl shadow-md">
                    <AadhaarInput 
                      onSuccess={(data: AadhaarData) => setAadhaarData(data)} 
                    />
                  </div>
                </div>
              } 
            />
            <Route 
              path="/otp" 
              element={
                aadhaarData ? (
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="max-w-md w-full space-y-8 p-8 bg-white bg-opacity-90 rounded-xl shadow-md">
                      <OTPValidation 
                        aadhaarData={aadhaarData} 
                        onSuccess={(data: UserData) => setUserData(data)} 
                      />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                userData ? (
                  <Dashboard userData={userData} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}