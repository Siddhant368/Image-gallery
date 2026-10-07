import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class CreateImageDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)

    title:string;
}