import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify as jwtVerify } from 'jsonwebtoken';

import { env } from 'process';
import { IncomingMessage } from 'http';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: IncomingMessage = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      // console.log('headers: ', request.headers.authorization);

      if (!authorization || !authorization?.length) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Token is required!',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      let authorizationString = '';
      if (Array.isArray(authorization)) {
        authorizationString =
          authorization[0].split(' ')[1]; /* remove Bearer from token */
      } else {
        authorizationString =
          authorization.split(' ')[1]; /* remove Bearer from token */
      }

      const verified = jwtVerify(authorizationString, env.JWT_SECRET_KEY);
      if (verified) {
        return true;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid token!',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      console.log(error.message);

      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: error.response.error || error.message || 'Invalid token!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
