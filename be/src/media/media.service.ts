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

  fileToAttachment(
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
    const data = this.fileToAttachment(uploadMediaDTO, files);
    return await this.mediaModel.create(data);
  }

  async deleteImageInPostById(id: string): Promise<Media> {
    const data = await this.mediaModel.findByIdAndDelete(id);

    if (!data) {
      throw new XNotFound('Image');
    }

    const fileName = data.url.split('/').pop();

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');

    const filePath = path.join(uploadDir, fileName);

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

  async downloadImage(downloadImageDTO: DownloadImageDTO): Promise<any> {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    const response = await axios.get(downloadImageDTO.url, {
      responseType: 'stream',
    });
    const filePath = path.join(uploadDir, `media-${new Date().getTime()}.jpg`);
    await fs.ensureDir(uploadDir);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}
