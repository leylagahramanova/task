// middleware/verifyUser.js
const Task = require('../models/task');
const verifyUser = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Ensure the user can only access their own tasks
        if (!task.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
module.exports = verifyUser;
