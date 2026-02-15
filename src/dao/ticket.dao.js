const Ticket = require('../models/ticket.model');

class TicketDao {
    async create(data) {
        return Ticket.create(data);
    }

    async findById(id) {
        return Ticket.findById(id);
    }

    async findAll() {
        return Ticket.find();
    }
}

module.exports = TicketDao;
