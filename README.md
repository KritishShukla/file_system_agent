# 🤖 Gemini File Agent - NestJS AI Assistant

A NestJS application that acts as an AI agent using LangChain and Google Gemini API to understand user commands and perform secure file system operations within a sandboxed local directory.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Build & Run Commands](#build--run-commands)
- [API Usage](#api-usage)
- [Security Features](#security-features)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Secure File Operations**: Create, Read, Update, Delete, and List files within a sandboxed directory
- **AI-Powered**: Uses Google Gemini API with LangChain for natural language processing
- **Path Traversal Protection**: Prevents `../` attacks and confines operations to workspace
- **REST API**: Single POST endpoint for natural language commands
- **Input Validation**: DTOs with class-validator for request validation
- **Environment Configuration**: Secure API key management

## 🏗️ Project Structure

```
/src
├── main.ts                           # App entry point with validation
├── app.module.ts                     # Root application module
├── common/
│   └── constants/
│       └── workspace.constants.ts    # Sandboxed workspace path
├── config/
│   ├── config.module.ts             # Global config module
│   └── config.service.ts            # Gemini API key management
└── modules/
    ├── 1-tools/                     # Agent capabilities
    │   ├── files.service.ts         # Core file system logic
    │   ├── files.tool.ts            # LangChain tool wrappers
    │   └── tools.module.ts          # Tools module
    └── 2-agent/                     # Agent orchestration
        ├── agent.controller.ts      # REST API endpoint
        ├── agent.service.ts         # LangChain agent logic
        ├── agent.module.ts          # Agent module
        └── dto/
            └── command.dto.ts       # Input validation
```

## 📋 Prerequisites

- Node.js (v18.17.0 or higher)
- npm (v10.8.0 or higher)
- Google Gemini API key

## 🚀 Installation

1. **Navigate to project directory:**
   ```bash
   cd gemini-file-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Create environment file:**
   ```bash
   # Create .env file in the root directory
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

2. **Verify .env file exists:**
   ```bash
   ls -la .env
   ```

## 🔧 Build & Run Commands

### **Development Workflow Commands**

#### **1. Build the Project**
```bash
# Standard build
npm run build

# Build with increased memory (if you encounter memory issues)
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### **2. Run the Application**

**Development Mode (with hot reload) - RECOMMENDED:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run start:prod
```

**Standard Mode:**
```bash
npm run start
```

### **Complete Build & Run Sequence**

For a fresh build and run after making changes:

```bash
# Navigate to project
cd gemini-file-agent

# Build the project
npm run build

# Start in development mode
npm run start:dev
```

### **Quick Development Cycle**

If you're actively developing and making frequent changes:

```bash
# Just run this - it will automatically rebuild on file changes
npm run start:dev
```

## 🌐 API Usage

### **Endpoint**
- **URL:** `http://localhost:3000/agent/command`
- **Method:** `POST`
- **Content-Type:** `application/json`

### **Request Format**
```json
{
  "command": "your natural language command here"
}
```

### **Example Commands**

#### **List Files**
```bash
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "list all files in the workspace"}'
```

#### **Create File**
```bash
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "create a file called hello.txt with content Hello World"}'
```

#### **Read File**
```bash
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "read the contents of hello.txt"}'
```

#### **Update File**
```bash
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "update hello.txt with new content: This is updated!"}'
```

#### **Delete File**
```bash
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "delete the hello.txt file"}'
```

### **Response Format**
```json
{
  "result": "AI agent response with operation result"
}
```

## 🔒 Security Features

- **Sandboxed Environment**: All file operations restricted to `file_agent_workspace/` directory
- **Path Validation**: `getSafePath()` method prevents directory traversal attacks
- **Input Sanitization**: Removes dangerous characters and validates file paths
- **AI Safety**: The agent recognizes and refuses malicious requests

### **Security Test Example**
```bash
# This will be blocked by the security system
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "create a file called ../../../malicious.txt"}'
```

## 🔄 Development Workflow

### **Most Common Development Commands**

For day-to-day development:

1. **Make changes to code**
2. **Run:** `npm run start:dev` (if not already running)
3. **Test your changes** via API calls

The development server will automatically rebuild when you save files.

### **File Watching**
The `npm run start:dev` command includes file watching, so you don't need to manually restart the server when making code changes.

## 🛠️ Troubleshooting

### **Build Issues**

**Clean build:**
```bash
rm -rf dist/
npm run build
```

**Build with more memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### **Application Issues**

**Kill existing process:**
```bash
pkill -f "npm run start:dev"
```

**Start fresh:**
```bash
npm run start:dev
```

**Check if application is running:**
```bash
curl -X GET http://localhost:3000
```

### **Environment Issues**

**Verify environment variables:**
```bash
cat .env
```

**Check workspace directory:**
```bash
ls -la file_agent_workspace/
```

### **Common Error Solutions**

1. **"GEMINI_API_KEY is not configured"**
   - Ensure `.env` file exists with valid API key
   - Restart the application after adding the key

2. **"Port 3000 already in use"**
   - Kill existing processes: `pkill -f "npm run start:dev"`
   - Or use a different port: `PORT=3001 npm run start:dev`

3. **Memory issues during build**
   - Use: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`

## 📝 Available npm Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with file watching
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## 🎯 Quick Start

```bash
# 1. Navigate to project
cd gemini-file-agent

# 2. Install dependencies
npm install

# 3. Set up environment
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Build and run
npm run build
npm run start:dev

# 5. Test the application
curl -X POST http://localhost:3000/agent/command \
  -H "Content-Type: application/json" \
  -d '{"command": "list all files in the workspace"}'
```

## 📄 License

This project is for educational and development purposes.

---

**Happy coding! 🚀**
