const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const viewAccessories = document.querySelector('.accessories');
const viewSweaters = document.querySelector('.sweaters');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTable = document.querySelector('.cart-table__goods');
const cartCount = document.querySelector('.cart-count');
const btnClearCart = document.querySelector('.clear-cart');
const cardTableTotal = document.querySelector('.card-table__total');
//console.log(modalForm);


const getGoods = async function() {
	const result = await fetch('db/db.json');
	if(!result.ok){
		throw 'Ошибка запроса данных'
	}
	return result.json();
}


const cart = {
	cartGoods:[
		
	],
	renderGoods(){
		cartTable.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) =>{
			const tr = document.createElement('tr');
			tr.className = 'cart-item';
			tr.dataset.id = id;
			tr.innerHTML = `
			<td>${name}</td>
			<td>${price}$</td>
			<td><button class="cart-btn-minus">-</button></td>
			<td>${count}</td>
			<td><button class="cart-btn-plus">+</button></td>
			<td>${price * count}$</td>
			<td><button class="cart-btn-delete">x</button></td>
		</tr>
			`;
			cartTable.append(tr);
		})
		const total = this.cartGoods.reduce((sum, item) =>{
			return sum + item.count * item.price;
		}, 0);
		cardTableTotal.textContent = total;
	},
	plusGoods(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				item.count++;
				break;
			}
			
		}
		this.renderGoods();
		this.countForCart();
	},
	minusGoods(id){
		for(const item of this.cartGoods){
			if(id === item.id){
				if(item.count <= 1){
					this.deleteGoods(id);
					
					
				}else{
					item.count--;
				}
				break;
			}
		}
		this.renderGoods();
		this.countForCart();
	},
	deleteGoods(id){
		this.cartGoods = this.cartGoods.filter(item => item.id !== id);
		this.renderGoods();
		this.countForCart();
		if(this.cartGoods.length === 0){
			this.clearCart();
		}
	},
	addGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if(goodItem){
			this.plusGoods(id);
			//this.countForCart();
			
		}else{
			getGoods()
						.then(data => data.find(item => item.id === id))
						.then(({name, price, id}) => {
							this.cartGoods.push({
								name, 
								price,
								id,
								count: 1,
							});
							this.countForCart();
						});
		}
	},
	countForCart(){
		cartCount.textContent = this.cartGoods.reduce((sum , item) =>{
			return sum + item.count;
		}, 0)
		
		/*
		const count = this.cartGoods.length;
		if(count === 0){
			cartCount.innerHTML = 0;
		}else{
			cartCount.innerHTML = count;
		}	*/
	},
	clearCart(){
		this.cartGoods.length = 0;
		this.countForCart();
		this.renderGoods();
		
	}
}

document.body.addEventListener('click' , event =>{
	const addToCart = event.target.closest('.add-to-cart');
	if(addToCart){
		cart.addGoods(addToCart.dataset.id);
	}
})

btnClearCart.addEventListener('click' , cart.clearCart.bind(cart));

cartTable.addEventListener('click' , event =>{
	const target = event.target;

	if(target.tagName === 'BUTTON'){
		const id = target.closest('.cart-item').dataset.id;

		if(target.classList.contains('cart-btn-minus')){
			cart.minusGoods(id);
		}
		if(target.classList.contains('cart-btn-plus')){
			cart.plusGoods(id);
		}
		if(target.classList.contains('cart-btn-delete')){
			cart.deleteGoods(id);
		}
	}
	
})

const openModal = function(){
	modalCart.classList.add('show');
	cart.renderGoods();
}

const closeModal = function(){
	modalCart.classList.remove('show');
}

buttonCart.addEventListener('click' , openModal);

modalCart.addEventListener('click' , function(event){
	const target = event.target;
	if(target.classList.contains('overlay') || target.classList.contains('modal-close')){
		closeModal()
	}
});

//scroll smooth
(function(){
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for(let i = 0; i < scrollLinks.length; i++){
		scrollLinks[i].addEventListener('click' , event =>{
		event.preventDefault();
		const id = scrollLinks[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({behavior: 'smooth',
		block: 'start',
												})
		})
	}
})();

//goods





const createCard = (objCard) =>{
		const card = document.createElement('div')
		card.className = 'col-lg-3 col-sm-6';
		card.innerHTML = `
		<div class="goods-card">
		${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
		<img src="db/${objCard.img}" alt="image: Hoodie" class="goods-image">
		<h3 class="goods-title">Embroidered Hoodie</h3>
		
		<p class="goods-description">${objCard.description}</p>
		
		<button class="button goods-card-btn add-to-cart" data-id=${objCard.id}>
		<span class="button-price">$${objCard.price}</span>
		</button>
		</div>
		`
	return card
}

const renderCards = data =>{
	longGoodsList.innerHTML = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
}

more.addEventListener('click' , (event) =>{
	event.preventDefault();
	getGoods().then(renderCards);
})


const filterCards = function(field, value){
	getGoods()
	.then(data => data.filter(good =>good[field] === value))
	.then(renderCards);
}

navigationLink.forEach(function(link){
	link.addEventListener('click' , event =>{
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		if(field){
			filterCards(field , value);
		}else{
			getGoods().then(renderCards)
		}
		
	})
})

showAcsessories.forEach(item =>{
	item.addEventListener('click' , event =>{
	event.preventDefault();
	filterCards('category' , 'Accessories');
	});
});

showClothing.forEach(item =>{
	item.addEventListener('click' , event =>{
	event.preventDefault();
	filterCards('category' , 'Clothing');
	});
});

//sendForm

const modalForm = document.querySelector('.modal-form');
const sendForm =  (postData) => fetch('server.php' , {
		method: 'POST',
		body: postData,
	})


modalForm.addEventListener('submit' , event =>{
	event.preventDefault();
	const formData = new FormData(modalForm);
	formData.append('cart' , JSON.stringify(cart.cartGoods));
	sendForm(formData).then(response =>{
							if(!response.ok){
								throw new Error(response.status);
							}
							alert('Спасибо, ваш заказ принят');
						})
						.catch((err) =>{
							alert('Повторите попытку позже');
							console.error(err);
						})
						.finally(() =>{
							closeModal();
							modalForm.reset();
							cart.clearCart();
						});
});
//sendForm('reffr');

