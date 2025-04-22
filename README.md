# EduMate - Teacher Tools Module

A comprehensive toolkit for teachers to enhance and streamline their educational workflows.

## Features

### Curriculum Alignment Checker
- Input curriculum standards and check alignment with teaching materials
- Score and analyze how well content matches standards
- Get suggestions for improvement

### Assignment & Rubric Generator
- Create assignments with detailed instructions
- Automatically generate rubrics based on learning objectives
- Link assignments to curriculum standards

### Differentiated Study Material Creator
- Create versions of study materials for different learning levels
- Customize content based on student abilities
- Link materials to curriculum standards

### Personalized Remediation Plan Suggestion (Coming Soon)
- Generate personalized learning plans for struggling students
- Track progress and adjust recommendations
- Include targeted resources and activities

### Class-wide Progress Analytics (Coming Soon)
- Visualize class performance with interactive charts
- Track assignment completion and scores
- Identify trends and areas needing attention

## Tech Stack

- **Frontend**: React (Vite) + JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Charting**: Recharts/Chart.js
- **PDF Generation**: jspdf

## Project Structure

```
eduMate6/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   │   └── teacher-tools/
│   │   │       ├── curriculum-alignment/
│   │   │       ├── assignment-generator/
│   │   │       └── differentiated-materials/
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Public assets
│
└── server/                 # Backend Express application
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middleware/         # Express middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── services/           # Business logic services
    └── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/eduMate6.git
   cd eduMate6
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the server directory with the following:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/eduMate
     JWT_SECRET=your_jwt_secret_here
     ```

### Running the Application

1. Start the server (from the server directory)
   ```bash
   npm run dev
   ```

2. Start the client (from the client directory)
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Implemented Features

### Curriculum Alignment Checker
The curriculum alignment tool helps teachers ensure their teaching materials align with curriculum standards. Features include:
- Add, edit, and manage curriculum standards
- Check alignment between teaching materials and standards
- Get an alignment score and improvement suggestions

### Assignment & Rubric Generator
The assignment generator allows teachers to create assignments with automatically generated rubrics:
- Create and manage assignments with detailed instructions
- Link assignments to curriculum standards
- Auto-generate rubrics based on assignment details and curriculum standards
- Search and filter assignments by various criteria

### Differentiated Study Material Creator
The differentiated study materials creator allows teachers to create learning materials for different student ability levels:
- Create and manage study materials with rich content and activities
- Generate differentiated versions of materials tailored to basic, intermediate, and advanced learners
- Link materials to curriculum standards
- Add resources and activities with varying difficulty levels
- Search and filter materials by topic, subject, grade level, and learning level

## License

This project is licensed under the MIT License. 