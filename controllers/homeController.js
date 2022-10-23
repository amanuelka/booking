const { hasUser } = require('../middlewares/guards');
const { getAll, getOwn, book } = require('../services/hotelService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const hotels = await getAll();
    res.render('home', { hotels });
});

// homeController.get('/profile', hasUser(), async (req, res) => {
//     const bookings = await getOwn(req.user._id);
//     res.render('profile', { user: Object.assign({ bookings }, req.user) });
// });

homeController.get('/profile', hasUser(), async (req, res) => {
    const bookings = await getOwn(req.user._id);
    const bookedHotels = bookings.map(h => h.name).join(', ');
    res.render('profile', { bookedHotels, email: req.user.email });
});

module.exports = homeController;