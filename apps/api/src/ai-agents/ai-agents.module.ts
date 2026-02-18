import { Module } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { AiAgentsController } from './ai-agents.controller';

@Module({
  providers: [AiAgentsService],
  controllers: [AiAgentsController],
  exports: [AiAgentsService],
})
export class AiAgentsModule {}
