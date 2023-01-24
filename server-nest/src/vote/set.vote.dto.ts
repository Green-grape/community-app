import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ValidationArguments } from "class-validator";

export class SetVoteDto{
    @IsNotEmpty({
        message: (args: ValidationArguments) => {
          if (args.value === undefined || args.value.trim().length === 0)
            return JSON.stringify({
              identifier: '식별자를 비워둘 수 없습니다.',
            });
        },
      })
    identifier:string;

    @IsNotEmpty({
        message: (args: ValidationArguments) => {
          if (args.value === undefined || args.value.trim().length === 0)
            return JSON.stringify({
              slug: '식별자를 비워둘 수 없습니다.',
            });
        },
      })

    slug:string;

    @IsNumber({},{
        message:(args:ValidationArguments)=>{
            if(typeof args.value!=="number" || ![-1,0,1].includes(args.value)){
                return JSON.stringify({
                    value:"값이 잘못되었습니다."
                })
            }
        }
    })
    value:number

    @IsOptional()
    commentIdentifier:string;
}