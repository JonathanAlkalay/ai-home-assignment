import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create(createPostDto, req.user['id']);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserPosts(@Req() req: Request) {
    return this.postsService.findAll(req.user['id']);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.findPublicPost(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request
  ) {
    return this.postsService.update(+id, updatePostDto, req.user['id']);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.remove(+id, req.user['id']);
  }

  @Patch(':id/draft')
  @UseGuards(JwtAuthGuard)
  async updateDraftStatus(
    @Param('id') id: string,
    @Body('isDraft') isDraft: boolean,
    @Req() req: Request
  ) {
    return this.postsService.updateDraftStatus(+id, req.user['id'], isDraft);
  }
} 