const mongoose = require('mongoose')

const institutionSchema = new mongoose.Schema({
    institution_id:{type: Number, unique: true},
    institution_name:{type: String, required: true},
    institution_address:{type: String, required: true},
    institution_contact_no:{type: String},
    institution_zone_name:{type: String},
    institution_code:{type: String},
    institution_icon:{type: String},
    has_admin:{type:Boolean, 'default':false},
    institution_district:{type: String}

})

institutionSchema.pre('save', async function (next) {
    try {
        console.log('Pre-save middleware executing...');
        
        if (!this.institution_id) {
            console.log('Setting institution_id...');
            const existingMaxId = await mongoose.model('Institution').findOne({}, {}, { sort: { institution_id: -1 } });
            this.institution_id = existingMaxId ? existingMaxId.institution_id + 1 : 1;
        }
        next();
    } catch (error) {
        console.error('Error in pre-save middleware:', error);
        next(error);
    }
});

mongoose.model('Institution', institutionSchema)
