import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CommandDto } from './dto/command.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('command')
  async executeCommand(@Body() commandDto: CommandDto): Promise<{ result: string }> {
    const result = await this.agentService.run(commandDto.command);
    return { result };
  }
}
