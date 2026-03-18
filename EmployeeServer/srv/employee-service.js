const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Employees } = this.entities;

    this.before(['CREATE', 'UPDATE'], 'Employees', (req) => {
        const email = req.data.Email;

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            req.error(400, 'Invalid email format');
        }

    })

    this.before('CREATE', 'Employees', (req) => {
        req.data.CreatedAt = new Date().toISOString();
    })
    this.before('UPDATE', 'Employees', (req)=> {
        req.data.ModifiedAt = new Date().toISOString();
    })
})
