import { AuthenticationService, BadRequestError, CreateUserDto, UserDoc } from "@myshopping-app/common";
import { userService, UserService } from "./user/user.service";
import { AuthDto } from "./dtos/auth.dto";
import { NextFunction } from "express";

export class AuthService {
    constructor(
        public userService: UserService,
        public authenticationService: AuthenticationService
    ){}

    async signup(createUserDto: AuthDto, errCallBack: NextFunction) {
        const { email, password } = createUserDto;
        const existingUser = await this.userService.findOneByEmail(email);
        if(existingUser) return errCallBack( new BadRequestError('An user with this email already exists!'));

        const user = await this.userService.create(createUserDto);

        const jwt = this.authenticationService.generateJwt({ email, userId: user.id }, process.env.JWT_KEY!);

        return jwt;
    }

    async signin(signInDto: AuthDto, errCallBack: NextFunction) {
        const { email, password } = signInDto;
        
        const user = await this.userService.findOneByEmail(email);

        if(!user) return errCallBack(new BadRequestError('Invalid credentials'));
        console.log(user)
        const samePwd = await this.authenticationService.pwdCompare(user.password, password);

        if(!samePwd) return errCallBack(new BadRequestError('Invalid credentials'));

        const jwt = this.authenticationService.generateJwt({ email, userId: user.id }, process.env.JWT_KEY!);

        return jwt;
    }
}

export const authService = new AuthService(userService, new AuthenticationService());