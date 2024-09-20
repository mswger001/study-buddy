

# Study Buddy Application

## Overview

The **Study Buddy** application is designed to help students improve their learning experience through interactive quizzes. The app generates multiple-choice questions based on engaging lesson stories, allowing users to test their knowledge in a fun and effective way. This app is particularly useful for students studying various subjects, including math and science.

## Features

- **Dynamic Question Generation**: Utilizes Google Generative AI to create multiple-choice questions based on a generated lesson story.
- **Audio Read-Aloud**: Allows users to listen to the lesson story, enhancing understanding and retention.
- **Interactive Quiz**: Users can select answers, receive immediate feedback, and view explanations for correct answers.
- **Progress Tracking**: Tracks user answers and provides results at the end of the quiz, highlighting correct and incorrect responses.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For static type checking and improved code quality.
- **Google Generative AI**: For generating questions based on lesson stories.
- **Speech Synthesis API**: For reading lesson stories aloud.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/study-buddy.git
   cd study-buddy
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Replace the `apiKey` variable in the `QuizApp` component with your Google API key.

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the app.

## Usage

1. Read the lesson story presented at the beginning of the quiz.
2. Click the "Play" button to listen to the story being read aloud.
3. After listening, click "Start Quiz" to begin answering questions.
4. Select an answer for each question and submit your response.
5. View your results at the end of the quiz, including correct answers and explanations.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests for any improvements or bug fixes.
