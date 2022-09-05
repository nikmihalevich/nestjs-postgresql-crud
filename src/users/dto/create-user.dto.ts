import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'user@domain.com', description: 'E-mail address' })
	@IsString({ message: 'Must be a string' })
	@IsEmail({}, { message: 'E-mail not correct' })
	readonly email: string;

	@ApiProperty({ example: 'Password123', description: 'User password' })
	@IsString({ message: 'Must be a string' })
	@Length(4, 16, { message: 'Minimum length is 4 characters and maximum length is 16 characters' })
	readonly password: string;
}
