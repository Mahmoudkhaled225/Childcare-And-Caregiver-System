import mongoose from 'mongoose';

class UserSchema extends mongoose.Schema {
    constructor() {
        super({
            username:  {
                type: String,
                required: [true, 'UserName required'],
                minlength: [2, 'Too short user name'],
                maxlength: [32, 'Too long user name'],
            },
            email: {
                type: String,
                required: [true, 'email required'],
                unique: [true, 'email must be unique'],
                index: true, // create an index on the email field for faster querying
                lowercase: true,
            },
            password: {
                type: String,
                required: [true, 'password required'],
                minlength: [2, 'Too short password'],
            },
            phone: {
                type: String,
                required: [true, 'phone required'],
                minlength: [11, 'Too short phone number'],
                maxlength: [11, 'Too long phone number'],
            },
            age: {
                type: Number,
                required: [true, 'age required'],
                min: [18, 'Too young'],
            },
            isDeleted: {
                type: Boolean,
                default: false,
            },
            undoIsDeletedCode: {
                type: String,
                default: null,
            },
            image: {
                path: {
                    type: String,
                    // required: [true, 'Image path required'],
                },
                publicId: {
                    type: String,
                    // required: [true, 'Image publicId required'],
                }
            },
            role: {
                type: String,
                default: 'user',
                enum: ["user","caregiver","admin"]
            },
            //more accurate address
            // address: {
            //     apartment: {type: String, required: true},
            //     building: {type: String, required: true},
            //     street: {type: String, required: true},
            //     city: {type: String, required: true},
            //     country: {type:String, default: 'egypt'}
            // },
            address: {
                type: String,
                required: [true, 'Address required'],
            },
            caregiverProperties: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Caregiver',
                default: null,
            }
        }, {
            timestamps: true,
        });
        // Define virtual field for subcategories
        this.virtual('Caregiver', {
            ref: 'Caregiver',
            localField: '_id',
            foreignField: 'caregiverProperties',
        });
    }
}

const userModel = mongoose.models.User || mongoose.model('User', new UserSchema())


export default userModel;