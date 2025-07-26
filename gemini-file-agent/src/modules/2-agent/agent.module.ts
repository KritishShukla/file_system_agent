import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { ConfigModule } from '../../config/config.module';
import { ToolsModule } from '../1-tools/tools.module';

@Module({
  imports: [ConfigModule, ToolsModule],
  providers: [AgentService],
  controllers: [AgentController],
})
export class AgentModule {}
