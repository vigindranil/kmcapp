import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AadhaarInputProps {
  onSuccess: (data: any) => void
}

function AadhaarInput({ onSuccess }: AadhaarInputProps) {
  const [aadhaarNo, setAadhaarNo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    setIsLoading(true)
   
    setError('')

    try {
      const formData = new FormData()
      formData.append('AadhaarNo', aadhaarNo)

      const response = await fetch('http://115.187.62.16:85/api/UserAadhaarSendOTP', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.status === 0) {
        onSuccess(data.data)
        navigate('/otp')
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
          Aadhaar Number
        </label>
        <input
          id="aadhaar"
          type="text"
          value={aadhaarNo}
          onChange={(e) => setAadhaarNo(e.target.value)}
          required
          placeholder="Enter your 12-digit Aadhaar number"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  )
}

export default AadhaarInput