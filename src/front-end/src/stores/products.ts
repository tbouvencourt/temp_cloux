import { derived, writable } from 'svelte/store';
import axios from "axios";
import { env } from "$env/dynamic/public";


const url = "http://192.168.1.36";


export const products = createDynamicProducts(); // Export le catalogue


function createDynamicProducts() {
	const { subscribe, set, update } = writable([]); // Initialise le catalogue

	dynamicCatalog().then((items) => { // Récupère les items
		console.log(items); // Affiche les items dans la console
		set(items); // Initialise le catalogue avec les items récupérés
	});
	
	return { 
		subscribe, 
		update,
		set,
		__addProduct: (product) =>
			update((oldProducts) => {
				var id_hash = crypto.randomUUID();
				if (!(product.category in oldProducts)) {
					oldProducts[product.category] = [];
				}
				oldProducts[product.category].push({ ...product, id: id_hash  });
				return oldProducts; // Ajoute le produit au catalogue
			})
	};
}



function dynamicCatalog() { 
    	return axios
        .get(`${url}/product/items/`) // Récupère les items
        .then((res) => {
            return res.data.items; // Retourne les items
        })
        .catch((error) => {
            console.error(error);
        });
}
function staticCatalog() {
	return {
		Vegetables: [
			{
				id: 1,
				name: 'Brocolli',
				price: 2.73,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg',
				category: 'Vegetables'
			},
			{
				id: 2,
				name: 'Cauliflower',
				price: 6.3,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg',
				category: 'Vegetables'
			},
			{
				id: 3,
				name: 'Cucumber',
				price: 5.6,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg',
				category: 'Vegetables'
			},
			{
				id: 4,
				name: 'Beetroot',
				price: 8.7,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/beetroot.jpg',
				category: 'Vegetables'
			}
		],
		Fruits: [
			{
				id: 5,
				name: 'Apple',
				price: 2.34,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/apple.jpg',
				category: 'Fruits'
			},
			{
				id: 6,
				name: 'Banana',
				price: 1.69,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/banana.jpg',
				category: 'Fruits'
			},
			{
				id: 7,
				name: 'Grapes',
				price: 5.98,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/grapes.jpg',
				category: 'Fruits'
			},
			{
				id: 8,
				name: 'Mango',
				price: 6.8,
				image:
					'https://res.cloudinary.com/sivadass/image/upload/v1493620045/dummy-products/mango.jpg',
				category: 'Fruits'
			}
		]
	};
}

 



export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});

