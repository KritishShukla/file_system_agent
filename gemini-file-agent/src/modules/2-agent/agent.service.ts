import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ConfigService } from '../../config/config.service';
import { FilesTool } from '../1-tools/files.tool';

@Injectable()
export class AgentService implements OnModuleInit {
  private llm: ChatGoogleGenerativeAI;
  private tools: any[];

  constructor(
    private readonly configService: ConfigService,
    private readonly filesTool: FilesTool,
  ) {}

  async onModuleInit() {
    // Initialize the Google Gemini LLM
    this.llm = new ChatGoogleGenerativeAI({
      apiKey: this.configService.getGeminiApiKey(),
      model: 'gemini-1.5-flash',
      temperature: 0,
    });

    // Get the file operation tools
    this.tools = this.filesTool.getTools();
  }

  async run(command: string): Promise<string> {
    try {
      // Create a system message that explains the available tools
      const toolDescriptions = this.tools.map(tool => 
        `- ${tool.name}: ${tool.description}`
      ).join('\n');

      const systemPrompt = `You are a helpful AI assistant that can perform file operations in a secure sandboxed environment.

Available tools:
${toolDescriptions}

When you need to use a tool, respond with exactly this format:
TOOL_CALL: tool_name
INPUT: {json input if required}

For example:
TOOL_CALL: list_files
INPUT: 

Or:
TOOL_CALL: create_file
INPUT: {"filename": "test.txt", "content": "Hello World"}

If you don't need to use any tools, just respond normally.

User request: ${command}`;

      // Get initial response from LLM
      const response = await this.llm.invoke([
        new HumanMessage(systemPrompt)
      ]);

      const responseText = response.content as string;

      // Check if the response contains a tool call
      if (responseText.includes('TOOL_CALL:')) {
        const lines = responseText.split('\n');
        let toolName = '';
        let toolInput = '';

        for (const line of lines) {
          if (line.startsWith('TOOL_CALL:')) {
            toolName = line.replace('TOOL_CALL:', '').trim();
          } else if (line.startsWith('INPUT:')) {
            toolInput = line.replace('INPUT:', '').trim();
          }
        }

        // Find and execute the tool
        const tool = this.tools.find(t => t.name === toolName);
        if (tool) {
          const toolResult = await tool.func(toolInput);
          
          // Get final response from LLM with tool result
          const finalResponse = await this.llm.invoke([
            new HumanMessage(`${systemPrompt}

Previous response: ${responseText}

Tool result: ${toolResult}

Please provide a helpful response to the user based on the tool result.`)
          ]);

          return finalResponse.content as string;
        }
      }

      return responseText;
    } catch (error) {
      return `Error executing command: ${error.message}`;
    }
  }
}
