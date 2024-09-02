import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers() {
    try {
      return await this.databaseService.user.findMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to fetch data');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { password, avatar, ...inputs } = updateUserDto;
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });

      if (!user) throw new NotFoundException('use not found');

      let updatedPassword;
      if (password) updatedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await this.databaseService.user.update({
        where: { id },
        data: {
          ...inputs,
          password: updatedPassword,
          avatar,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = updatedUser;
      return { rest };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update');
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.databaseService.user.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete');
    }
  }

  async savePost(userId: string, postId: string) {
    try {
      const savedPost = await this.databaseService.savedPost.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (savedPost) {
        await this.databaseService.savedPost.delete({
          where: {
            id: savedPost.id,
          },
        });
        return { message: 'Post removed from saved list' };
      } else {
        await this.databaseService.savedPost.create({
          data: {
            userId,
            postId,
          },
        });
        return { message: 'Post saved' };
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to toggle saved post status',
      );
    }
  }

  async profilePosts(userId: string) {
    try {
      const userPosts = await this.databaseService.post.findMany({
        where: { userId },
      });

      const saved = await this.databaseService.savedPost.findMany({
        where: { userId },
        include: {
          post: true,
        },
      });

      const savedPosts = saved.map((item) => item.post);

      return { userPosts, savedPosts };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get profile posts');
    }
  }

  async getNotificationNumber(userId: string) {
    try {
      return await this.databaseService.chat.count({
        where: {
          userIDs: {
            hasSome: [userId],
          },
          NOT: {
            seenBy: {
              hasSome: [userId],
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to get getNotificationNumber',
      );
    }
  }
}
