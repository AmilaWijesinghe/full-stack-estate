import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    ChatModule,
    MessageModule,
    PostModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
