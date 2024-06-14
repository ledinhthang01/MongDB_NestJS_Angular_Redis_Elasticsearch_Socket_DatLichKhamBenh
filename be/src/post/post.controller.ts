import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { Response } from 'express';
import { UpdatePostDTO } from './dto/updatePost.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create-post/:id')
  @UseGuards(PermissionsGuard)
  async createPost(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.postService.createPost(id);
      handleSendRequest(
        res,
        "Let's create a wonderful post!",
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('update-post/:id')
  @UseGuards(PermissionsGuard)
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          return cb(
            null,
            `${file.fieldname}-${new Date().getTime()}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async updatePost(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updatePostDTO: UpdatePostDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const data = await this.postService.updatePost(id, updatePostDTO, file);
      handleSendRequest(res, 'Successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-all-posts/')
  async getAllPost(@Res() res: Response, @Query() query: any) {
    try {
      const data = await this.postService.getAllPost(query);
      handleSendRequest(res, 'Successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-detail-post/:id')
  async getPostById(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.postService.getPostById(id);
      handleSendRequest(res, 'Get successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-latest-post')
  async getLatestPost(@Res() res: Response) {
    try {
      const data = await this.postService.getLatestPost();
      handleSendRequest(res, 'Get successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-post/:id')
  @UseGuards(PermissionsGuard)
  async deletePost(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.postService.deletePost(id);
      handleSendRequest(
        res,
        'Delete post successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
