# 测试模板

## Controller 测试模板

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { XxxController } from './xxx.controller';
import { XxxService } from './xxx.service';

const mockXxxService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('XxxController', () => {
  let controller: XxxController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XxxController],
      providers: [{ provide: XxxService, useValue: mockXxxService }],
    }).compile();
    controller = module.get<XxxController>(XxxController);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  describe('create', () => {
    it('should return created entity when input is valid', async () => {
      const createDto = { /* valid input */ };
      const mockResult = { id: '1', ...createDto };
      mockXxxService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(mockXxxService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw error when service throws', async () => {
      const createDto = { /* invalid input */ };
      mockXxxService.create.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.create(createDto)).rejects.toThrow('Validation failed');
    });
  });
});
```

## Service 测试模板（依赖 Prisma）

```typescript
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { XxxService } from './xxx.service';

const mockPrismaService = {
  xxx: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
};

describe('XxxService', () => {
  let service: XxxService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [XxxService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<XxxService>(XxxService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('findOne', () => {
    it('should return entity when found', async () => {
      const mockId = '1';
      const mockResult = { id: mockId, name: 'Test' };
      mockPrismaService.xxx.findUnique.mockResolvedValue(mockResult);

      const result = await service.findOne(mockId);

      expect(result).toEqual(mockResult);
      expect(mockPrismaService.xxx.findUnique).toHaveBeenCalledWith({ where: { id: mockId } });
    });

    it('should throw error when entity not found', async () => {
      mockPrismaService.xxx.findUnique.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow();
    });
  });
});
```

## Guard/Interceptor/Pipe/Middleware 测试模板（通用结构）

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { XxxGuard } from './xxx.guard'; // 替换为对应类型

describe('XxxGuard', () => {
  let guard: XxxGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XxxGuard],
    }).compile();
    guard = module.get<XxxGuard>(XxxGuard);
  });

  it('should be defined', () => expect(guard).toBeDefined());

  describe('核心方法', () => {
    it('should return true when condition is met', () => {
      // given/when/then
    });

    it('should return false when condition fails', () => {
      // given/when/then
    });
  });
});
```
