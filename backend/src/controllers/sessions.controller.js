sessionsController = {}
const SessionModel = require('../models/UserSession');

sessionsController.getSessions = async (req, res) => {
    const sessions = await SessionModel.find();
    res.json(sessions);
}

module.exports = sessionsController;