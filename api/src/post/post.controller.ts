import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string;
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  addPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const tokenUserId = req.user.id;
    return this.postService.addPost(createPostDto, tokenUserId);
  }

  @Get()
  getPosts(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('property') property?: string,
    @Query('bedroom') bedroom?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.postService.getPosts(
      city,
      type,
      property,
      bedroom,
      maxPrice,
      minPrice,
    );
  }

  @Get(':id')
  getPost(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const tokenUserId = req.user.id;
    return this.postService.getPost(id, tokenUserId);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string) {
    return this.postService.updatePost(id);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const tokenUserId = req.user.id;
    return this.postService.deletePost(id, tokenUserId);
  }
}
