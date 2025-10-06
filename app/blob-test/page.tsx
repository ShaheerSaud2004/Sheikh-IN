'use client'

import { useState } from 'react'

export default function BlobTest() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const testBlobStorage = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blob-test', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ error: 'Failed to test BLOB storage' })
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async () => {
    if (!file) return
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ error: 'Failed to upload file' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            BLOB Storage Test
          </h1>
          
          <div className="space-y-6">
            {/* Test BLOB Storage */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Test Basic BLOB Storage
              </h2>
              <button
                onClick={testBlobStorage}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test BLOB Storage'}
              </button>
            </div>

            {/* File Upload */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Test File Upload
              </h2>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={uploadFile}
                disabled={!file || loading}
                className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Results
                </h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
