import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { sign as jwtSign } from 'jsonwebtoken';
import { env } from 'process';
import { compareSync, hashSync } from 'bcrypt';

import {
  FindUsersDTO,
  LoginUserDTO,
  RegisterUserDTO,
} from '../../dtos/users.dto';
import { UsersService } from '../../services/users/users.service';
import { AuthGuard } from '../../guards/auth.gaurd';

@Controller({
  version: 'v1',
  path: 'users',
})
@ApiTags('Users Endpoints')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('list-users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all users list api' })
  @ApiBody({
    type: FindUsersDTO,
    description: '',
  })
  async listUsers(@Body() body: FindUsersDTO) {
    try {
      const skip = (body.pageNo - 1) * body.limit;

      const usersList = await this.usersService.getAllMongoUsers(
        body.limit,
        skip,
        body.filter,
        body.sort,
      );

      return {
        data: usersList,
        status: 200,
        mesaage: 'Success!',
      };
    } catch (error) {
      console.log('listUsers error:', error);

      return {
        data: null,
        status: 400,
        message: 'Registration failed!',
      };
    }
  }

  @Put('register')
  @ApiOperation({ summary: 'User Register api' })
  @ApiBody({
    type: RegisterUserDTO,
    description: '',
  })
  async registerUser(@Body() body: RegisterUserDTO) {
    try {
      /* check account already exist or not */
      const foundUser = await this.usersService.findUser({
        $or: [
          { email: body.email },
          { phone: body.phone },
          { username: body.username },
        ],
      });

      let existAccountMessage = '';
      if (foundUser) {
        if (body.email === foundUser.email) {
          existAccountMessage = `Account with email ${body.email}`;
        } else if (body.phone === foundUser.phone) {
          existAccountMessage = `Account with phone number ${body.phone}`;
        } else if (body.username === foundUser.username) {
          existAccountMessage = `Account with username ${body.username}`;
        }
      }

      if (existAccountMessage.length) {
        return {
          data: null,
          status: 400,
          message: `${existAccountMessage}, is already exist. try unique one!`,
        };
      }

      const hashedPassword = hashSync(body.password, 10);

      const userdata = await this.usersService.createMongoUser({
        ...body,
        password: hashedPassword,
      });

      return {
        data: userdata,
        status: 400,
        message: 'User registered successfully!',
      };
    } catch (error) {
      console.log('registerUser error:', error);

      return {
        data: null,
        status: 400,
        message: error?.response?.error || 'Login failed!',
      };
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login api' })
  @ApiBody({
    type: LoginUserDTO,
    description: '',
  })
  async loginUser(@Body() body: LoginUserDTO) {
    try {
      // console.log(body);

      const userData = await this.usersService.findUserByEmail(body.email, {
        __v: 0,
      });

      if (!userData?.email) {
        return {
          data: null,
          status: 400,
          message: `Account with email ${body.email}, does not exist!`,
        };
      }

      const isCorrectPassword = compareSync(body.password, userData.password);

      if (!isCorrectPassword) {
        return {
          data: null,
          status: 400,
          message: 'Password not match!',
        };
      }

      userData.password = null;
      delete userData.password;

      return {
        data: {
          token: jwtSign(
            { ...userData, _id: userData._id.toString() },
            env.JWT_SECRET_KEY,
          ),
          userData,
        },
        status: 200,
        message: 'Login success!',
      };
    } catch (error) {
      console.log('loginUser error:', error);

      return {
        data: null,
        status: 400,
        message: error.mesaage || error?.response?.error || 'Login failed!',
      };
    }
  }
}
