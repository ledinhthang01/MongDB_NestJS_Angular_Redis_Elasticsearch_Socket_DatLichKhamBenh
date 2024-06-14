import { Injectable } from '@nestjs/common';
import { Post } from './enity/post.enity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ServerError, XNotFound } from 'src/utils/exception';
import { UpdatePostDTO } from './dto/updatePost.dto';
import { MAX_RECORDS } from 'src/utils/constants';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Media } from 'src/media/enity/media.enity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Media.name) private mediaModel: Model<Media>,
    private elasticService: ElasticsearchService,
  ) {}

  async createPost(id: string): Promise<any> {
    const data = await this.postModel.create({
      idAuthor: new Types.ObjectId(id),
    });

    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data._id;
  }

  async updatePost(
    idPost: string,
    updatePostDTO: UpdatePostDTO,
    file: Express.Multer.File,
  ): Promise<any> {
    updatePostDTO.avatar = file.filename;
    updatePostDTO.done = true;

    const data = JSON.parse(
      JSON.stringify(
        await this.postModel.findByIdAndUpdate(idPost, updatePostDTO, {
          new: true,
        }),
      ),
    );

    delete data._id;

    try {
      const body = await this.elasticService.exists({
        index: 'post',
        id: idPost,
      });

      if (body) {
        const dataElastic = await this.elasticService.update({
          index: 'post',
          id: idPost,
          body: {
            doc: data,
          },
        });
        return dataElastic;
      } else {
        const dataElastic = await this.elasticService.create({
          index: 'post',
          id: idPost,
          body: data,
        });
        return dataElastic;
      }
    } catch (error) {
      throw new ServerError(`Elasticsearch update failed: ${error}`);
    }
  }

  async getAllPost(query: any): Promise<any> {
    let { page = '', size = '', keyword = '' } = query;

    page = parseInt(page);
    size = parseInt(size);
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const data: any = await this.elasticService.search({
      index: 'post',
      body: {
        query: {
          bool: {
            must: keyword
              ? [
                  {
                    multi_match: {
                      query: keyword,
                      fields: ['title', 'preview'],
                    },
                  },
                ]
              : [],
            filter: [
              {
                term: {
                  done: true,
                },
              },
            ],
          },
        },
        from: (page - 1) * size,
        size: size,
        sort: [
          {
            createTime: {
              order: 'desc',
            },
          },
        ],
        _source: {
          exclude: ['content'],
        },
      },
    });

    return {
      page,
      size: data.hits.hits.length,
      keyword,
      total: data.hits.total['value'],
      data: data.hits.hits.map((hit) => ({
        ...hit._source,
        _id: hit._id,
      })),
    };
  }

  async getPostById(id: string): Promise<any> {
    const data: any = await this.elasticService.get({
      index: 'post',
      id: id,
    });

    if (!data) {
      throw new XNotFound('Post');
    }

    const dataAuthor: any = await this.elasticService.get({
      index: 'users',
      id: String(data._source['idAuthor']),
      _source: ['name', 'email', 'avatar'],
    });

    return {
      ...data._source,
      _id: data._id,
      author: { _id: data._source.idAuthor, ...dataAuthor._source },
    };
  }

  async getLatestPost(): Promise<any> {
    const data: any = await this.elasticService.search({
      index: 'post',
      body: {
        query: {
          match_all: {},
        },
        sort: [
          {
            createTime: {
              order: 'desc',
            },
          },
        ],
        size: 1,
        _source: {
          exclude: ['content'],
        },
      },
    });

    return {
      ...data.hits.hits[0]._source,
      _id: data.hits.hits[0]._id,
    };
  }

  async deletePost(id: string): Promise<any> {
    const data = await this.postModel.findByIdAndDelete(id);
    if (!data) {
      throw new XNotFound('Post');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadDir, data.avatar);

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    } else {
      throw new ServerError('Something went wrong!');
    }

    const dataMedia = await this.mediaModel.find({
      idParent: new Types.ObjectId(id),
    });

    if (!dataMedia) {
      throw new XNotFound('Media');
    }

    for (const item of dataMedia) {
      const filePath = path.join(uploadDir, item.url);

      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      } else {
        throw new ServerError('Something went wrong!');
      }
    }

    const dataMediaDB = await this.mediaModel.deleteMany({
      idParent: new Types.ObjectId(id),
    });

    if (!dataMediaDB) {
      throw new ServerError('No image');
    }

    await this.elasticService.delete({
      index: 'post',
      id: id,
    });

    return data;
  }
}
