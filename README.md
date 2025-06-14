# SEO Content Analyzer

> AI-powered SEO optimization tool that analyzes content and provides intelligent keyword suggestions with one-click insertion.

![SEO Analyzer Demo](https://img.shields.io/badge/status-active-success.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini AI for intelligent content analysis
- **Real-time SEO Metrics**: Instant scoring for SEO performance, readability, and keyword density
- **Smart Keyword Extraction**: Identifies relevant keywords with difficulty ratings and search volumes
- **One-Click Optimization**: Seamlessly insert keywords while maintaining content flow
- **Multi-Content Support**: Optimized for blog posts, social media, newsletters, and product descriptions
- **Professional Dashboard**: Clean, intuitive interface with color-coded recommendations
- **Copy & Reset Functions**: Easy content management and optimization workflow

## 📋 Table of Contents

- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Demo

### Key Functionality
1. **Content Input**: Paste any text content and select content type
2. **AI Analysis**: Get comprehensive SEO metrics and recommendations
3. **Keyword Suggestions**: View AI-extracted keywords with relevance scores
4. **Smart Insertion**: One-click keyword integration with natural placement
5. **Optimized Preview**: See your enhanced content with copy/reset options

## 🛠 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Google Gemini API key

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/seo-content-analyzer.git
cd seo-content-analyzer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env file

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 📖 Usage

### Basic Workflow

1. **Input Content**
   - Paste your text into the input area
   - Select appropriate content type (blog post, social media, newsletter, product description)
   - Click "Analyze SEO"

2. **Review Analysis**
   - Check SEO score, readability, and keyword density
   - Read optimization recommendations
   - Review suggested keywords with difficulty ratings

3. **Optimize Content**
   - Click "Insert" next to recommended keywords
   - Preview optimized content in real-time
   - Use copy button to get final optimized text
   - Reset to original if needed

### Content Types Supported

- **Blog Posts**: Long-form content optimization
- **Social Media**: Short-form content with hashtag suggestions
- **Newsletters**: Email content optimization
- **Product Descriptions**: E-commerce content enhancement

## 🔌 API Documentation

### Analyze Content
```http
POST /api/analyze
Content-Type: application/json

{
  "text": "Your content here",
  "contentType": "blog_post"
}
```

### Insert Keyword
```http
POST /api/insert-keyword
Content-Type: application/json

{
  "analysisId": 1,
  "keyword": "target keyword",
  "text": "current text"
}
```

### Get Analysis
```http
GET /api/analysis/:id
```

## 💻 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **TanStack Query** - Data fetching
- **Wouter** - Routing
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Google Gemini AI** - Content analysis

### Development Tools
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Drizzle ORM** - Database toolkit

## 📁 Project Structure

```
seo-content-analyzer/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API client
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Zod schemas and types
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🎨 Key Components

### SEO Metrics Dashboard
- Real-time scoring system
- Visual progress indicators
- Color-coded recommendations
- Performance tracking

### Keyword Management
- AI-powered extraction
- Difficulty assessment
- Volume estimation
- Context-aware suggestions

### Content Optimization
- Smart keyword placement
- Natural language preservation
- Real-time preview
- Version management

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production Gemini API key
- Set up proper security headers
- Configure CORS for your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful content analysis
- Shadcn/ui for beautiful component library
- Tailwind CSS for efficient styling
- React community for excellent ecosystem

## 📞 Support

- Create an [issue](https://github.com/yourusername/seo-content-analyzer/issues) for bug reports
- Start a [discussion](https://github.com/yourusername/seo-content-analyzer/discussions) for feature requests
- Check the [wiki](https://github.com/yourusername/seo-content-analyzer/wiki) for additional documentation

---

**Built with ❤️ for content creators worldwide**