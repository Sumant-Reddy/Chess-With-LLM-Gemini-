# Chess with LLM (Gemini)

A modern chess game that combines traditional chess gameplay with the power of Large Language Models (LLM) using Google's Gemini AI. This project offers an interactive chess experience where players can play against an AI opponent that uses natural language processing to understand and respond to moves.

## Features

- 🎮 Interactive chess board with modern UI
- 🤖 AI opponent powered by Google's Gemini LLM
- 🎯 Real-time move validation and game state management
- 🎨 Beautiful and responsive design
- ⚙️ Customizable AI settings
- 📊 Captured pieces display
- 👥 Player name customization
- 🎯 Start screen with game options

## Tech Stack

- React.js
- Redux Toolkit for state management
- Vite for build tooling
- Google Gemini API for AI integration
- CSS3 for styling
- Chess.js for chess logic

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Sumant-Reddy/Chess-With-LLM-Gemini-.git
cd Chess-With-LLM-Gemini-
```

2. Install dependencies:
```bash
npm install
cd server
npm install
cd ..
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. In a separate terminal, start the backend server:
```bash
cd server
npm start
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── store/             # Redux store and slices
│   ├── utils/             # Utility functions
│   └── App.jsx            # Main application component
├── server/                # Backend server
├── public/                # Static assets
└── package.json          # Project dependencies
```

## Usage

1. Launch the application
2. Enter player names on the start screen
3. Choose your preferred color (white/black)
4. Start playing chess against the AI
5. The AI will analyze your moves and respond using the Gemini LLM

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for providing the LLM capabilities
- Chess.js for the chess logic implementation
- React and Redux communities for the amazing tools and libraries

## Contact

For any questions or feedback, please open an issue in the GitHub repository.
