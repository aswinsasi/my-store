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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@myshopping-app/common");
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
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
            ret.id = ret._id; //	Copies the MongoDB _id field to a new field id (commonly done to make the object more frontend-friendly).
            delete ret._id; // Deletes the new _id field  — this seems contradictory and likely a mistake unless intentional.
            delete ret.password; // delete password so response doesn't have password
        }
    }
});
userSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationService = new common_1.AuthenticationService();
        if (this.isModified('password') || this.isNew) {
            // this.get('password') is a Mongoose document method that retrieves the value of the password field from the document.
            const hashedPwd = yield authenticationService.pwdToHash(this.get('password'));
            this.set('password', hashedPwd);
        }
        done();
    });
});
userSchema.statics.build = (createUserDto) => {
    return new exports.User(createUserDto);
};
exports.User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
