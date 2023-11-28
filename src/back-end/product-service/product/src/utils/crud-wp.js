const bcrypt = require('bcryptjs')
const tku = require('./en-de-coders')


const nano = require('nano')(process.env.DB_URL);
const db = nano.use(process.env.DB_NAME);


/*
Cette fonction prend un objet item en argument et 
retourne une promesse. L'objet item doit avoir une 
propriété id. La fonction tente d'insérer un nouvel 
ordre dans la base de données CouchDB. Si l'insertion 
réussit, la promesse est résolue avec le résultat de 
l'insertion. Si l'insertion échoue, la promesse est 
rejetée avec une erreur.
*/
function createItem (name,price,image,category) {
  return new Promise((resolve, reject) => {
    var id = crypto.randomUUID();
    db.insert(
      // argument of nano.insert()
      {
        '_id': id,
        'id': id,
        'name': name,
        'price': parseFloat(price),
        'image': image,
        'category': category,
			},
      // callback to execute once the request to the DB is complete
      (error, success) => {
        if (success) {
          resolve(success)
        } else {
          reject(
            new Error(`In the creation of order. Reason: ${error.reason}.`) )
        }
      }
    )
  })
}

function deleteItem(id) {
  return new Promise((resolve, reject) => {
    // First, get the existing document
    db.get(id, (err, existing) => {
      if (!err) {
        // Delete the document using its ID and _rev
        db.destroy(existing._id, existing._rev, (err, body) => {
          if (!err) {
            resolve(body);
          } else {
            reject(new Error(`Failed to delete item (${id}). Reason: ${err.reason}.`));
          }
        });
      } else {
        reject(new Error(`Failed to find item (${id}). Reason: ${err.reason}.`));
      }
    });
  });
}

function updateItem(id, name, price, image) {
  return new Promise((resolve, reject) => {
    // First, get the existing document
    db.get(id, (err, existing) => {
      if (!err) {
        // Update the document with the new fields
        const updatedDoc = { ...existing, name, price, image };

        // Save the updated document back to the database
        db.insert(updatedDoc, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`Failed to update item (${id}). Reason: ${err.reason}.`));
          }
        });
      } else {
        reject(new Error(`Failed to find item (${id}). Reason: ${err.reason}.`));
      }
    });
  });
}

function list (options) {
  return new Promise((resolve, reject) => {
    db.list(options, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(
          new Error(`To fetch information of order. Reason: ${error.reason}.`) )
      }
    })
  })
}


module.exports = {
  createItem,
  list,
  deleteItem,
  updateItem
};

