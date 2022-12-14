import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private userService: UsersService, private jwtService: JwtService) {}

	async login(userDto: CreateUserDto) {
		const user =  await this.validateUser(userDto);
		return this.generateToken(user);
	}

	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.getUserByEmail(userDto.email);

		if (candidate) {
			throw new HttpException('User already registered', HttpStatus.BAD_REQUEST);
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(userDto.password, salt);

		const user = await this.userService.createUser({ ...userDto, password: hashPassword });

		return this.generateToken(user);
	}

	private async generateToken(user: User) {
		const payload = { id: user.id, email: user.email, roles: user.roles };

		return {
			token: this.jwtService.sign(payload),
		};
	}

	private async validateUser(userDto: CreateUserDto) {
		const user = await this.userService.getUserByEmail(userDto.email);
		const passwordEquals = await bcrypt.compare(userDto.password, user.password);

		if (user && passwordEquals) {
			return user;
		}
		throw new UnauthorizedException({ message: 'Not correct e-mail or password' });
	}
}
