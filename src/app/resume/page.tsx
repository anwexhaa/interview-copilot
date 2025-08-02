'use client'

import { useState } from 'react'
import { Loader2, FileCheck2 } from 'lucide-react'

export default function ResumeReview() {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | string[]>('')
  const [loading, setLoading] = useState(false)
  const [isCheckingScore, setIsCheckingScore] = useState(false)

  const handleCheckScore = async () => {
    if (!jobDescription || !resumeFile) return

    setLoading(true)
    setIsCheckingScore(true)
    setFeedback('')
    setScore(null)

    try {
      const formData = new FormData()
      formData.append('jobDescription', jobDescription)
      formData.append('resumeFile', resumeFile)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resume-review`
, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      const scoreMatch = data.feedback?.match(/score\s*[:\-]?\s*(\d{1,3})/i)
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : null

      setScore(extractedScore)
      setFeedback(data.feedback || 'No feedback provided.')
    } catch (error) {
      setFeedback('An error occurred while checking your resume.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFix = async () => {
    if (!jobDescription || !resumeFile) return

    setLoading(true)
    setIsCheckingScore(false)
    setFeedback('')
    setScore(null)

    try {
      const formData = new FormData()
      formData.append('jobDescription', jobDescription)
      formData.append('resumeFile', resumeFile)
      formData.append('optimize', 'true')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resume-review`
, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      // If suggestions are returned as a list (recommended)
      if (Array.isArray(data.recommendations)) {
        setFeedback(data.recommendations)
      } else {
        setFeedback(data.feedback || 'No optimization suggestions returned.')
      }
    } catch (error) {
      setFeedback('An error occurred while optimizing your resume.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen py-10 px-6 font-sans text-white">
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row gap-10">

        {/* LEFT */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Job Description</label>
            <textarea
              className="w-full h-48 mt-2 p-4 bg-[#2A2A2A] rounded-xl text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            {!jobDescription && (
              <p className="text-xs text-red-500 mt-1">This field is required.</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="mt-2 text-sm bg-[#2A2A2A] p-3 rounded-xl w-full file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:opacity-90"
            />
            {resumeFile ? (
              <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                <FileCheck2 size={16} /> {resumeFile.name}
              </div>
            ) : (
              <p className="text-xs text-red-500 mt-1">Please upload a PDF resume.</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              onClick={handleCheckScore}
              disabled={!jobDescription || !resumeFile || loading}
              className={`w-full md:w-fit px-6 py-2 rounded-xl font-medium transition ${
                !jobDescription || !resumeFile || loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:opacity-90'
              }`}
            >
              {loading && isCheckingScore ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Analyzing...
                </div>
              ) : (
                'Check My Score'
              )}
            </button>

            <button
              onClick={handleFix}
              disabled={!jobDescription || !resumeFile || loading}
              className={`w-full md:w-fit px-6 py-2 rounded-xl font-medium transition ${
                !jobDescription || !resumeFile || loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-primary hover:opacity-90'
              }`}
            >
              {loading && !isCheckingScore ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Optimizing...
                </div>
              ) : (
                'Fix My Resume'
              )}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-[380px] flex flex-col gap-6 mt-8">
          {score !== null && (
            <div className="bg-[#2A2A2A] p-6 rounded-xl shadow-lg transition-all duration-500">
              <h2 className="text-lg font-semibold mb-2">Match Score</h2>
              <p className="text-4xl font-bold text-green-400">{score}%</p>
              <p className="text-sm mt-2 text-muted-foreground">
                {score >= 80
                  ? 'Excellent match! Your resume aligns well with the job requirements.'
                  : score >= 60
                  ? 'Good match, but could use some improvements.'
                  : 'Needs significant improvements to better match the job description.'}
              </p>
            </div>
          )}

          {feedback && (
            <div className="bg-[#2A2A2A] p-6 rounded-xl shadow-lg transition-all duration-500">
              <h2 className="text-lg font-semibold mb-2">
                {isCheckingScore ? 'Analysis' : 'Optimization Suggestions'}
              </h2>
              {Array.isArray(feedback) ? (
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {feedback}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
