import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import OpenAI from 'openai';

@Injectable()
export class GenerateService {
  /**
   * This service originally used OpenAI's API to generate blog posts based on a topic and style.
   * To avoid API costs and rate limits during development/testing, we're using stub data instead.
   * The interface remains the same, so we can easily switch back to the OpenAI implementation
   * by uncommenting the original code and removing the stub implementation.
   * 
   * Original implementation used:
   * - OpenAI's completions API
   * - Model: gpt-3.5-turbo-instruct
   * - Max tokens: 1000
   * - Temperature: 0.7
   */

  // private openai: OpenAI;

  constructor(private configService: ConfigService) {
    // this.openai = new OpenAI({
    //   apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    // });
  }

  async generateContent(topic: string, style: string): Promise<string> {
    // OpenAI Implementation (commented out)
    // try {
    //   const completion = await this.openai.completions.create({
    //     model: "gpt-3.5-turbo-instruct",
    //     prompt: `Write a blog post about ${topic} in ${style} style.`,
    //     max_tokens: 1000,
    //     temperature: 0.7,
    //   });
    //   return completion.choices[0].text;
    // } catch (error) {
    //   console.error('OpenAI API Error:', error);
    //   throw new Error(`Failed to generate content: ${error.message}`);
    // }

    // Stub Implementation
    // Simulate API delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return different content based on the style to simulate varied responses
    const styleIntros = {
      professional: "In today's rapidly evolving landscape,",
      casual: "Hey there! Ever wondered about",
      technical: "An in-depth analysis reveals that",
      creative: "Imagine a world where",
    };

    const intro = styleIntros[style.toLowerCase()] || "Let's explore";
    
    return `${intro} ${topic} presents fascinating opportunities and challenges.

As we delve deeper into this subject, several key points emerge. First, the impact of ${topic} cannot be understated. Recent developments have shown remarkable progress in this area, leading to innovative solutions and approaches.

Furthermore, the implications of ${topic} extend far beyond initial expectations. Experts in the field have noted significant advancements, particularly in relation to modern applications and future possibilities.

When considering ${topic}, it's crucial to understand its broader context. This perspective allows us to appreciate both the immediate benefits and long-term potential of related developments.

In conclusion, ${topic} represents a significant area of interest that continues to evolve. Whether you're a newcomer or an expert in this field, the opportunities for learning and growth are substantial.

[This is stub content for development/testing purposes. The actual implementation would generate unique, AI-powered content through OpenAI's API.]`;
  }
} 