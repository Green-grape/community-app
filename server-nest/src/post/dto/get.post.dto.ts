import { IsNotEmpty } from "class-validator";

export class GetPostDto{
    @IsNotEmpty({message:JSON.stringify(
        {identifier:"식별자가 존재하지 않습니다."}
    )})
    identifier:string;

    @IsNotEmpty({message:JSON.stringify(
        {slug:"식별자가 존재하지 않습니다."}
    )})
    slug:string;
}