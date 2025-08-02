// app/interview/ai/page.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function AIInterviewPage() {
  const [questions, setQuestions] = useState<string[]>([
    'How would you design Twitter’s feed system for scalability?',
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  // Parse the AI response into feedback and next question
  const parseAIResponse = (aiMessage: string) => {
    // Example response format:
    // "Feedback:\nYour answer was great...\n\nModel Answer:\nIdeal answer...\n\nNext Question:\nHow would you design caching?"
    const nextQuestionSplit = aiMessage.split('Next Question:');
    const beforeNextQuestion = nextQuestionSplit[0] || '';
    const nextQuestion = nextQuestionSplit[1]?.trim() || 'Next question coming soon...';

    // Extract Feedback and Model Answer separately
    const feedbackMatch = beforeNextQuestion.match(/Feedback:\s*([\s\S]*?)Model Answer:/i);
    const modelAnswerMatch = beforeNextQuestion.match(/Model Answer:\s*([\s\S]*)$/i);

    return {
      feedback: feedbackMatch ? feedbackMatch[1].trim() : '',
      modelAnswer: modelAnswerMatch ? modelAnswerMatch[1].trim() : '',
      nextQuestion,
    };
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai-interview`
, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userMessage: answer,
          currentQuestion // send current question to backend
        }),
      });

      const data = await res.json();

      if (!data.aiMessage) {
        throw new Error('No AI message in response');
      }

      const { feedback: newFeedback, modelAnswer, nextQuestion } = parseAIResponse(data.aiMessage);

      setFeedback(`${newFeedback}\n\nModel Answer:\n${modelAnswer}`);

      // Replace the next question properly instead of pushing
      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentIndex + 1] = nextQuestion;
        return updated;
      });
      setCurrentIndex((prev) => prev + 1);
      setAnswer('');
    } catch (err) {
      console.error('Error fetching AI interview question:', err);
      setFeedback('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans flex h-screen w-full bg-black text-white">
      {/* Left Panel */}
      <div className="w-1/2 p-6 border-r border-neutral-800 flex flex-col justify-center">
        <h1 className="text-xl font-semibold text-pink-500 mb-4">
          Interview Copilot is asking you:
        </h1>
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-md border border-neutral-800">
          <p className="text-lg leading-relaxed">{currentQuestion}</p>
        </div>
        {feedback && (
          <div
            className="mt-6 bg-neutral-800 p-4 rounded-lg text-sm text-emerald-400 whitespace-pre-line overflow-y-auto"
            style={{ maxHeight: '40vh' }} // Limit height and enable vertical scroll
          >
            <strong>Feedback & Model Answer:</strong> <br />
            {feedback}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-6 flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg text-neutral-400 mb-2">Your Answer</h2>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-white resize-none h-40 rounded-2xl"
            placeholder="Type your response here..."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-pink-600 text-white rounded-2xl px-6 py-2 hover:bg-pink-700"
          >
            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </main>
  );
}
