const bcrypt = require('bcryptjs')
const tku = require('./en-de-coders')
const log = require('debug')('users-d')

var users = require('nano')(process.env.DB_URL)

function equalPassws (usrPass, usrDbPass) {
  return bcrypt.compareSync(usrPass, usrDbPass)
}

function getUsername(usrToken){
  const decoded = tku.verifyToken(usrToken)
  if (decoded.valid) {
      return decoded.username
  } else {
      return false
  }
}

function isAdmin(usrToken) {
  return new Promise((resolve, reject) => {
      const username = getUsername(usrToken)
      log(`Request done by ${username}`)
      users.get(username, (error, success) => {
  	     if (success && success.isAdmin) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
  })

}

function createUser(usrName, passw, isAdmin) {
  return new Promise((resolve, reject) => {
    // Vérifier si c'est le premier utilisateur
    users.list({ limit: 1 }, (err, body) => {
      if (err) {
        reject(new Error(`Error checking existing users. Reason: ${err.reason}.`));
        return;
      }

      // Si aucun utilisateur n'existe, définir isAdmin à true pour le premier utilisateur
      const isFirstUser = body.total_rows === 0;
      const isAdminFlag = isFirstUser ? true : Boolean(isAdmin);

      // Création de l'utilisateur
      users.insert(
        { 
          'passw': bcrypt.hashSync(passw, bcrypt.genSaltSync()),
          'isAdmin': isAdminFlag
        },
        usrName, 
        (error, success) => {
          if (success) {
            resolve(tku.encodeToken(usrName));
          } else {
            reject(new Error(`In the creation of user (${usrName}). Reason: ${error.reason}.`));
          }
        }
      );
    });
  });
}

function getUser (usrName, passw) {
  return new Promise((resolve, reject) => {
    users.get(usrName, (error, success) => {
      if (success) {
        if (!equalPassws(passw, success.passw)) {
          reject(new Error(`Passwords (for user: ${usrName}) do not match.`))
        }
        resolve(tku.encodeToken(usrName))
      } else {
        reject(new Error(`To fetch information of user (${usrName}). Reason: ${error.reason}.`))
      }
    })
  })
}

function verifyToken (usrToken) {
  return new Promise((resolve, reject) => {
    const username = getUsername(usrToken)
    if (username) {
        resolve(username);
    } else {
      reject(new Error(`Token invalid !`))
    }
  })
}

function setAdmin(token, targetUser) {
  return new Promise((resolve, reject) => {
    // Vérifier si l'utilisateur qui fait la demande est un administrateur
    isAdmin(token)
    .then(isAdmin => {
      if (!isAdmin) {
        reject(new Error("Unauthorized"));
      }
      // Récupérer l'utilisateur cible de la base de données
      users.get(targetUser, (error, userDoc) => {
        if (error) {
          reject(new Error(`Erreur lors de la récupération de l'utilisateur cible: ${error}`));
          return;
        }

        // Mettre à jour l'utilisateur cible comme administrateur
        userDoc.isAdmin = true;

        // Enregistrer les modifications dans la base de données
        users.insert(userDoc, targetUser, (error, success) => {
          if (error) {
            reject(new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error}`));
          } else {
            resolve(`L'utilisateur ${targetUser} est maintenant administrateur.`);
          }
        });
      });
    })
    .catch(error => {
      reject(error);
    });
  });
}

function sendLog(service, token, timestamp, eventType, eventDetails, responseTime) {
  // Construct the log object
  const logData = {
    token: token,
    timestamp: timestamp,
    service: service,
    eventType: eventType,
    eventDetails : eventDetails,
    responseTime: responseTime,
  };

  // Print information about the log in the console
  log(logData)
  // Send the log data to the log service
  return axios.post(`http://${user_service}/log/`, logData, {
    headers: { token: token }
  });
}

module.exports = {
  createUser,
  getUser,
  verifyToken,
  setAdmin,
  sendLog

}
