import {PartialType} from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { User } from "src/entities/user.entity";


export class GetUserDto extends PartialType(User){}