const {clearCachedUserId} = require("../services/cache");
module.exports = async (req, res, next) => {
    await next();
    clearCachedUserId(req.user.id);
}
