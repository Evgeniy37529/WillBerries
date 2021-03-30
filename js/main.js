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

const openModal = function(){
	modalCart.classList.add('show');
}

const closeModal = function(){
	modalCart.classList.remove('show');
}

buttonCart.addEventListener('click' , openModal);

modalCart.addEventListener('click' , function(event){
	const target = event.target;
	if(!target.closest('.modal') || target.classList.contains('modal-close')){
		closeModal()
	}
});

//scroll smooth
(function(){
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for(let i = 0; i < scrollLinks.length; i++){
		scrollLinks[i].addEventListener('click' , function(event){
		event.preventDefault();
		const id = scrollLinks[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({behavior: 'smooth',
		block: 'start',
												})
		})
	}
})();

//goods

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const viewAccessories = document.querySelector('.accessories');
const viewSweaters = document.querySelector('.sweaters');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');

const getGoods = async function() {
	const result = await fetch('db/db.json');
	if(!result.ok){
		throw 'Ошибка запроса данных'
	}
	return result.json();
}

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

more.addEventListener('click' , function(event){
	event.preventDefault();
	getGoods().then(renderCards);
})


const filterCards = function(field, value){
	getGoods().then(function(data){
		const filteredGood = data.filter(function(good){
			return good[field] === value;
		})
		return filteredGood;
	})
	.then(renderCards);
}

navigationLink.forEach(function(link){
	link.addEventListener('click' , function(event){
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