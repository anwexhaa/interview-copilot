'use client'

import { useState } from 'react'
import { Loader2, FileCheck2 } from 'lucide-react'

export default function ResumeReview() {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCheckingScore, setIsCheckingScore] = useState(false)

  const handleCheckScore = async () => {
    if (!jobDescription || !resumeFile) return

    setLoading(true)
    setIsCheckingScore(true)
    setFeedback('')
    setScore(null)

    setTimeout(() => {
      setScore(78)
      setFeedback(
        'Your resume matches most keywords, but try to align responsibilities with job requirements and add measurable impact.'
      )
      setLoading(false)
    }, 1800)
  }

  const handleFix = async () => {
    if (!jobDescription || !resumeFile) return

    setLoading(true)
    setIsCheckingScore(false)
    setFeedback('')
    setScore(null)

    setTimeout(() => {
      setScore(92)
      setFeedback(
        'We optimized your resume by:\n- Aligning keywords with the job description\n- Adding quantifiable achievements\n- Improving action verbs'
      )
      setLoading(false)
    }, 2500)
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

        {/* RIGHT - Aligned with text box */}
        <div className="w-full md:w-[380px] flex flex-col gap-6 mt-8"> {/* Added mt-8 to push down */}
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
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}