/src/src/interfaces # cat AuthenticationService.jsx 
import axios from 'axios' // we use this library as HTTP client
// you can overwrite the URI of the authentication microservice
// with this environment variable

import LogsService from './LogsService'
const url = process.env.REACT_APP_AUTH_SERVICE_URL
class AuthenticationService {
    constructor () {
         this.logsService = new LogsService()
    }
    // setters
    setHandlers (onSucc, setAuthStatus, changeRoute) {
        this.onSucc = onSucc
        this.setAuthStatus = setAuthStatus
        this.changeRoute = changeRoute
    }
    // POST /user
    // ${data} is a JSON object with the fields
    // username=[string] and [password]. These fields
    // matches the specification of the POST call
    registerUser (data, onErr) {
        var start = performance.now()
        window.localStorage.setItem('username', JSON.stringify(data.username))
        data.username.substring(0,5) === 'admin' ? window.localStorage.setItem('role','admin') : window.localStorage.setItem('role','user')
        axios.post(${url}/user, data) // Perform an HTTP POST rquest to a url with the provided data.
            .then((res) => {
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                this.setAuthStatus(true)
                this.onSucc(Welcome ${data.username} ! You are logged in as ${data.role}  !)
                this.changeRoute('/')
                var end = performance.now()
                this.logsService.newRegistration(data.username)
                this.logsService.newPerformance(window.localStorage.getItem('role'),"users","registerUser",end-start)
            })
            .catch((error) => {
                console.error(error.message)
                var msg = Registration of user [${data.username}] failed.
                onErr(${msg} Error: ${error.msg})
            })
        
    }
    // GET /user/:username/:password
    loginUser (data, onErr) {
        var start = performance.now()
        window.localStorage.setItem('username', JSON.stringify(data.username));
        data.username.substring(0,5) === 'admin' ? window.localStorage.setItem('role','admin') : window.localStorage.setItem('role','user')
        axios.get(${url}/user/${data.username}/${data.password}) // Perform an HTTP GET rquest to a url.
            .then((res) => {
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                this.setAuthStatus(true)
                this.onSucc(Welcome back [${data.username}]!)
                this.changeRoute('/')
                var end = performance.now()
                this.logsService.newLogin(data.username);
                this.logsService.newPerformance(window.localStorage.getItem('role'),"users","loginUser",end-start);
            })
            .catch((error) => {
                console.error(error.message)
                onErr(User [${data.username}] is not registered or his credentials are incorrect.)
            })
    }
}