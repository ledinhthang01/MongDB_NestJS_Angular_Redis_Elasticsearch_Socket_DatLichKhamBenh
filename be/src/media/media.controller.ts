import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { Request, Response } from 'express';
import { PermissionsGuard } from 'src/guard/permissions.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadMediaDTO } from './dto/uploadMedia.dto';
import { DownloadImageDTO } from './dto/downloadImage.dto';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload-media-in-post')
  @UseGuards(PermissionsGuard)
  @UseInterceptors(
    FilesInterceptor('media', 10, {
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
  async uploadMediasInPost(
    @Res() res: Response,
    @Body() uploadMediaDTO: UploadMediaDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const data = await this.mediaService.uploadMediasInPost(
        uploadMediaDTO,
        files,
      );
      handleSendRequest(
        res,
        'Upload images successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('/delete-image-in-post-by-id/:id')
  @UseGuards(PermissionsGuard)
  async deleteImageInPostById(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.mediaService.deleteImageInPostById(id);
      handleSendRequest(
        res,
        'Delete image successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('/get-all-images-in-post/:id')
  async getAllImagesInPost(@Res() res: Response, @Param('id') id: string) {
    try {
      const data = await this.mediaService.getAllImagesInPost(id);
      handleSendRequest(
        res,
        'Get all images successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Post('/download-image')
  async downloadImage(
    @Res() res: Response,
    @Body() downloadImageDTO: DownloadImageDTO,
  ) {
    try {
      const data = await this.mediaService.downloadImage(downloadImageDTO);
      handleSendRequest(
        res,
        'Download image successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
