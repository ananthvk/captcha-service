import { Module } from '@nestjs/common';
import { KvstoreService } from './kvstore.service';

@Module({
    providers: [KvstoreService],
    exports: [KvstoreService]
})
export class KvstoreModule { }
