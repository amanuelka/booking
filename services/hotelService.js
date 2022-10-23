const Hotel = require('../models/Hotel');

async function getAll() {
    return Hotel.find({}).lean();
}
async function getById(id) {
    return Hotel.findById(id).lean();
}
async function create(hotel) {
    return await Hotel.create(hotel);
}
async function update(id, hotel) {
    const existing = await Hotel.findById(id);
    Object.assign(existing, hotel);
    await existing.save();

}
async function deleteById(id) {
    await Hotel.findByIdAndDelete(id);
}
async function book(hotelId, userId) {
    const hotel = await Hotel.findById(hotelId);
    hotel.bookings.push(userId);
    await hotel.save();
}

async function getOwn(userId) {
    return Hotel.find({ bookings: userId }).lean();
}

module.exports = { getAll, getById, create, update, deleteById, book, getOwn };