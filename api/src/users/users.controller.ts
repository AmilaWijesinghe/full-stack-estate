import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

// Define a custom interface for the authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string;
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('save')
  async savePost(
    @Body() body: { postId: string },
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.usersService.savePost(userId, body.postId);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('profilePosts')
  profilePosts(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.usersService.profilePosts(userId);
  }

  @Get('notification')
  getNotificationNumber(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.usersService.getNotificationNumber(userId);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
