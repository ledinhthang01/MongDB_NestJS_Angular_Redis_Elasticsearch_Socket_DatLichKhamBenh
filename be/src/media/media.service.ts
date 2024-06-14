import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Media } from './enity/media.enity';
import { Model, Types } from 'mongoose';
import { UploadMediaDTO } from './dto/uploadMedia.dto';
import { ServerError, XNotFound } from 'src/utils/exception';
import * as path from 'path';
import * as fs from 'fs-extra';
import { DownloadImageDTO } from './dto/downloadImage.dto';
import axios from 'axios';

@Injectable()
export class MediaService {
  constructor(@InjectModel(Media.name) private mediaModel: Model<Media>) {}

  fileToMedia(
    uploadMediaDTO: UploadMediaDTO,
    files: Array<Express.Multer.File>,
  ): any {
    return files.map((file) => ({
      url: file.filename,
      type: uploadMediaDTO.type,
      idParent: new Types.ObjectId(uploadMediaDTO.idParent),
    }));
  }

  async uploadMediasInPost(
    uploadMediaDTO: UploadMediaDTO,
    files: Array<Express.Multer.File>,
  ): Promise<Media> {
    const data = this.fileToMedia(uploadMediaDTO, files);
    return await this.mediaModel.create(data);
  }

  async deleteImageInPostById(id: string): Promise<Media> {
    const data = await this.mediaModel.findByIdAndDelete(id);

    if (!data) {
      throw new XNotFound('Image');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');

    const filePath = path.join(uploadDir, data.url);

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    } else {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async getAllImagesInPost(id: string): Promise<Media[]> {
    const data = await this.mediaModel.find({
      idParent: new Types.ObjectId(id),
    });
    if (!data) {
      throw new XNotFound('Image');
    }
    return data;
  }

  async downloadImage(downloadImageDTO: DownloadImageDTO): Promise<Media> {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    const response = await axios.get(downloadImageDTO.url, {
      responseType: 'stream',
    });
    downloadImageDTO.url = `media-${new Date().getTime()}.jpg`;
    const filePath = path.join(uploadDir, downloadImageDTO.url);
    await fs.ensureDir(uploadDir);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const data = await this.mediaModel.create(downloadImageDTO);
    if (!data) {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      const filePath = path.join(uploadDir, downloadImageDTO.url);

      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      } else {
        throw new ServerError('Something went wrong!');
      }
      throw new ServerError('Something went wrong!');
    }
    return data;
  }
}
