import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure correct import path

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lessonStory, setLessonStory] = useState("");
  const [isReadingStory, setIsReadingStory] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFinalResults, setShowFinalResults] = useState(false);

  const apiKey = "AIzaSyC4s6cd7CQG_tm0HcjJSbKgL3o7pwgA1-Y"; // Use environment variable for the API key
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateQuestions = async (focusAreas = []) => {
    setLoading(true);
    try {
      let prompt = `
        Generate 7 multiple-choice questions from the story: ${lessonStory} ,\n in the following format:
        **Question [Number]:** [Question Text]
        * A. [Option A - Correct Answer]
        * B. [Option B]
        * C. [Option C]
        * D. [Option D]
        **Explanation:** [Brief Explanation for the Correct Answer]
        Ensure:
        * Option A is always the correct answer.
        * Include a brief explanation for each correct answer.
        * Separate each question with a blank line.
        * No blank lines between the question, options, and explanation.
      `;

      if (focusAreas.length > 0) {
        prompt += `\nFocus on these specific areas:\n* ${focusAreas.join(
          "\n* "
        )}`;
      }

      const result = await model.generateContent(prompt);
      setQuestions(
        result.response.text().split("\n\n**Question ").map(parseQuestion)
      );
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseQuestion = (questionString) => {
    const lines = questionString.trim().split("\n");
    if (lines.length < 6) {
      console.error("Invalid question format:", questionString);
      return null;
    }
    const questionText = lines[0].replace("**Question [Number]:** ", "");
    const options = lines.slice(1, 5).map((line) => line.substring(4));
    const explanation = lines[5].replace("**Explanation:** ", "");
    const correctAnswer = options[0]; // Option A is always the correct answer
    const shuffledOptions = shuffleArray(options);

    return {
      questionText,
      options: shuffledOptions,
      correctAnswer: shuffledOptions.indexOf(correctAnswer),
      explanation,
    };
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateLessonStory = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a single, short, and engaging story for animals, math, or a science lesson. Keep it suitable for a quiz. Do not ask questions here`;
      const result = await model.generateContent(prompt);
      setLessonStory(result.response.text());
    } catch (error) {
      console.error("Error generating lesson story:", error);
    } finally {
      setLoading(false);
    }
  };

  const readStoryAloud = () => {
    if (!isReadingStory && lessonStory) {
      setIsReadingStory(true);
      const utterance = new SpeechSynthesisUtterance(lessonStory);
      utterance.onend = () => setIsReadingStory(false);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
      setIsReadingStory(false);
    }
  };

  const handleAnswerChange = (event) => {
    setUserAnswer(parseInt(event.target.value, 10));
  };

  const handleSubmitAnswer = () => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: userAnswer });
    if (currentQuestionIndex === questions.length - 1) {
      setShowFinalResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(null);
    }
  };

  const handleRestartQuiz = () => {
    setShowFinalResults(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    generateQuestions();
  };

  useEffect(() => {
    generateLessonStory();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-app">
      <div className="lesson-story">
        <h2>Lesson Story</h2>
        <p>{lessonStory}</p>
        <button onClick={readStoryAloud} disabled={loading || isReadingStory}>
          {isReadingStory ? "Stop" : "Play"}
        </button>
        <button onClick={generateQuestions} disabled={loading}>
          Start Quiz
        </button>
      </div>

      {questions.length > 0 && currentQuestion && !showFinalResults && (
        <div className="question-card">
          <h3>{currentQuestion.questionText}</h3>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={userAnswer === index}
                    onChange={handleAnswerChange}
                  />{" "}
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmitAnswer} disabled={userAnswer === null}>
            {currentQuestionIndex === questions.length - 1
              ? "Submit Quiz"
              : "Next"}
          </button>
        </div>
      )}

      {showFinalResults && (
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <ul>
            {questions.map((question, index) => {
              const isCorrect = userAnswers[index] === question.correctAnswer;
              return (
                <li key={index}>
                  <p>
                    <strong>Question {index + 1}:</strong>{" "}
                    {question.questionText}
                  </p>
                  <p>
                    Your Answer: {question.options[userAnswers[index]]} (
                    {isCorrect ? "Correct" : "Incorrect"})
                  </p>
                  {!isCorrect && (
                    <p>
                      Correct Answer: {question.options[question.correctAnswer]}
                    </p>
                  )}
                  <p>Explanation: {question.explanation}</p>
                </li>
              );
            })}
          </ul>
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
