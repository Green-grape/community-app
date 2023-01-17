import {
  Controller,
  Post,
  ExecutionContext,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { MyReq } from 'src/common/decorators/request.decorator';
import { CreateSubDto } from './dto/create.sub.dto';
import { SubService } from './sub.service';
import { User } from 'src/entities/user.entity';
import { MyRes } from 'src/common/decorators/response.decorator';
import { GetSubDto } from './dto/get.sub.dto';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('api/subs')
export class SubController {
  constructor(private subService: SubService) {}
  @UseInterceptors(UserInterceptor)
  @Post()
  createSub(@MyReq('body') createSubDto: CreateSubDto) {
    return this.subService.createSub(createSubDto);
  }
  @Get('/topsubs')
  getSubList() {
    return this.subService.getSubList();
  }
  @Get('/:name')
  getSub(@MyReq('params') getSubDto: GetSubDto) {
    return this.subService.getSub(getSubDto);
  }
  @UseInterceptors(UserInterceptor, FileInterceptor('file'))
  @Post('/:subname/upload')
  uploadImage(@UploadedFile(new ParseFilePipe({
    validators:[new FileTypeValidator({fileType:/(image).(jpg|jpeg|png)$/})]
  })) file: Express.Multer.File) {
    console.log(file);
  }
}
