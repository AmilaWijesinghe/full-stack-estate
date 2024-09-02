import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addPost(createPostDto, tokenUserId: string) {
    try {
      const { postData, postDetail } = createPostDto;

      const newPost = await this.databaseService.post.create({
        data: {
          ...postData,
          userId: tokenUserId,
          postDetail: {
            create: postDetail,
          },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: newPost,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create post',
      };
    }
  }

  async getPosts(city, type, property, bedroom, maxPrice, minPrice) {
    try {
      const posts = await this.databaseService.post.findMany({
        where: {
          city: city || undefined,
          type: type || undefined,
          property: property || undefined,
          bedroom: bedroom ? parseInt(bedroom) : undefined,
          price: {
            gte: minPrice ? parseInt(minPrice) : undefined,
            lte: maxPrice ? parseInt(maxPrice) : undefined,
          },
        },
      });
      return {
        statusCode: HttpStatus.OK,
        data: posts,
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create post',
      };
    }
  }

  async getPost(id: string, tokenUserId: string) {
    try {
      const post = await this.databaseService.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });

      const saved = await this.databaseService.savedPost.findUnique({
        where: {
          userId_postId: {
            postId: id,
            userId: tokenUserId,
          },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: { ...post, isSaved: saved ? true : false },
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create post',
      };
    }
  }

  updatePost(id: string) {
    return `This action updates a #${id} post`;
  }

  async deletePost(id: string, tokenUserId: string) {
    try {
      const post = await this.databaseService.post.findUnique({
        where: { id },
      });

      if (post.userId !== tokenUserId) {
        throw new ForbiddenException('Not Authorized!');
      }

      await this.databaseService.post.delete({
        where: { id },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Post deleted',
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create post',
      };
    }
  }
}
