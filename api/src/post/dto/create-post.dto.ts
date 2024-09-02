import { IsNotEmpty, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsArray()
  postData: [];

  @IsNotEmpty()
  @IsArray()
  postDetail: [];
}
