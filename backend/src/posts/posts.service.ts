import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class PostsService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('openai.apiKey'),
    });
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    
    return this.postsRepository.save(post);
  }

  async findAll(userId: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number, userId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Update the post properties
    post.title = updatePostDto.title;
    post.content = updatePostDto.content;

    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postsRepository.remove(post);
  }

  async findPublicPost(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, isDraft: false },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async updateDraftStatus(id: number, userId: number, isDraft: boolean): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    post.isDraft = isDraft;
    return this.postsRepository.save(post);
  }
} 