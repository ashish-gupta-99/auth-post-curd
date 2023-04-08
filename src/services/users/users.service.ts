import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModal: Model<UsersDocument>,
  ) {}

  createMongoUser(userData) {
    const createdUser = new this.usersModal(userData);
    return createdUser.save();
  }

  async getAllMongoUsers(
    limit: number,
    skip: number,
    filter: any = {},
    sort: any = { _id: 1 },
    projection = { password: 0, __v: 0, _id: 0 },
  ) {
    const [data, count] = await Promise.all([
      this.usersModal
        .find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.usersModal.find(filter).count(),
    ]);
    return {
      data,
      count,
    };
  }

  findUserByEmail(
    email: string,
    projection: ProjectionType<UsersDocument> = {},
  ) {
    return this.usersModal.findOne({ email }, projection).exec();
  }

  findUser(seachObject: FilterQuery<UsersDocument> = {}) {
    return this.usersModal.findOne(seachObject).exec();
  }
}
