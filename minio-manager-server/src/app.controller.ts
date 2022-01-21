import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import * as Minio from 'minio';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService, ISetting } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/publicSetting')
  getPublicSetting(): ISetting {
    return this.appService.getPublicSetting();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/setting')
  getSetting(): ISetting {
    return this.appService.getSetting();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/setting')
  setSetting(@Body() setting: ISetting) {
    this.appService.setSetting(setting);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/presignedPostObject/:objectName')
  presignedPostObject(
    @Param('objectName') objectName: string,
  ): Promise<Minio.PostPolicyResult> {
    return this.appService.presignedPostObject(objectName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/presignedGetObjects')
  presignedGetObjects(): Promise<string> {
    return this.appService.presignedGetObjects();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/presignedGetObject/:objectName')
  presignedGetObject(@Param('objectName') objectName: string): Promise<string> {
    return this.appService.presignedGetObject(objectName);
  }
}
