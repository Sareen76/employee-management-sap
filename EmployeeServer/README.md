# 🧑‍💼 Employee Management Application
*A Full-Stack SAP CAP + SAPUI5 (Fiori) Project*

## 📌 1. Introduction
This project is a full‑stack employee management application built using:
- **SAP CAP (Cloud Application Programming Model)** for backend services
- **SAPUI5 / Fiori** for the frontend
- **SQLite** for local development
- Runs inside **SAP Business Application Studio (BAS)**
- Authenticated via **SAP Fiori Launchpad** (no custom login required)

The solution demonstrates enterprise‑grade practices such as CRUD, data validation, filtering, timestamps, and service projections.

## 📁 2. Project Structure
```
project-root/
├── db/
│   └── schema.cds
├── srv/
│   ├── my-Employees-service.cds
│   └── employee-service.js
├── app/
│   └── employee-ui/
├── package.json
└── employee.db
```

## 🗂 3. Data Model (CDS)
### Namespace
```
namespace my.hr;
```
### Departments Entity
```
entity Departments {
    key ID : UUID;
    Name : String(60);
    Description : String(255);
}
```
### Employees Entity
```
entity Employees {
    key ID : UUID;
    FirstName : String(80);
    LastName : String(80);
    Email : String(255);
    JobTitle : String(60);
    Status : String(20);
    HireDate : Date;
    CreatedAt : Timestamp;
    ModifiedAt : Timestamp;
    Department : Association to Departments;
}
```

## 🔗 4. OData Service Definition
```
using { my.hr as db } from '../db/schema';
service EmployeeService @(path:'/employee') {
    entity Employees  as projection on db.Employees;
    entity Departments as projection on db.Departments;
}
```

## ⚙️ 5. Custom Logic (Node.js Handlers)
```
this.before(['CREATE','UPDATE'], 'Employees', req => {
    const email = req.data.Email;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.error(400, 'Invalid email format');
    }
});
this.before('CREATE', 'Employees', req => {
    req.data.CreatedAt = new Date().toISOString();
});
this.before('UPDATE', 'Employees', req => {
    req.data.ModifiedAt = new Date().toISOString();
});
```

## 🛠 6. Installation & Run Instructions
```
npm install
npm start
npm run watch-employee-ui
```

## 🔐 7. Authentication & Security
- No login page is created in the UI
- Authentication handled by SAP Fiori Launchpad
- CAP receives JWT token automatically
- Roles & access managed via FLP
