const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const SELECT_ALL_EMPLOYEES = 'SELECT * FROM hrms.person';
const SELECT_EMPLOYEE = 'SELECT * FROM hrms.person WHERE Person_ID = ?';


const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '12345678',
	database: 'hrms',
	insecureAuth : true


});
connection.connect(err =>{
	if(err){
		console.log(err);
		return err;

	} 
	else{
		console.log('connected to the database');
	}

app.get('/employee', (req, res) => {
    connection.query(SELECT_ALL_EMPLOYEES, [req.params.id], (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            console.log(results);
            return res.json({
                data: results
            })
        }
    });
});

});

//get a  employee with a specific id
app.get('/employee/:id',(req,res)=>{
    connection.query(SELECT_EMPLOYEE, [req.params.id], (err, rows, fields)=>{
        if(err)
        console.log(err);
        else {
        	res.json(rows);
        }
        
    })


});

//delete employee by specific Id
app.delete('/employee/:id',(req,res)=>{
    connection.query('DELETE FROM hrms.person WHERE Person_ID = ?', [req.params.id], (err, rows, fields)=>{
        if(err)
        console.log(err);
        else {
        	res.send('deleted');
        }
        
    })


});


//Insert and employye
app.post('/employee', (req,res) => {
    let hold = req.body;
    var employees = " SET @F_Name = ?; SET @L_Name = ?; SET @Email = ?; \
        SET @Phone_Number = ?; \
        SET @Date_Of_Birth = ?;SET @Location_ID = ?;SET @Department_ID = ?; \
        SET @Employee_Address = ?;SET @Passwords = ?;SET @Gender = ?; \
        SET @Role_ID = ?;SET @Hire_Date = ?;SET @Reporting_Person_ID= ?; SET @Project_ID = ?; \
        SET @Person_Type = ?; \
        CALL newcandidateform(@F_Name,@L_Name,@Email, @Phone_Number,@Date_Of_Birth \
            @Passwords,@Gender,@Role_ID,@Hire_Date,@Reporting_Person_ID, \
            @Project_ID,@Person_Type" ;

connection.query(employee, [hold.F_Name, hold.L_Name, hold.Email,
        hold.Phone_Number, hold.Date_Of_Birth,
        hold.Passwords, hold.Gender, hold.Role_ID, hold.Hire_Date, hold.Reporting_Person_ID, hold.Project_ID,
        hold.Person_Type], (err, rows,)=>{
        if(err)
        console.log(err);
        else
        res.send(rows);
    })



app.listen(4000, () => {
	console.log('db connected on port');
});