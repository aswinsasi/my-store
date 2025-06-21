import { CreateUserDto, UserDoc, UserModel } from "@myshopping-app/common";
import { User } from "./user.model";
import { AuthDto } from "../dtos/auth.dto";

export class UserService {
    constructor(public userModel: UserModel) {

    }

    async create(createUserDto: AuthDto) {

        const { email, password } = createUserDto;

        //  Downsides of using new this.userModel(...) directly:
      //  Easy to forget required fields

       /// No compile-time type check for constructor arguments

       // Not ideal for enforcing design contracts in large codebases

        // const user = new this.userModel({
        //     email,
        //     password
        // });

        //or 


//✅ Recommended for large-scale apps: Custom .build() method
        const user = this.userModel.build({
            email,
            password
        })

        return await user.save();
    }

    async findOneByEmail(email: string){
        return await this.userModel.findOne({ email })
    }
}

export const userService = new UserService(User);