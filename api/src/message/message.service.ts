import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}
  async addMessage(chatId: string, tokenUserId: string, text: string) {
    try {
      // Find the chat and check if the user is a participant
      const chat = await this.databaseService.chat.findUnique({
        where: {
          id: chatId,
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
      });

      if (!chat) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Chat not found!',
        };
      }

      // Create the message
      const message = await this.databaseService.message.create({
        data: {
          text,
          chatId,
          userId: tokenUserId,
        },
      });

      // Update the chat's seenBy and lastMessage
      await this.databaseService.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: [tokenUserId],
          lastMessage: text,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: message,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to add message!',
      };
    }
  }
}
