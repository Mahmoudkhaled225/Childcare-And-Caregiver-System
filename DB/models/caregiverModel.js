import mongoose from 'mongoose';

class caregiverSchema extends mongoose.Schema {
    constructor() {
        super({
            hourlyRate: {
                type: Number,
                required: [true, 'Hourly rate required'],
                min: [0, 'Hourly rate must be positive'],
            },
            availability: {
                type: [String],
                required: [true, 'Availability required'],
                enum: {
                    values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                }
            },

        }, {
            timestamps: true,
        });
    }
}


const caregiverModel = mongoose.models.Caregiver || mongoose.model('Caregiver', new caregiverSchema())


export default caregiverModel;