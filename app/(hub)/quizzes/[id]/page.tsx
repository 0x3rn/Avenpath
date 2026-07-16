"use client";

import { useState, useEffect } from "react";
import { getQuizById, submitQuizAttempt } from "@/app/actions/quizzes";
import { ArrowRight, CheckCircle2, XCircle, Trophy, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function QuizTakingPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string);

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getQuizById(quizId).then(data => {
      setQuiz(data);
      setLoading(false);
    });
  }, [quizId]);

  if (loading) return <div className="p-12 text-center font-bold">Loading quiz...</div>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0) return <div className="p-12 text-center font-bold">Quiz not found or has no questions.</div>;

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setSubmitting(true);
      // Calculate score
      let score = 0;
      quiz.questions.forEach((q: any, i: number) => {
        if (selectedAnswers[i] === q.correctAnswer) score++;
      });
      await submitQuizAttempt(quizId, score, quiz.questions.length);
      setShowResults(true);
      setSubmitting(false);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.correctAnswer) score++;
    });
    return score;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <div className="max-w-3xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground font-medium mb-8">You scored {score} out of {quiz.questions.length}</p>
          
          <div className="text-6xl font-black mb-12" style={{ color: percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#3b82f6' : '#f97316' }}>
            {percentage}%
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => window.location.reload()} className="w-full sm:w-auto bg-muted text-foreground px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors">
              <RefreshCcw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/quizzes" className="w-full sm:w-auto bg-foreground text-background px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <Home className="w-4 h-4" /> Back to Quizzes
            </Link>
          </div>
        </div>

        {/* Review Answers */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-extrabold mb-4">Review your answers</h3>
          {quiz.questions.map((q: any, i: number) => {
            const isCorrect = selectedAnswers[i] === q.correctAnswer;
            return (
              <div key={i} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-start gap-4">
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" /> : <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />}
                  <div>
                    <h4 className="font-bold text-lg mb-2">{i + 1}. {q.questionText}</h4>
                    <p className="text-sm mb-4">
                      Your answer: <span className={isCorrect ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{q.options[selectedAnswers[i]]}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mb-4">
                        Correct answer: <span className="text-green-500 font-bold">{q.options[q.correctAnswer]}</span>
                      </p>
                    )}
                    {q.explanation && (
                      <div className="text-xs bg-background p-3 rounded-lg border border-border text-muted-foreground">
                        <span className="font-bold text-foreground">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      {/* Header & Progress */}
      <div className="mb-8">
        <Link href="/quizzes" className="text-sm font-bold text-muted-foreground hover:text-foreground mb-4 inline-block">&larr; Exit Quiz</Link>
        <h1 className="text-2xl font-extrabold mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground font-medium text-sm mb-6">{quiz.description}</p>

        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(((currentIndex) / quiz.questions.length) * 100)}% Completed</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-foreground rounded-full transition-all duration-300" style={{ width: `${((currentIndex) / quiz.questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 mb-8 shadow-sm">
        <h2 className="text-2xl font-extrabold leading-tight mb-8">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option: string, i: number) => {
            const isSelected = selectedAnswers[currentIndex] === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all ${
                  isSelected 
                    ? 'border-foreground bg-foreground/5 pl-6' 
                    : 'border-border bg-background hover:border-muted-foreground/30'
                }`}
              >
                <span className="inline-block w-6 text-muted-foreground">{String.fromCharCode(65 + i)}.</span> {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentIndex] === undefined || submitting}
          className="bg-foreground text-background px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Submitting..." : isLastQuestion ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
