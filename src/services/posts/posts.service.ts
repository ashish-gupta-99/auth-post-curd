import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from '../../schemas/posts.schema';
import { FilterQuery, Model } from 'mongoose';
import { ObjectId, UpdateResult } from 'mongodb';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postsModal: Model<PostsDocument>,
  ) {}

  createPost(postDetails) {
    return this.postsModal.create(postDetails);
  }

  async getAllPosts(
    limit: number,
    skip: number,
    filter: any = {},
    sort: any = { _id: 1 },
    projection = { __v: 0 },
  ) {
    const [data, count] = await Promise.all([
      this.postsModal
        .find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.postsModal.find(filter).count(),
    ]);
    return {
      data,
      count,
    };
  }

  findPost(seachObject: FilterQuery<PostsDocument> = {}) {
    return this.postsModal.findOne(seachObject).exec();
  }

  patchPost(postId: string, setObject: object): Promise<UpdateResult> {
    return this.postsModal
      .updateOne({ _id: new ObjectId(postId) }, { $set: setObject })
      .exec();
  }
}
