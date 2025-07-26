import { Injectable } from '@nestjs/common';
import { DynamicTool } from 'langchain/tools';
import { FilesService } from './files.service';

@Injectable()
export class FilesTool {
  constructor(private readonly filesService: FilesService) {}

  getTools(): DynamicTool[] {
    return [
      new DynamicTool({
        name: 'create_file',
        description: 'Create a new file with the specified content. Input should be JSON with filename and content properties.',
        func: async (input: string) => {
          try {
            const { filename, content } = JSON.parse(input);
            return await this.filesService.createFile(filename, content);
          } catch (error) {
            return `Error parsing input: ${error.message}`;
          }
        },
      }),

      new DynamicTool({
        name: 'read_file',
        description: 'Read the content of an existing file. Input should be JSON with filename property.',
        func: async (input: string) => {
          try {
            const { filename } = JSON.parse(input);
            return await this.filesService.readFile(filename);
          } catch (error) {
            return `Error parsing input: ${error.message}`;
          }
        },
      }),

      new DynamicTool({
        name: 'update_file',
        description: 'Update an existing file with new content. Input should be JSON with filename and content properties.',
        func: async (input: string) => {
          try {
            const { filename, content } = JSON.parse(input);
            return await this.filesService.updateFile(filename, content);
          } catch (error) {
            return `Error parsing input: ${error.message}`;
          }
        },
      }),

      new DynamicTool({
        name: 'delete_file',
        description: 'Delete an existing file. Input should be JSON with filename property.',
        func: async (input: string) => {
          try {
            const { filename } = JSON.parse(input);
            return await this.filesService.deleteFile(filename);
          } catch (error) {
            return `Error parsing input: ${error.message}`;
          }
        },
      }),

      new DynamicTool({
        name: 'list_files',
        description: 'List all files in the workspace. No input required.',
        func: async () => {
          return await this.filesService.listFiles();
        },
      }),
    ];
  }
}
