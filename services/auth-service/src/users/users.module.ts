import { Module, Global } from '@nestjs/common';
import { UserSyncService } from './user-sync.service';

@Global()
@Module({
  providers: [UserSyncService],
  exports: [UserSyncService],
})
export class UsersModule {}
