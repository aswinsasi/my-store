"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const common_1 = require("@myshopping-app/common");
const user_service_1 = require("./user/user.service");
class AuthService {
    constructor(userService, authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }
    signup(createUserDto, errCallBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = createUserDto;
            const existingUser = yield this.userService.findOneByEmail(email);
            if (existingUser)
                return errCallBack(new common_1.BadRequestError('An user with this email already exists!'));
            const user = yield this.userService.create(createUserDto);
            const jwt = this.authenticationService.generateJwt({ email, userId: user.id }, process.env.JWT_KEY);
            return jwt;
        });
    }
    signin(signInDto, errCallBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = signInDto;
            const user = yield this.userService.findOneByEmail(email);
            if (!user)
                return errCallBack(new common_1.BadRequestError('Invalid credentials'));
            console.log(user);
            const samePwd = yield this.authenticationService.pwdCompare(user.password, password);
            if (!samePwd)
                return errCallBack(new common_1.BadRequestError('Invalid credentials'));
            const jwt = this.authenticationService.generateJwt({ email, userId: user.id }, process.env.JWT_KEY);
            if (!jwt)
                return; // important! prevent sending a response again
            return jwt;
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService(user_service_1.userService, new common_1.AuthenticationService());
