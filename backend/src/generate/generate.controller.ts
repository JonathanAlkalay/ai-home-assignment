import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateService } from './generate.service';
@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  generateContent(@Body() data: { topic: string; style: string }) {
    return this.generateService.generateContent(data.topic, data.style);
  }
} 