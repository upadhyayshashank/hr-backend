const mysql = require('mysql');
const express = require('express');
const cors = require('cors')
var app = express();
const bodyparser = require('body-parser');
app.use(cors())
app.use(bodyparser.json());


//DB Connection Setup
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'hrms',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});





//Get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM Person', (err, rows, fields) => {
        if (!err)
            res.send({data: rows});
        else
            console.log(err);
    })
});

//Get an employee by specific ID
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Person WHERE Person_ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send({data: rows});
        else
            console.log(err);
    })
});

//Delete an employee
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Person WHERE Person_ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Job history employees
app.get('/employeesJobHistory', (req, res) => {
    mysqlConnection.query('SELECT * FROM Job_History', (err, rows, fields) => {
        if (!err)
            res.send({data: rows});
        else
            console.log(err);
    })
});

//Insert an employee
app.post('/employeesInsert', (req, res) => {
    let emp = req.body;
    var sql = "SET @F_Name = ?;SET @L_Name = ?; SET @Email = ?;SET @Phone_Number= ?;SET @Employee_Address =?; SET @Date_Of_Birth = ?; SET @Gender = ?; SET @Person_Type =?; SET @Hire_Date =?;\
    CALL addperson(@F_Name,@L_Name,@Email,@Phone_Number,@Employee_Address,@Date_Of_Birth,@Gender,@Person_Type,@Hire_Date);";
    mysqlConnection.query(sql, [emp.firstName, emp.lastName, emp.email, emp.phoneNumber, emp.address, emp.dob, emp.gender, emp.personType, emp.hireDate], (err, rows, fields) => {
         if(err)
        console.log(err);
        else
        res.send({data: rows});
    })
});

//Update an employee
app.put('/employeesUpdate', (req, res) => {
    let emp = req.body;
    var sql = "SET @Person_ID = ?;SET @F_Name = ?;SET @L_Name = ?;SET @Email = ?;SET @Phone_Number = ?;SET @Employee_Address= ?;\
    CALL updateperson(@Person_ID,@F_Name,@L_Name,@Email,@Phone_Number,@Employee_Address);";
    mysqlConnection.query(sql, [emp.personId, emp.firstName, emp.lastName, emp.email, emp.phoneNumber, emp.address], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});

// caculate_salary
app.get('/personsalary/:id', (req, res) => {
    let sal = req.params.id;
    var sql = "SET @Person_ID = ?;\
    CALL calculate_salary(@Person_ID);";
    console.log(sal)
    mysqlConnection.query(sql, [sal], (err, rows, fields) => {
         if(err)
        console.log(err);
        else
        res.send({data: rows});
    })
});
// Performance_Review
app.get('/personreview', (req, res) => {
    let rev = req.body;
    var sql = "SET @Person_ID = ?;\
    CALL perform_review(@Person_ID);";
    mysqlConnection.query(sql, [rev.Person_ID], (err, rows, fields) => {
         if(err)
        console.log(err);
        else
        res.send({data: rows});
    })
});


// All public holidays
app.get('/employeesHoliday', (req, res) => {
    mysqlConnection.query('SELECT * FROM Public_Holiday', (err, rows, fields) => {
        if (!err)
            res.send({data: rows});
        else
            console.log(err);
    })
})


//Public_Holidays
app.get('/personholiday', (req, res) => {
    let holi = req.body;
    var sql = "SET @Person_ID = ?;\
    CALL PublicHolidays(@Person_ID);";
    mysqlConnection.query(sql, [holi.Person_ID], (err, rows, fields) => {
         if(err)
        console.log(err);
        else
        res.send({data: rows});
    })
});

// equipment details person

app.get('/equipmentdetailsper', (req, res) => {
    let equipper = req.body;
    var sql = "SET @Person_ID = ?;\
    CALL equipment_details_person(@Person_ID);";
    mysqlConnection.query(sql, [equipper.Person_ID], (err, rows, fields) => {
         if(err)
        console.log(err);
        else
        res.send({data: rows});
    })
});

// equipment details all

app.get('/equipmentdetailsall', (req, res) => {
    mysqlConnection.query('SELECT * FROM Equipment', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send({data: rows});
        else
            console.log(err);
    })
});

//procedure for viewing applicants

app.get('/viewapplicants/:id', (req, res) => {
    let viewapp = req.params.id;
    var sql = "SET @Position_ID = ?;\
    CALL view_job_applicants(@Position_ID);";
    mysqlConnection.query(sql, [viewapp], (err, rows, fields) => {
         if(err)
        console.log(err);
        else
        res.send({data: rows});
    })
});



app.listen(4000, () => console.log('Express server is runnig at port no : 4000'));
