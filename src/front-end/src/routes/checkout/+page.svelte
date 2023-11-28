<script lang="ts">
	import { totalPrice, totalQuantity } from '@stores/cart';
	import { cart } from '@stores/cart';
	import { onMount } from 'svelte';
	import axios from "axios";

	let prevCheckout: any[];
	const url = "http://192.168.1.36";

	onMount(async () => {
		getCheckout();
		prevCheckout = JSON.parse(window.localStorage.getItem('checkout')) || [];
	});

	function getCheckout() {
        return new Promise((resolve, reject) => {
                axios.get(`${url}/order/get/`, {params: { token: JSON.parse(window.localStorage.getItem('auth')).token} })
                .then((res) => {
					console.log(res.data.result)
					window.localStorage.setItem('checkout', JSON.stringify(res.data.result));
					goto('/checkout');
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error, e.g., showing a toast notification
                });
            });
    }

	function createCheckout(checkout) {
        return new Promise((resolve, reject) => {
                axios.post(`${url}/order/create/`, {checkout:checkout}, {params: { token: JSON.parse(window.localStorage.getItem('auth')).token } })
                .then((res) => {
					window.sessionStorage.removeItem('cart');
					cart.update((old) => []);
					cart.updateRemote([])
					getCheckout();
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error, e.g., showing a toast notification
                });
            });
    }

	function handleCheckout() {
		let checkout = {
			items: $cart,
			extras: {
				totalQuantity: $totalQuantity,
				totalPrice: $totalPrice,
				date: new Date().toLocaleDateString('fr')
			}
		};
		createCheckout(checkout)
	}
</script>

<!-- Header-->
<header class="py-5 bg-gradient-to-r from-pink-500 to-yellow-500">
	<div class="container px-4 px-lg-5 my-3">
		<div class="text-center text-white">
			<h1 class="display-4 fw-bolder">Checkout</h1>
		</div>
	</div>
</header>
<div class="container p-3 max-w-4xl">
	<main>
		<div class="py-5 row g-5">
			<!-- Current cart -->
			<div class="col-md-6 col-lg-5 order-md-last">
				<h4 class="d-flex justify-content-end align-items-center mb-3">
					<span class="text-primary text-2xl pr-3">Your cart</span>
					<span class="badge bg-primary rounded-pill">{$totalQuantity}</span>
				</h4>
				<ul class="list-group mb-3">
					{#if $cart.length > 0}
						{#each $cart as item}
							<li class="list-group-item grid grid-flow-row-dense grid-cols-4 lh-sm">
								<img class="object-contain h-10 w-10" src={item.image} alt={item.name} />
								<div class="m-auto">{item.name}</div>
								<span class="text-body-secondary text-gray-500 m-auto">{item.quantity}</span>
								<span class="text-body-secondary text-gray-500 m-auto"
									>${item.price * item.quantity}</span
								>
							</li>
						{/each}
						<form method="POST" on:submit|preventDefault={handleCheckout}>
							<button
								class="w-100 btn btn-primary bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 border-none my-3"
								type="submit">Checkout</button
							>
						</form>
					{:else}
						<li class="list-group-item grid grid-flow-row-dense lh-sm">Your cart is empty</li>
					{/if}
				</ul>
			</div>
			<!-- Previous purchases -->
			<div class="col-md-6 col-lg-7">
				<h1 class="text-2xl mb-3 text-center">Purchase history</h1>
				<ul class="list-group mb-3">
					{#if prevCheckout}
						{#each prevCheckout as checkout}
							<li class="list-group-item grid grid-flow-row-dense grid-cols-2 lh-sm">
								{#each checkout.items as item}
									<div class="m-auto flex justify-end w-full">
										<img class="object-contain h-10 w-10" src={item.image} alt={item.name} />
										<span class="my-auto">
											{item.quantity} x
											{item.name}</span
										>
									</div>
									<span class="text-body-secondary text-gray-500 m-auto"
										>${item.price * item.quantity}</span
									>
								{/each}
								<div class="m-auto w-full pt-2 col-auto">Total: ${checkout.extras.totalPrice}</div>
							</li>
						{/each}
					{:else}
						<li class="list-group-item grid grid-flow-row-dense lh-sm">Your cart is empty</li>
					{/if}
				</ul>
			</div>
		</div>
	</main>
</div>
