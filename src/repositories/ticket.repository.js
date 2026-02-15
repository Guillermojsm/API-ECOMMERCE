const TicketDao = require('../dao/ticket.dao');

class TicketRepository {
    constructor() {
        this.dao = new TicketDao();
    }

    async createTicket(data) {
        return this.dao.create(data);
    }

    async getTicketById(id) {
        return this.dao.findById(id);
    }

    async getTickets() {
        return this.dao.findAll();
    }
}

module.exports = TicketRepository;
