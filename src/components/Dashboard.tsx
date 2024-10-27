'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, FileText } from 'lucide-react'

interface UserData {
  aadhar_verified_token: boolean
  token: string
  udin_profile: string
  photo_base64: string
  random_key: string
  udin_header_token: string
}

interface DashboardProps {
  userData: UserData
}

interface CertificateData {
  companyName: string
  companyAddress: string
  contactName: string
  contactPhone: string
  contactEmail: string
  billboardLocation: string
  billboardCoordinates: string
  billboardSize: string
  rentalStartDate: string
  rentalEndDate: string
  rentalDuration: string
  taxType: string
  taxAmountPaid: string
  taxPaymentDate: string
  certificateIssueDate: string
}

interface CertificateResponse {
  utin_no: string
  random_key: string
  quotation_id: string
  applicationdoc_id: string | null
}

interface UDINResponse {
  status: number
  message: string
  data: {
    document_data: {
      doc_base64: string
    }
  }
}

export default function Dashboard({ userData }: DashboardProps) {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    companyName: '',
    companyAddress: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    billboardLocation: '',
    billboardCoordinates: '',
    billboardSize: '',
    rentalStartDate: '',
    rentalEndDate: '',
    rentalDuration: '',
    taxType: '',
    taxAmountPaid: '',
    taxPaymentDate: '',
    certificateIssueDate: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [certificateResponse, setCertificateResponse] = useState<CertificateResponse | null>(null)
  const [pdfData, setPdfData] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCertificateData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setCertificateResponse(null)
    setPdfData(null)

    try {
      const response = await fetch('http://115.187.62.16:85/api/CertificateGenerationByAuthorityKMCBillBoard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Token: userData.token,
          DocValidity: "1",
          DocVisibility: "PUBLIC",
          DocType: "P",
          CertificateData: certificateData,
          Random: userData.random_key,
          UdinHeaderToken: userData.udin_header_token,
          TemplateID: "1729865069576"
        }),
      })

      const data = await response.json()

      if (data.status === 0) {
        setCertificateResponse(data.data)
        await verifyUDIN(data.data.utin_no)
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyUDIN = async (udinNo: string) => {
    try {
      const formData = new FormData()
      formData.append('UDINNo', udinNo)

      const response = await fetch('https://wbpcb.nltr.org/WBPCCService/api/VerifyUtinTradeLicense', {
        method: 'POST',
        body: formData,
      })

      const data: UDINResponse = await response.json()

      if (data.status === 0) {
        setPdfData(data.data.document_data.doc_base64)
      } else {
        setError('Failed to verify UDIN')
      }
    } catch (err) {
      setError('An error occurred while verifying UDIN')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-gray-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome, {userData.udin_profile}</h1>
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/jpeg;base64,${userData.photo_base64}`}
              alt="User Photo"
              className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-lg"
            />
          </div>
          <p className="text-xl mb-2">Your Aadhaar has been successfully verified.</p>
          <p className="text-sm opacity-75">Token: {userData.token}</p>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-semibold mb-6">Generate Certificate</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(certificateData).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * Object.keys(certificateData).indexOf(key) }}
                >
                  <label htmlFor={key} className="block text-sm font-medium mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type={key.includes('Date') ? 'date' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-600 bg-opacity-50 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                  />
                </motion.div>
              ))}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-800 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Certificate'
              )}
            </motion.button>
          </form>
        </motion.div>

        {certificateResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-gray-600 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-lg"
          >
            <h4 className="text-2xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2" />
              Certificate Generated Successfully
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm"><span className="font-medium">UTIN No:</span> {certificateResponse.utin_no}</p>
            </div>
            {pdfData && (
              <div className="mt-4">
                <h5 className="text-xl font-semibold mb-2 flex items-center">
                  <FileText className="mr-2" />
                  Certificate PDF
                </h5>
                <iframe
                  src={`${pdfData}`}
                  className="w-full h-96 border border-gray-500 rounded"
                />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}