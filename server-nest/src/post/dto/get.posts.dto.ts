import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GetPostsDto{
    @Type(()=>Number)
    @IsNumber()
    page:number=0;

    @IsOptional()
    limit:number=10;
}