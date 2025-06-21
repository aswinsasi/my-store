import { UserDoc, UserModel, CreateUserDto, AuthenticationService } from "@myshopping-app/common";
import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {

    // This code is part of a Mongoose schema option, specifically inside the toJSON transform. It's customizing the output when a Mongoose document is converted to JSON, like during res.json(user).
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id //	Copies the MongoDB _id field to a new field id (commonly done to make the object more frontend-friendly).
            delete ret._id // Deletes the new _id field  — this seems contradictory and likely a mistake unless intentional.
            delete ret.password // delete password so response doesn't have password
        }
    }
});

userSchema.pre("save", async function(done) {
   
    const authenticationService = new AuthenticationService();
    if(this.isModified('password') || this.isNew) {
        // this.get('password') is a Mongoose document method that retrieves the value of the password field from the document.
        const hashedPwd = await authenticationService.pwdToHash(this.get('password'));
        
        this.set('password', hashedPwd);
    }

    done();
});


userSchema.statics.build = (createUserDto: CreateUserDto) => {
    return new User(createUserDto)
};

export const User = (mongoose.models.User as UserModel) || mongoose.model<UserDoc, UserModel>('User', userSchema);

