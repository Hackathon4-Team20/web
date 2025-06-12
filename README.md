# Sentiment Chat Analyzer

A real-time chat application with Arabic sentiment analysis, built with React, TypeScript, and Node.js. The application provides a platform for customer service interactions with automatic sentiment analysis of Arabic messages.

## Features

- Real-time chat functionality using Socket.IO
- Arabic sentiment analysis for customer messages
- Admin dashboard with sentiment analytics
- Responsive design with RTL support
- Beautiful UI using Tailwind CSS and shadcn/ui
- Real-time sentiment visualization with charts

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd design-to-site-buddy
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install server dependencies:

```bash
cd server
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd server
node index.js
```

The server will start on http://localhost:3000

2. In a new terminal, start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:8082

## Usage

### Admin Interface

- Access the admin dashboard at http://localhost:8082/admin
- Access the admin chat interface at http://localhost:8082/admin/chat
- View sentiment analysis and chat statistics
- Monitor customer conversations in real-time

### Client Interface

- Access the client chat interface at http://localhost:8082/client
- Send messages to customer service
- Receive real-time responses

## Project Structure

```
design-to-site-buddy/
├── src/                    # React frontend source code
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   └── App.tsx           # Main application component
├── server/               # Node.js backend server
│   └── index.js         # Server implementation
├── public/              # Static files
└── package.json         # Project dependencies
```

## Key Components

### Frontend

- `AdminDashboard.tsx`: Main dashboard with analytics
- `AdminChatInterface.tsx`: Admin chat interface
- `ClientChat.tsx`: Client chat interface
- `SentimentAnalysis.tsx`: Sentiment analysis visualization

### Backend

- Real-time message handling with Socket.IO
- Arabic sentiment analysis
- Message storage and retrieval

## Sentiment Analysis

The application analyzes Arabic text using a predefined list of positive and negative words. The sentiment analysis:

- Identifies positive, negative, and neutral messages
- Calculates sentiment scores
- Provides real-time sentiment visualization
- Updates the dashboard with sentiment trends

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `App.tsx`
4. Add new server endpoints in `server/index.js`

### Styling

- The project uses Tailwind CSS for styling
- Custom components are built using shadcn/ui
- RTL support is implemented for Arabic text

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
