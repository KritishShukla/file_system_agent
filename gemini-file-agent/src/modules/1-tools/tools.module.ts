import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesTool } from './files.tool';

@Module({
  providers: [FilesService, FilesTool],
  exports: [FilesTool],
})
export class ToolsModule {}
