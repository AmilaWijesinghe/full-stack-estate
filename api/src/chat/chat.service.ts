import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addChat(tokenUserId: string, receiverId: string) {
    try {
      const newChat = await this.databaseService.chat.create({
        data: {
          userIDs: [tokenUserId, receiverId],
        },
      });

      return {
        statusCode: HttpStatus.CREATED, // 201 Created for new resource
        data: newChat,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to add chat!',
      };
    }
  }

  async getChats(tokenUserId: string) {
    try {
      const chats = await this.databaseService.chat.findMany({
        where: {
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
      });

      // Optimize by fetching receivers in a single query
      const receiverIds = chats.map((chat) =>
        chat.userIDs.find((id) => id !== tokenUserId),
      );
      const receivers = await this.databaseService.user.findMany({
        where: { id: { in: receiverIds } },
        select: { id: true, username: true, avatar: true },
      });

      // Map receivers to chats
      const chatsWithReceivers = chats.map((chat) => {
        const receiver = receivers.find(
          (r) => r.id === chat.userIDs.find((id) => id !== tokenUserId),
        );
        return { ...chat, receiver };
      });

      return {
        statusCode: HttpStatus.OK,
        data: chatsWithReceivers,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get chats!',
      };
    }
  }

  async getChat(tokenUserId: string, chatId: string) {
    try {
      const chat = await this.databaseService.chat.findUnique({
        where: {
          id: chatId,
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      // Handle case where chat is not found
      if (!chat) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Chat not found',
        };
      }

      await this.databaseService.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: {
            push: [tokenUserId],
          },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: chat,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get chat!',
      };
    }
  }

  async readChat(chatId: string, tokenUserId: string) {
    try {
      const chat = await this.databaseService.chat.update({
        where: {
          id: chatId,
          userIDs: {
            hasSome: [tokenUserId], // Ensure user is part of the chat
          },
        },
        data: {
          seenBy: {
            set: [tokenUserId], // Mark as read by this user
          },
        },
      });

      // Check if chat exists and user has access
      if (!chat) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Chat not found or user not authorized',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Chat marked as read',
        data: chat, // Optionally return the updated chat object
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to read chat!',
      };
    }
  }
}
