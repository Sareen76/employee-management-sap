namespace my.hr; // To easily identify our model


//Define the entities Departments and Employees
entity Departments {
    key ID : UUID;
        Name : String(60);
        Description : String(255)
}

entity Employees{
    key ID : UUID;
    FirstName : String(80);
    LastName : String(80);
    Email : String(255);
    JobTitle : String(60);
    Status : String(20);
    HireDate : Date;
    CreatedAt : Timestamp;
    ModifiedAt : Timestamp;

    // Lets Do the Joining Of table or Association of Tables
    Department : Association to Departments;
}
