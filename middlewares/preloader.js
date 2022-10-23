const { getById } = require('../services/hotelService');

function preload() {
    return async function (req, res, next) {
        res.locals.hotel = await getById(req.params.id);
        next();
    };
}

module.exports = preload;