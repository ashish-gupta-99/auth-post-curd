import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { AppService } from './app.service';

@Controller({
  version: 'v1',
})
@ApiTags('Root Endpoints')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  @ApiOperation({
    // description: 'Health Check api',
    summary: 'Health check api',
  })
  async healthCheck() {
    const collections = await this.connection.db.collections();

    console.log(collections.map((v) => v.collectionName));

    return this.appService.healthCheck();
  }
}
