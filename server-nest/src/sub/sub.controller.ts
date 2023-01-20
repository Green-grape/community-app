import {
  Controller,
  Post,
  ExecutionContext,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
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
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { SubInterceptor } from 'src/common/interceptors/sub.interceptor';
import { Sub } from 'src/entities/sub.entity';
import { AuthInterceptor } from 'src/common/interceptors/auth.interceptor';

@Controller('api/subs')
export class SubController {
  constructor(private subService: SubService) {}
  @Post()
  @UseInterceptors(UserInterceptor,AuthInterceptor)
  createSub(
    @MyReq('body') createSubDto: CreateSubDto,
    @MyReq('user') user: User,
  ) {
    return this.subService.createSub(createSubDto, user);
  }
  @Get('/topsubs')
  getSubList() {
    return this.subService.getSubList();
  }
  @Get('/:name')
  getSub(@MyReq('params') getSubDto: GetSubDto) {
    return this.subService.getSub(getSubDto);
  }
  //dto 쓰면 에러발생, express 의존
  @Post('/:subname/upload')
  @UseInterceptors(
    UserInterceptor,
    AuthInterceptor,
    SubInterceptor,
    FileInterceptor('file', {
      dest: 'public/images',
      storage: multer.diskStorage({
        destination: 'public/images',
        filename: (_, file, callback) => {
          const name = uuid();
          callback(null, name + path.extname(file.originalname));
        },
      }),
    }),
  )
  uploadImage(
    @MyReq('sub') sub:Sub,
    @MyReq('body') body,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(image).(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.subService.uploadImage(body.type, sub, file);
  }
}
