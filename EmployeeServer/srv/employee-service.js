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
        req.data.ModeifiedAt = new Date().toISOString();
    })
})

// const cds = require('@sap/cds');

// module.exports = (srv) => {
//   const { Employees, Departments } = srv.entities;

//   /** ------------------------------
//    *  READ Hooks (enrichment)
//    *  ------------------------------ */

//   // Add computed fields after READ
//   srv.after('READ', 'Employees', (result /*, req */) => {
//     const list = Array.isArray(result) ? result : [result];

//     const statusTextMap = {
//       Active: 'Active',
//       OnLeave: 'On Leave',
//       Inactive: 'Inactive'
//     };

//     for (const e of list) {
//       if (!e) continue;

//       // 1) Full name for UI display
//       if (e.FirstName || e.LastName) {
//         e.FullName = [e.FirstName, e.LastName].filter(Boolean).join(' ');
//       }

//       // 2) User-friendly status text
//       if (e.Status) {
//         e.StatusText = statusTextMap[e.Status] || e.Status;
//       }

//       // 3) Basic email normalization (lowercase)
//       if (e.Email) {
//         e.Email = String(e.Email).trim().toLowerCase();
//       }
//     }

//     return Array.isArray(result) ? result : list[0];
//   });

//   // (Optional) Add a quick count aggregation for Departments after READ
//   srv.after('READ', 'Departments', async (result, req) => {
//     const list = Array.isArray(result) ? result : [result];

//     // If the client asks ?withCounts=true, compute number of employees per department
//     const withCounts = req.data.withCounts || req._.req?.query?.withCounts;
//     if (withCounts === 'true' || withCounts === true) {
//       // IMPORTANT: Replace 'Department_ID' with your actual FK name if different.
//       const counts = await SELECT.from(Employees)
//         .columns('Department_ID as ID', 'count(*) as Count')
//         .groupBy('Department_ID');

//       const map = new Map(counts.map(c => [c.ID, Number(c.Count)]));
//       for (const d of list) {
//         if (!d) continue;
//         d.EmployeeCount = map.get(d.ID) || 0;
//       }
//     }

//     return Array.isArray(result) ? result : list[0];
//   });

//   /** ------------------------------
//    *  CREATE Hooks (validation & defaults)
//    *  ------------------------------ */

//   srv.before('CREATE', 'Employees', async (req) => {
//     const { FirstName, LastName, Email, Status, Department_ID, HireDate } = req.data;

//     // Required fields
//     if (!FirstName) req.error(400, 'FirstName is required');
//     if (!LastName)  req.error(400, 'LastName is required');
//     if (!Email)     req.error(400, 'Email is required');

//     // Email format
//     if (Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(Email))) {
//       req.error(400, 'Invalid email format');
//     }

//     // Normalize email
//     if (Email) req.data.Email = String(Email).trim().toLowerCase();

//     // Status defaults
//     if (!Status) req.data.Status = 'Active';

//     // Default HireDate to today if not provided
//     if (!HireDate) req.data.HireDate = new Date().toISOString().slice(0, 10);

//     // Created/Modified timestamps
//     const nowIso = new Date().toISOString();
//     req.data.CreatedAt = nowIso;
//     req.data.ModifiedAt = nowIso;

//     // Optional: validate Department exists (if provided)
//     if (Department_ID) {
//       const exists = await SELECT.one.from(Departments).where({ ID: Department_ID });
//       if (!exists) req.error(400, `Department not found: ${Department_ID}`);
//     }
//   });

//   /** ------------------------------
//    *  UPDATE Hooks (field protections & stamping)
//    *  ------------------------------ */

//   srv.before('UPDATE', 'Employees', async (req) => {
//     // Do not allow primary key changes
//     if ('ID' in req.data) {
//       req.error(400, 'Changing ID is not allowed');
//     }

//     // Email validation/normalization if changed
//     if ('Email' in req.data) {
//       const email = req.data.Email;
//       if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
//         req.error(400, 'Invalid email format');
//       }
//       if (email) req.data.Email = String(email).trim().toLowerCase();
//     }

//     // ModifiedAt stamp
//     req.data.ModifiedAt = new Date().toISOString();

//     // Optional: prevent Status from jumping directly from Inactive to Active without approval
//     // if (req.data.Status) {
//     //   const current = await SELECT.one.from(Employees, req.data.ID).columns('Status');
//     //   if (current?.Status === 'Inactive' && req.data.Status === 'Active' && !req.user.is('HRAdmin')) {
//     //     req.error(403, 'Only HRAdmin can re-activate an inactive employee');
//     //   }
//     // }

//     // Optional: validate Department if changed
//     if ('Department_ID' in req.data && req.data.Department_ID) {
//       const exists = await SELECT.one.from(Departments).where({ ID: req.data.Department_ID });
//       if (!exists) req.error(400, `Department not found: ${req.data.Department_ID}`);
//     }
//   });

//   /** ------------------------------
//    *  DELETE Hooks (business rules)
//    *  ------------------------------ */

//   srv.before('DELETE', 'Employees', async (req) => {
//     const id = req.data.ID;
//     if (!id) return;

//     const employee = await SELECT.one.from(Employees).where({ ID: id }).columns('Status');
//     if (employee?.Status === 'Active') {
//       req.error(400, 'Active employees cannot be deleted. Set Status to Inactive first.');
//     }
//   });

//   /** ------------------------------
//    *  QUERY Guard Rails (optional)
//    *  ------------------------------ */

//   // Enforce a reasonable default $top to protect lists if the client doesn't set one
//   srv.before('READ', 'Employees', (req) => {
//     // If the request is a collection read (no key predicate)
//     const hasKeyPredicate = Array.isArray(req.params) && req.params.length > 0;
//     if (!hasKeyPredicate && !req.query.SELECT.limit) {
//       // Default limit to 200 rows
//       req.query.SELECT.limit = { rows: 200, offset: 0 };
//     }
//   });
// };