# Reddit Community Finder 🔍

AI-powered Reddit community finder with multi-step search capabilities. Discover the perfect subreddit for your interests through conversational AI powered by OpenRouter and Gemini.

## ✨ Features

- 🤖 **Multi-Step AI Search** - AI intelligently refines searches across multiple iterations to find the best communities
- 🔍 **Reddit Community Finder** - Search and discover subreddits based on topics and interests
- 📊 **Community Results Display** - Beautiful presentation of communities with subscriber counts, descriptions, and metadata
- 💬 **Real-time Streaming Chat UI** - Interactive chat interface with streaming responses inspired by anysearch

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- Reddit API credentials (optional, for higher rate limits)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/filiksyos/reddit-community-finder.git
   cd reddit-community-finder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys:
   ```env
   # Required
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Optional (default: google/gemini-2.5-pro)
   AI_MODEL=google/gemini-2.5-pro
   
   # Optional (for higher rate limits)
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Setup

### OpenRouter API (Required)

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create an account and generate an API key
3. Add the key to your `.env.local` file

### Reddit API (Optional)

Without Reddit credentials, the app uses anonymous access with lower rate limits. For better performance:

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new app (select "script" type)
3. Copy the Client ID and Client Secret to your `.env.local`

## 🏗️ Architecture

This MVP follows the architecture patterns from [filiksyos/anysearch](https://github.com/filiksyos/anysearch):

- **Framework**: Next.js 15 with App Router and Turbopack
- **AI Integration**: Vercel AI SDK with OpenRouter provider
- **Streaming**: Real-time streaming responses with tool execution
- **UI**: Tailwind CSS v4 with Radix UI components
- **Type Safety**: Full TypeScript support

### Multi-Step Search Flow

1. User sends a query about finding communities
2. AI uses `searchCommunities` tool to search Reddit
3. AI can refine and search multiple times
4. Results are presented using `presentCommunities` tool
5. User sees beautiful community cards with metadata

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # Chat API endpoint with tool execution
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main chat page
├── ai/
│   ├── tools/             # AI tools for search and presentation
│   └── openrouter.ts      # OpenRouter provider configuration
├── components/
│   ├── chat/              # Chat interface components
│   └── communities/       # Community display components
└── lib/
    ├── chat-context.tsx   # Chat state management
    ├── reddit-client.ts   # Reddit API client
    └── types.ts           # TypeScript types
```

## 🛠️ Technologies

- **Next.js 15.5.7** - React framework with App Router
- **React 19.1.2** - UI library
- **AI SDK 5.0.47** - Vercel AI SDK for streaming
- **OpenRouter** - AI model provider (Gemini 2.5 Pro)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TypeScript** - Type safety throughout
- **Axios** - HTTP client for Reddit API

## 💡 Usage Examples

**Finding Communities:**
- "Find me communities about web development"
- "I want to learn about AI and machine learning"
- "Show me fitness and workout communities"
- "What are good subreddits for gaming?"

**Multi-Step Refinement:**
The AI will automatically perform multiple searches to refine results:
1. Initial broad search
2. Targeted follow-up searches
3. Present the best communities from all searches

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `AI_MODEL` (optional)
   - `REDDIT_CLIENT_ID` (optional)
   - `REDDIT_CLIENT_SECRET` (optional)
4. Deploy!

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- Based on [filiksyos/anysearch](https://github.com/filiksyos/anysearch) - UI and AI SDK patterns
- Inspired by [filiksyos/AI-reddit-search](https://github.com/filiksyos/AI-reddit-search) - Reddit integration concepts
- Built with [Vercel AI SDK](https://sdk.vercel.ai/)
- Powered by [OpenRouter](https://openrouter.ai/)

---

**Made with ❤️ and AI**
