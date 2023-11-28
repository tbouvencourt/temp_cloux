const express = require('express')
const log = require('debug')('users-d')

const app = express.Router()
const db = require('./utils/crud-wp')

app.post('/product/createItem/', (req, res) => {
  var name = req.body.name
  var price = req.body.price
  var image = req.body.image
  var category = req.body.category
  
  //log(`Creating a new order (${order.}) identified with "${usrPassw}"`)
  return db.createItem(name,price,image,category)
    .then((item) => {
      res.status(200).json({ status: 'success', item })
    })
    .catch((err) => {
      res.status(409).json({ status: 'error', message: String(err) })
    })
})

app.post('/product/delItem/', (req, res) => {
  var id = req.body.id;
    return db.deleteItem(id)
        .then(() => {
            res.status(200).json({ status: 'success', message: 'Item deleted successfully' });
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) });
        });
});

app.post('/product/updateItem/', (req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;

  return db.updateItem(id, name, price, image)
    .then((result) => {
      res.status(200).json({ status: 'success', message: 'Item updated successfully', result });
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) });
    });
});

app.post('/product/initOrder/', (req, res) => {
  const data = {
		Vegetables: [
			{
				name: 'Brocolli',
				price: 2.73,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg',
				category: 'Vegetables'
			},
			{
     
				name: 'Cauliflower',
				price: 6.3,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg',
				category: 'Vegetables'
			},
			{
      
				name: 'Cucumber',
				price: 5.6,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg',
				category: 'Vegetables'
			},
			{
        
				name: 'Beetroot',
				price: 8.7,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/beetroot.jpg',
				category: 'Vegetables'
			}
		],
		Fruits: [
			{
      
				name: 'Apple',
				price: 2.34,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/apple.jpg',
				category: 'Fruits'
			},
			{
      
				name: 'Banana',
				price: 1.69,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/banana.jpg',
				category: 'Fruits'
			},
			{
        
				name: 'Grapes',
				price: 5.98,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/grapes.jpg',
				category: 'Fruits'
			},
			{
       
				name: 'Mango',
				price: 6.8,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/mango.jpg',
				category: 'Fruits'
			}
		]
	};

  for (const category in data) {
      for (const item of data[category]) {
          db.createItem(item.name, item.price, item.image, category)
              .then(success => console.log(success))
              .catch(error => console.error(error));
      }
  }

  res.status(200).json({ status: 'success', message: 'Data inserted successfully' });
});

app.get('/product/items/', (req, res) => {
  return db.list({ include_docs: true })
    .then((body) => {
      let items = body.rows.map(row => {
        return {
          id: row.doc.id,
          name: row.doc.name,
          price: row.doc.price,
          image: row.doc.image,
          category: row.doc.category,
        };
      });
      let sortedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      res.status(200).json({ status: 'success', items: sortedItems})
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
});


module.exports = app
