import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string;
  };
}

interface addchat extends Request {
  receiverId: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  addChat(@Body() createChatDto: addchat, @Req() req: AuthenticatedRequest) {
    const tokenUserId = req.user.id;
    const receiverId = createChatDto.receiverId;
    return this.chatService.addChat(tokenUserId, receiverId);
  }

  @Get()
  getChats(@Req() req: AuthenticatedRequest) {
    const tokenUserId = req.user.id;
    return this.chatService.getChats(tokenUserId);
  }

  @Get(':id')
  getChat(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const tokenUserId = req.user.id;
    const chatId = id;
    return this.chatService.getChat(tokenUserId, chatId);
  }

  @Patch('read/:id')
  readChat(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const chatId = id;
    const tokenUserId = req.user.id;
    return this.chatService.readChat(chatId, tokenUserId);
  }
}
