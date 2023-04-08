import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import jwtDecode from 'jwt-decode';
import { ObjectId } from 'mongodb';
import {
  Body,
  Controller,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import {
  CreatePostDTO,
  ListPostsDTO,
  UpdatePostDTO,
} from '../../dtos/posts.dto';
import { PostsService } from '../../services/posts/posts.service';
import { AuthGuard } from '../../guards/auth.gaurd';
import { postStatusEnum } from '../../schemas/posts.schema';

@Controller({
  version: 'v1',
  path: 'posts',
})
@ApiTags('Posts Endpoints')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Put('create')
  async createPost(@Body() body: CreatePostDTO, @Headers() headers) {
    try {
      const { authorization } = headers;

      const payload = jwtDecode(authorization.split(' ')[1]) as any;

      const userId = payload._doc._id;

      await this.postsService.createPost({
        ...body,
        createdBy: new ObjectId(userId),
        status: postStatusEnum.inactive,
      });

      return {
        status: 200,
        mesaage: 'Post Creation Success!',
      };
    } catch (error) {
      console.log('createPost error:', error);
      return {
        status: 200,
        mesaage: 'Post creation success!',
      };
    }
  }

  @Patch('update/:id')
  async updatePost(
    @Body() serchBody: UpdatePostDTO,
    @Param('id') postId: string,
  ) {
    try {
      await this.postsService.patchPost(postId, serchBody);
      return {
        status: 200,
        mesaage: 'Post updation success!',
      };
    } catch (error) {
      console.log('updatePost error:', error);
      return {
        data: null,
        status: 400,
        message: 'Post updation failed!',
      };
    }
  }

  @Post('list')
  async listPosts(@Body() body: ListPostsDTO) {
    try {
      const skip = (body.pageNo - 1) * body.limit;

      const paginatedData = await this.postsService.getAllPosts(
        body.limit,
        skip,
        body.filter,
        body.sort,
      );

      return {
        status: 200,
        mesaage: 'Post Updation Success!',
        data: paginatedData,
      };
    } catch (error) {
      console.log('listPosts error:', error);
      return {
        data: null,
        status: 400,
        message: 'Post listing failed!',
      };
    }
  }
}
