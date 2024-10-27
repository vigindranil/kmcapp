import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface OTPValidationProps {
  aadhaarData: {
    trans_id: string
    random_key: string
    udin_header_token: string
  }
  onSuccess: (data: any) => void
}

function OTPValidation({ aadhaarData, onSuccess }: OTPValidationProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('Random', aadhaarData.random_key)
      formData.append('TransactionID', aadhaarData.trans_id)
      formData.append('Otp', otp)
      formData.append('UdinHeaderToken', aadhaarData.udin_header_token)

      const response = await fetch('http://115.187.62.16:85/api/UserAadhaarValidateOTP', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.status === 0) {
        onSuccess(data.data)
        navigate('/dashboard')
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
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          Enter OTP
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="Enter the OTP sent to your mobile"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Validating...' : 'Validate OTP'}
      </button>
    </form>
  )
}

export default OTPValidation