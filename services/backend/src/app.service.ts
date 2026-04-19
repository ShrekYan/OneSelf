import { Injectable } from '@nestjs/common';

// @Injectable() 是 NestJS 提供的装饰器，用于声明此类（AppService）为“提供者”，即它将由 NestJS 的依赖注入容器托管。
// 依赖注入（DI）是一种设计模式：组件不再自行创建依赖，而是把依赖的实例“注入”进来，从而实现解耦、易测试与可复用。
// 加了它后，NestJS 会在需要时自动实例化并注入 AppService，无需手动 new。
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
