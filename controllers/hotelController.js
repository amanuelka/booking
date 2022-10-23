const { create, getById, update, deleteById, book } = require('../services/hotelService');
const { parseError } = require('../middlewares/parser');
const preload = require('../middlewares/preloader');
const { isOwner } = require('../middlewares/guards');

const hotelController = require('express').Router();

hotelController.get('/create', (req, res) => {
    res.render('create');
});

hotelController.post('/create', async (req, res) => {
    const data = { ...req.body, owner: req.user._id };

    try {
        if (Object.values(data).some(v => !v)) {
            throw new Error('All fields are required');
        }
        await create(data);
        res.redirect('/');
    } catch (err) {
        res.render('create', { errors: parseError(err), ...data });
    }
});

hotelController.get('/:id', async (req, res) => {
    const hotel = await getById(req.params.id);

    hotel.isOwner = hotel.owner == req.user._id;
    hotel.isBooked = hotel.bookings.some(b => b._id == req.user._id);

    res.render('details', { ...hotel });
});

hotelController.get('/:id/edit', preload(), isOwner(), async (req, res) => {
    const hotel = res.locals.hotel;
    res.render('edit', { ...hotel });
});

hotelController.post('/:id/edit', preload(), isOwner(), async (req, res) => {
    try {
        await update(req.params.id, { ...req.body, _id: req.params.id });
        res.redirect(`/hotel/${req.params.id}`);
    } catch (err) {
        res.render('edit', { errors: parseError(err), ...req.body });
    }
});

hotelController.get('/:id/delete', preload(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/');
});

hotelController.get('/:id/book', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner != req.user._id && hotel.bookings.some(b => b._id == req.user._id) == false) {
        await book(req.params.id, req.user._id);
    }
    res.redirect(`/hotel/${req.params.id}`);
});

module.exports = hotelController;