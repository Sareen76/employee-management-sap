//Adding the model to the service
using { my.hr as db } from '../db/schema';


service EmployeeService @(path:'/employee') {
    entity Employees as projection on db.Employees;
    entity Departments as projection on db.Departments;
}

// @(path:'/employee') - Sets an clean Base Path
// Projection is used to expose the db entities so that We can add view specific logic
