import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, resolve, relative } from 'path';
import { WORKSPACE_DIR } from '../../common/constants/workspace.constants';

@Injectable()
export class FilesService {
  constructor() {
    // Ensure workspace directory exists
    this.ensureWorkspaceExists();
  }

  private async ensureWorkspaceExists(): Promise<void> {
    try {
      await fs.access(WORKSPACE_DIR);
    } catch {
      await fs.mkdir(WORKSPACE_DIR, { recursive: true });
    }
  }

  private getSafePath(filename: string): string {
    // Remove any path traversal attempts
    const sanitized = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
    
    if (!sanitized || sanitized.trim() === '') {
      throw new Error('Invalid filename provided');
    }

    const fullPath = resolve(join(WORKSPACE_DIR, sanitized));
    const workspaceResolved = resolve(WORKSPACE_DIR);
    
    // Ensure the resolved path is within the workspace directory
    const relativePath = relative(workspaceResolved, fullPath);
    if (relativePath.startsWith('..') || relativePath.includes('..')) {
      throw new Error('Path traversal detected. Access denied.');
    }

    return fullPath;
  }

  async createFile(filename: string, content: string): Promise<string> {
    try {
      const safePath = this.getSafePath(filename);
      await fs.writeFile(safePath, content, 'utf8');
      return `File '${filename}' created successfully.`;
    } catch (error) {
      return `Error creating file '${filename}': ${error.message}`;
    }
  }

  async readFile(filename: string): Promise<string> {
    try {
      const safePath = this.getSafePath(filename);
      const content = await fs.readFile(safePath, 'utf8');
      return `Content of '${filename}':\n${content}`;
    } catch (error) {
      return `Error reading file '${filename}': ${error.message}`;
    }
  }

  async updateFile(filename: string, content: string): Promise<string> {
    try {
      const safePath = this.getSafePath(filename);
      // Check if file exists first
      await fs.access(safePath);
      await fs.writeFile(safePath, content, 'utf8');
      return `File '${filename}' updated successfully.`;
    } catch (error) {
      return `Error updating file '${filename}': ${error.message}`;
    }
  }

  async deleteFile(filename: string): Promise<string> {
    try {
      const safePath = this.getSafePath(filename);
      await fs.unlink(safePath);
      return `File '${filename}' deleted successfully.`;
    } catch (error) {
      return `Error deleting file '${filename}': ${error.message}`;
    }
  }

  async listFiles(): Promise<string> {
    try {
      const files = await fs.readdir(WORKSPACE_DIR);
      if (files.length === 0) {
        return 'No files found in the workspace.';
      }
      return `Files in workspace:\n${files.map(file => `- ${file}`).join('\n')}`;
    } catch (error) {
      return `Error listing files: ${error.message}`;
    }
  }
}
