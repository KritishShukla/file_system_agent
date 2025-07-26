import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ToolsModule } from './modules/1-tools/tools.module';
import { AgentModule } from './modules/2-agent/agent.module';

@Module({
  imports: [ConfigModule, ToolsModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
