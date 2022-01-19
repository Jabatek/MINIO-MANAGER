import * as Minio from 'minio';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService, ISetting } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/publicSetting')
  getPublicSetting(): ISetting {
    return this.appService.getPublicSetting();
  }

  @Get('/setting')
  getSetting(): ISetting {
    return this.appService.getSetting();
  }

  @Post('/setting')
  setSetting(@Body() setting: ISetting) {
    this.appService.setSetting(setting);
  }

  @Get('/presignedPostObject/:objectName')
  presignedPostObject(
    @Param('objectName') objectName: string,
  ): Promise<Minio.PostPolicyResult> {
    return this.appService.presignedPostObject(objectName);
  }

  @Get('/presignedGetObjects')
  presignedGetObjects(): Promise<string> {
    return this.appService.presignedGetObjects();
  }

  @Get('/presignedGetObject/:objectName')
  presignedGetObject(@Param('objectName') objectName: string): Promise<string> {
    return this.appService.presignedGetObject(objectName);
  }
}
