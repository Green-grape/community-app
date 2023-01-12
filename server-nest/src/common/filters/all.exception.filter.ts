import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
function parseJsonString(s: string) {
  try {
    return JSON.parse(s);
  } catch (e) {
    return false;
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    //dto의 message 배열을 key:오류가 발생한 key, value:오류인 object로 변환한다.(커스텀 메시지 처리)
    console.log(exception);
    let res: any = exception.getResponse();
    let message: Object = {};
    if (Array.isArray(res.message)) {
      res.message.forEach((ele) => {
        let jsonObject = parseJsonString(ele);
        if (jsonObject !== false) {
          Object.assign(message, jsonObject);
        }
      });
    }
    if (Object.keys(message).length == 0) {
      //custom 메세지가 아닌경우
      message = res.message;
    }
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(ctx.getResponse(), message, httpStatus);
  }
}
