const mongoose = require('mongoose');
const Joi = require('joi');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

const validateTask = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().label('Title'),
        task: Joi.string().required().label('Task'),
        completed: Joi.boolean().label('Completed'),
    });
    return schema.validate(data);
};

module.exports = { Task, validateTask };
