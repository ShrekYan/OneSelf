import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller() 是 NestJS 提供的装饰器，用于声明一个控制器（Controller）。
// 控制器负责处理 incoming requests 并返回 responses。
// 加了它后，NestJS 会自动扫描并加载该控制器下的所有路由处理方法，实现路由的自动发现与注册。
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get() 是 NestJS 提供的装饰器，用于声明一个路由处理方法（Handler Method）。
  // 加了它后，NestJS 会自动将该方法注册为处理 GET / 路由的处理函数。
  @Get('/getHello')
  getHello(): string {
    return this.appService.getHello();
  }
}
