import { Global, Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';

@Global()
@Module({
  controllers: [FiltersController],
  providers: [FiltersService],
  exports:[FiltersService]
})
export class FiltersModule {}
