

# AI Mentor Web Application

A full-stack intelligent learning and career guidance platform with a modern, minimal design. Users select their interests and skill level, then interact with AI-powered features for personalized mentorship — no login required.

---

## 1. Landing / Onboarding Page
- Clean hero section explaining the platform's purpose
- Interest selection (e.g., Web Development, Data Science, Machine Learning, Design, etc.) with visual cards
- Difficulty level picker: Beginner, Intermediate, Advanced
- "Start Learning" button that saves selections and navigates to the dashboard

## 2. Dashboard
- Sidebar or tab navigation with four main sections: **Chat**, **Roadmap**, **Quiz**, **Progress**
- Displays the user's selected interest and level at the top
- Ability to change interest/level at any time

## 3. AI Chat Interface
- Conversational chatbot powered by Lovable AI (Gemini model) for mentorship guidance
- Streaming responses with typing animation effect
- Controls for adjusting AI creativity (temperature) and response length
- Voice input support using the browser's Web Speech API
- Markdown rendering for formatted AI responses
- Chat history maintained within the session

## 4. Dynamic Roadmap Generator
- AI generates a customized, step-by-step learning path based on the user's interest and skill level
- Visual roadmap display with phases/milestones (timeline or card-based layout)
- Each milestone includes topic title, description, and suggested resources
- Option to regenerate or adjust the roadmap

## 5. Quiz Module
- AI generates topic-specific quiz questions based on user's interest and level
- Multiple-choice format with instant feedback (correct/incorrect + explanation)
- Tracks score within the session
- Option to generate new quizzes on different subtopics

## 6. Progress Analyzer
- Tracks quiz scores, topics explored via chat, and roadmap completion
- Visual charts (using Recharts) showing performance over time
- AI-generated feedback on strengths and areas for improvement
- Summary cards with key metrics (quizzes taken, accuracy, topics covered)

## 7. Backend (Lovable Cloud)
- Edge functions for each AI feature: chat, roadmap generation, quiz generation, and progress analysis
- All powered by Lovable AI gateway with structured prompts
- Session-based data stored in local state (no database needed initially)

## Design
- Modern & minimal: clean white backgrounds, subtle shadows, professional typography
- Responsive layout for desktop and mobile
- Smooth transitions and micro-animations

