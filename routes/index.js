var express = require('express'),
	router 	= express.Router(),
	con 	= require('../configure/database'),
	bcrypt	= require('bcryptjs'),
	jwt 	= require('jsonwebtoken');
	// Optimus = require('optimus-ts')


// let optimus = new Optimus(1580030173, 59260789, 1163945558);
const saltRounds = 10;
const secret = 'WorkIndia_API_Vivek';


//HOME ROUTE
router.get('/', function(req, res){
	// var hash = optimus.encode(69);
	// console.log(hash);
	res.status(200).json({message:"Home Page"});
});


//LOGIN ROUTE
router.post('/app/user/auth', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var sql = "SELECT * FROM users WHERE username = ?";
	con.query(sql, req.body.username, function(err, result){
		if(err){
			throw err;
		}
		if(result.length == 0){
			return res.status(500).json({
				'status':'No such user exists'
			});
		}
		var hash = result[0].password.toString();
		bcrypt.compare(password, hash, function(err, loginUser){
			if(loginUser){
				var encryptedId = jwt.sign({ userId: result[0].id }, secret);
				return res.status(200).json({
					'status': 'Success',
					'userId': encryptedId
				});
			}
			else{
				return res.status(500).json({
					'status': 'Incorrect Password'
				});
			}
		});
	});
});


//SIGNUP ROUTE
router.post('/app/user', function(req, res){
	var password = req.body.password;
	bcrypt.hash(password, saltRounds, function(err, hash){
		if(err){
			throw err;
		}
		var sql = 'INSERT INTO users(username, password) VALUES (?, ?)';
		var values = [req.body.username, hash];
		con.query(sql, values, function(err, result){
			if(err){
				throw err;
			}
			res.status(200).json({
				'status': 'Account Created'
			});
		});
	});
});


//GET THE LIST OF USERNAME AND PASSWORDS
router.get('/app/sites/list', function(req, res){
	var userId = req.query.user;
	var decoded = jwt.verify(userId, secret);
	var sql = 'SELECT * FROM list WHERE userId = ?';
	con.query(sql, decoded.userId, function(err, result){
		if(err){
			throw err;
		}
        var ans = [];
        for (let i = 0; i < result.length; i++) {
            var decoded = jwt.verify(result[i].password, secret);
            var obj = {
            	'website': result[i].website,
            	'username': result[i].username,
            	'password': decoded
            }
            ans.push(obj);
        }

        return res.status(200).json({
        	ans
        });
	});
});


//ADD NEW USERNAME PASSWORD
router.post('/app/sites', function(req, res){
	var userId = req.query.user;
	var decoded = jwt.verify(userId, secret);

	var sql = 'SELECT * FROM users WHERE id = ?';
	con.query(sql, decoded.userId, function(err, foundUser){
		if(err){
			throw err;
		}
		else{
			if(foundUser.length == 0){
				res.status(500).json({
					'status': 'Incorrect userId'
				});
			}
			else{
				var password = req.body.password;
				jwt.sign(password, secret, function(err, hash){
					if(err){
						console.log(err.message);
					}
					var sql = 'INSERT INTO list(website, username, password, userId) VALUES (?, ?, ?, ?)';
					var values = [req.body.website, req.body.username, hash, decoded.userId];
					con.query(sql, values, function(err, result){
						if(err){
							throw err;
						}
						res.status(400).json({
							'status': 'Success'
						});
					});
				});
			}
		}
	})
});


module.exports = router;