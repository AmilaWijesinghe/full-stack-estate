import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createAuthDto.password, saltOrRounds);
    const user = await this.databaseService.user.create({
      data: {
        email: createAuthDto.email,
        username: createAuthDto.username,
        password: hash,
      },
    });

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginUserDto) {
    const { username, password } = loginDto;

    try {
      // Check if the user exists
      const user = await this.databaseService.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials!');
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credentials!');
      }

      // Generate JWT token
      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload);

      // Remove password from user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, createdAt, chatIDs, ...userInfo } = user;
      return {
        user: userInfo,
        token,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      console.error(err);
      throw new InternalServerErrorException('Failed to login!');
    }
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.databaseService.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async findOne(id: any) {
    try {
      return this.databaseService.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to login!');
    }
  }
}
