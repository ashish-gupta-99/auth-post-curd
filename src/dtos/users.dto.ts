import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'xyz@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 1234567890, minLength: 10 })
  phone: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'abc_xyz' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'male' })
  gender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'male' })
  password: string;
}

export class FindUsersDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, description: 'page', example: 1 })
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, description: 'limit', example: 10 })
  limit: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'filter', example: {} })
  filter: Record<string, unknown>;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: { _id: -1 },
  })
  sort: Record<string, unknown>;
}

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'xyz@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'male' })
  password: string;
}
