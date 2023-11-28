const express = require('express')
const log = require('debug')('users-d')

const app = express.Router()
const utils = require('./utils/crud-wp')

const service = "user-service"

app.post('/user/', (req, res) => {
  var username = req.body.username
  var password = req.body.password

  const operation = "UserCreation"
  utils.sendLog(null, service, "INFO", operation, `Creating new user : ${username}`, 0)
  
  return utils.createUser(username, password)
    .then((result) => {  // res is the token for new user
      utils.sendLog(result, service, "INFO", operation, `${username} successfully created`, 0)
      res.status(200).json({ status: 'success', result})
    })
    .catch((error) => {
      utils.sendLog(null, service, "ERROR", operation, `${username} not created. Details : ${error}`, 0)
      res.status(404).json({ status: 'error'})
    })
})

// Change GET method to POST method for more security
// Get User Token 
app.get('/user/authenticate/', (req, res) => {
  var username = req.header.username
  var password = req.header.password
  
  const operation = "UserAuthentification"
  utils.sendLog(null, service, "INFO", operation, `Authentificating ${username}`, 0)

  return utils.getUser(username, password)
    .then((result) => {  //res is the token
      utils.sendLog(result, service, "INFO", operation, `${username} successfully authentificated`, 0)
      res.status(200).json({ status: 'success', token })
    })
    .catch((error) => {
      utils.sendLog(null, service, "ERROR", operation, `${username} not authentificated. Details : ${error}`, 0)
      res.status(404).json({ status: 'error', message : String(err)})
    })
})

// Check if token exist for a user in the database
app.get('/user/validate/', (req, res) => {
  var token = req.header.token;
  log(`Verifying token (${token})`);
  return utils.verifyToken(token)
    .then((username) => {
      res.status(200).json({ status: 'success', username })
    })
    .catch((error) => {
      res.status(404).json({ status: 'error', message: String(error) })
    })
})



// Route to set a user as an admin
app.put('/user/setAdmin', (req, res) => {
  const token = req.header.token;
  const username = req.body.username;
  
  const operation = "setAdminOperation"
  utils.sendLog(token, service, "INFO", operation, `Trying to set ${username} as an admin`, 0)

  return utils.setAdmin(token, username)
    .then((result) => {
      utils.sendLog(result, service, "INFO", operation, `${username} is now admin`, 0)
      res.status(200).json({ status: 'success', result})
    })
    .catch((err) => {
      utils.sendLog(result, service, "ERROR", operation, `${username} is not admin. Details : ${err}`, 0)
      res.status(404).json({ status: 'error', message: String(err) })
    })
})




module.exports = app
