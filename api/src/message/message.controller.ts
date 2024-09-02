import { Controller, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { MessageService } from './message.service';
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

interface createMessage extends Request {
  text: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post(':chatId')
  addMessage(
    @Body() createMessageDto: createMessage,
    @Req() req: AuthenticatedRequest,
    @Param('id') chatId: string,
  ) {
    const tokenUserId = req.user.id;
    const text = createMessageDto.text;
    return this.messageService.addMessage(chatId, tokenUserId, text);
  }
}
