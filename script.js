document.addEventListener('DOMContentLoaded', function()
 {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() 
    {
        mobileMenu.classList.toggle('hidden');
    });
    
    const bannerSlider = document.getElementById('banner-slider');
    const prevBannerBtn = document.getElementById('prev-banner');
    const nextBannerBtn = document.getElementById('next-banner');
    const bannerIndicators = document.querySelectorAll('.banner-indicator');
    let currentBannerIndex = 0;
    const totalBanners = 3;
    
    function showBanner(index)
     {
        bannerSlider.style.transform = `translateX(-${index * 100}%)`;
        
        bannerIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        bannerIndicators[index].classList.add('active');
        
        currentBannerIndex = index;
    }
    
    prevBannerBtn.addEventListener('click', function() {
        let newIndex = currentBannerIndex - 1;
        if (newIndex < 0) newIndex = totalBanners - 1;
        showBanner(newIndex);
    });
    
    nextBannerBtn.addEventListener('click', function() {
        let newIndex = currentBannerIndex + 1;
        if (newIndex >= totalBanners) newIndex = 0;
        showBanner(newIndex);
    });
    
    bannerIndicators.forEach(indicator => 
        {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showBanner(index);
        });
    });
    
    // Auto slide er jonno
    let bannerInterval = setInterval(function()
     {
        let newIndex = currentBannerIndex + 1;
        if (newIndex >= totalBanners) newIndex = 0;
        showBanner(newIndex);
    }, 5000);
    
    // mouse dile sliding kora bondo er jonno
    bannerSlider.addEventListener('mouseenter', function() {
        clearInterval(bannerInterval);
    });
    
    bannerSlider.addEventListener('mouseleave', function() {
        bannerInterval = setInterval(function() {
            let newIndex = currentBannerIndex + 1;
            if (newIndex >= totalBanners) newIndex = 0;
            showBanner(newIndex);
        }, 5000);
    });
    
    // Cart functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryChargeElement = document.getElementById('delivery-charge');
    const discountAmountElement = document.getElementById('discount-amount');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const applyDiscountBtn = document.getElementById('apply-discount');
    const discountCodeInput = document.getElementById('discount-code');
    const discountMessage = document.getElementById('discount-message');
    const checkoutButton = document.getElementById('checkout-button');
    
    let cart = [];
    const deliveryCharge = 5.00;
    let discountPercentage = 0;
    
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    });
    
    overlay.addEventListener('click', function() {
        cartSidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    });
    
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add some products before checkout.');
            return;
        }
    
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'fixed inset-0 flex items-center justify-center z-50';
        confirmationModal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50"></div>
            <div class="bg-white rounded-lg p-8 max-w-md w-full relative z-10">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <i class="fas fa-check text-green-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Order Placed Successfully!</h3>
                    <p class="text-gray-600 mb-6">Thank you for your purchase. Your order has been received and is being processed.</p>
                    <div class="border-t border-b border-gray-200 py-4 mb-6">
                        <div class="flex justify-between mb-2">
                            <span class="font-medium">Order Total:</span>
                            <span class="font-bold">${totalPriceElement.textContent}</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <p>A confirmation email has been sent to your email address.</p>
                        </div>
                    </div>
                    <button id="continue-shopping" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationModal);
        
        document.getElementById('continue-shopping').addEventListener('click', function() {
            document.body.removeChild(confirmationModal);
            cartSidebar.classList.add('translate-x-full');
            overlay.classList.add('hidden');
            
            cart = [];
            updateCart();
            saveCartToLocalStorage();
        });
        
        document.body.style.overflow = 'hidden';
        
        document.getElementById('continue-shopping').addEventListener('click', function() {
            document.body.style.overflow = '';
        });
    });
    
    function updateCart() {

        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-gray-500 py-8" id="empty-cart-message">
                    Your cart is empty
                </div>
            `;
            return;
        }
        
        // item card e add kora
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'flex items-start border-b pb-4 mb-4';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image rounded mr-3">
                <div class="flex-grow">
                    <h4 class="font-semibold">${item.title}</h4>
                    <div class="flex items-center mt-1">
                        <button class="decrease-quantity bg-gray-200 px-2 rounded-l" data-index="${index}">-</button>
                        <span class="px-3 bg-gray-100">${item.quantity}</span>
                        <button class="increase-quantity bg-gray-200 px-2 rounded-r" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item text-red-500 text-sm mt-1" data-index="${index}">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });
        
        addCartItemEventListeners();
        
        updateCartTotal();
        updateCartCount();
        saveCartToLocalStorage();
    }
    
    function addCartItemEventListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index] && cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index]) {
                    cart[index].quantity++;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index]) {
                    cart.splice(index, 1);
                    updateCart();
                }
            });
        });
    }
    
    function updateCartTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountAmount = (subtotal * discountPercentage) / 100;
        const total = subtotal + deliveryCharge - discountAmount;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        discountAmountElement.textContent = `-$${discountAmount.toFixed(2)}`;
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = count;
        cartCountElement.classList.add('pulse');
        setTimeout(() => {
            cartCountElement.classList.remove('pulse');
        }, 500);
    }
    
    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${product.title} added to cart!`);
    }
    
    function showNotification(message) 
    {
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.className = 'fixed bottom-4 right-4 z-50';
            document.body.appendChild(notificationContainer);
        }
        const notification = document.createElement('div');
        notification.className = 'bg-green-600 text-white px-4 py-3 rounded shadow-lg mb-2 flex items-center transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode === notificationContainer) {
                    notificationContainer.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    applyDiscountBtn.addEventListener('click', function() {
        const code = discountCodeInput.value.trim().toUpperCase();
        
        if (code === 'ARMAN') {
            discountPercentage = 20;
            discountMessage.textContent = 'Discount applied: 20% off!';
            discountMessage.classList.remove('hidden');
            updateCartTotal();
            showNotification('20% discount applied!');
        } else if (code === 'WASIF') {
            discountPercentage = 10;
            discountMessage.textContent = 'Discount applied: 10% off!';
            discountMessage.classList.remove('hidden');
            updateCartTotal();
            showNotification('10% discount applied!');
        } else {
            discountMessage.textContent = 'Invalid discount code.';
            discountMessage.classList.remove('hidden');
            discountMessage.classList.remove('text-green-600');
            discountMessage.classList.add('text-red-600');
            return;
        }
        
        discountMessage.classList.remove('text-red-600');
        discountMessage.classList.add('text-green-600');
        saveCartToLocalStorage();
    });

    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search-products');
    let products = [];
    
   function initializeProducts()
    {
    console.log('Fetching products from API...');
    fetch('https://arman231294-code.github.io/api/products.json')
        .then(res => res.json())
        .then(data => {
            products = data.products;
            console.log(`Loaded ${products.length} products`);

            displayProducts(products);
            setupCategoryFilters(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

    function setupCategoryFilters(allProducts) {
        const categories = [...new Set(allProducts.map(product => product.category))];
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'flex flex-wrap gap-2 mb-6';
    
        const allButton = document.createElement('button');
        allButton.className = 'bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition';
        allButton.textContent = 'All';
        allButton.addEventListener('click', () => {
            categoryContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('bg-green-600', 'text-white');
                btn.classList.remove('bg-green-700', 'text-white');
                btn.classList.add('bg-green-100', 'text-green-800');
            });
            
            allButton.classList.remove('bg-green-100', 'text-green-800');
            allButton.classList.add('bg-green-600', 'text-white');
        
            displayProducts(products);
        });
        
        categoryContainer.appendChild(allButton);
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition';
            button.textContent = category;
            
            button.addEventListener('click', () => {

                categoryContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('bg-green-600', 'text-white');
                    btn.classList.remove('bg-green-700', 'text-white');
                    btn.classList.add('bg-green-100', 'text-green-800');
                });
                
                button.classList.remove('bg-green-100', 'text-green-800');
                button.classList.add('bg-green-600', 'text-white');
                
                const filteredProducts = products.filter(product => product.category === category);
                displayProducts(filteredProducts);
            });
            
            categoryContainer.appendChild(button);
        });
        
        productsContainer.parentNode.insertBefore(categoryContainer, productsContainer);
    }
    
    function displayProducts(productsToDisplay) {
        productsContainer.innerHTML = '';
        
        if (!productsToDisplay || productsToDisplay.length === 0) 
            {
            productsContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">No products found matching your search.</p>
                </div>
            `;
            return;
        }
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
            productCard.innerHTML = `
                <div class="h-48 overflow-hidden">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <span class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">${product.category}</span>
                    <h3 class="font-semibold text-lg mt-2 line-clamp-1">${product.title}</h3>
                    <p class="text-gray-600 text-sm mt-1 line-clamp-2">${product.description}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xl font-bold">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" data-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                    cartSidebar.classList.remove('translate-x-full');
                    overlay.classList.remove('hidden');
                }
            });
        });
    }
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            displayProducts(products);
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displayProducts(filteredProducts);
    });
    
    const reviewsSlider = document.getElementById('reviews-slider');
    const prevReviewBtn = document.getElementById('prev-review');
    const nextReviewBtn = document.getElementById('next-review');
    const reviewIndicatorsContainer = document.getElementById('review-indicators');
    let currentReviewIndex = 0;
    let reviewsPerView = 1;

    const reviews = [
        {
            name: "Arman",
            rating: 5,
            comment: "The produce is always fresh and the delivery is prompt. I've been a customer for over a year and have never been disappointed!",
            image: "https://scontent-sin11-1.xx.fbcdn.net/v/t39.30808-1/488861209_644744888163711_5371721531012223372_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFe6cyETzCSR_nz4SaEfuImuMP2TpV2ti64w_ZOlXa2LnleAcVbW8Fj8xaFe9ykBHuXi9LRHBxHm97lKIlZpFwO&_nc_ohc=JIKS-NMOrGQQ7kNvwEz2Xw_&_nc_oc=AdmJm63N5WwlW9oVb8JcZfc8tl4s55CiLsEXw_AApUYFc2X3I1SttswvzMKtvmJrn-vfSpW3hEuGLIrd1i5S0QWV&_nc_zt=24&_nc_ht=scontent-sin11-1.xx&_nc_gid=IQWGL1Gy3Tiz6pLuUpLw7Q&oh=00_AfK9UmTgXLJQlY09keyoq6sW-URdDtVknKnozobbk5d0-Q&oe=682D1FC0"
        },
        {
            name: "Asiful Ahsan",
            rating: 4,
            comment: "Great selection of organic products. The app is easy to use and the delivery is always on time.",
            image: "https://scontent-sin2-1.xx.fbcdn.net/v/t39.30808-1/340477409_6141281709271240_2040962325505104022_n.jpg?stp=c0.0.720.721a_dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEgklEKkiAv26Kzq2GunDB66T2SklSswlHpPZKSVKzCUeE6rhijOrV-d7ocyyb24YMMKrN0qD4Z0tBlMomXh7at&_nc_ohc=mTE_x_ONpoUQ7kNvwGD9nNX&_nc_oc=AdlO3_5st7OaSEv-XS98rOv56bu5aKopWzRGW1-0tR6TPvkaYmTctMKYhYTUgzHgTzrVfXNrDvPqwaP9C29U2nQb&_nc_zt=24&_nc_ht=scontent-sin2-1.xx&_nc_gid=uD3yJ8MwnnExjwhhw7RsLw&oh=00_AfLGcR0uBM7KCjee-VkRM08N5hasfMaEU2hhjyArKNAxyg&oe=682D17D7"
        },
        {
            name: "Riyazul Arafat",
            rating: 5,
            comment: "I love the quality of their fruits and vegetables. Everything is always fresh and tastes amazing!",
            image: "https://scontent-sin2-1.xx.fbcdn.net/v/t39.30808-6/481184240_654071753742461_2594293590091641356_n.jpg?stp=c0.119.1440.1440a_dst-jpg_s206x206_tt6&_nc_cat=100&ccb=1-7&_nc_sid=714c7a&_nc_eui2=AeFbRQaTj4K_3XFgZA3AQfLm1Sru74oYEbnVKu7vihgRuSeS-yXuZlXYQWahgyQP-XjYjZMoAxDIz7cnWzCrWaQZ&_nc_ohc=VRkrs8-DX0kQ7kNvwE3JN3d&_nc_oc=AdkGpL5yKGwSQW_upYFqwnfzG1oDaxRdaZyABQNouoqEVLnVCf0NqaPGxMO_4ZCQzi8Y64sjoONCM9iaUWFmeVND&_nc_zt=23&_nc_ht=scontent-sin2-1.xx&_nc_gid=NT4Dk-HqTame1oGnppowiQ&oh=00_AfJGN4klR0o_mQhEUwW5jt66_0JoXfHJEmmGegbDr9amlA&oe=682CF894"
        },
        {
            name: "Abdullah Al Mahfuz",
            rating: 4,
            comment: "The discount codes are great and save me a lot of money. Customer service is also excellent.",
            image: "https://scontent-sin6-3.xx.fbcdn.net/v/t39.30808-6/484618421_2142048186315403_6253314934238801521_n.jpg?stp=cp6_dst-jpg_s960x960_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG-h18E9kz54b2rfKmZRW3-vjVbvqtxZ82-NVu-q3FnzXK31IFx_Q2BdmsTXxPPHG_5xxZIi376uiEUHNfpxcdj&_nc_ohc=-VlR8XMbu_QQ7kNvwGozasj&_nc_oc=Adl9M9w2-ZXfmJ8n2VIF5ndBWdvRvdGh8ha2PhR0nlQixmHbNk3zqW9TO08PWmp1GxG99D8LIxM7ESdyuKtQ5g6S&_nc_zt=23&_nc_ht=scontent-sin6-3.xx&_nc_gid=R4MIp85vtn9Y0Yt08vPFcw&oh=00_AfJhyd4RHJRIMH7l1xNx9ju-8FWpGtyp3dCcVVN7wMGqsw&oe=682D06A5"
        },
        {
            name: "Mohammad Imran ",
            rating: 5,
            comment: "I've tried several grocery delivery services, and Fresh Mart is by far the best. Their products are top quality!",
            image: "https://scontent-sin11-1.xx.fbcdn.net/v/t39.30808-1/467585247_1773865363441184_8029708276153800339_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGb0_cyNi0mp8OD3Iu5XWaLIcwggbOMCiohzCCBs4wKKjfKWic9J08QhImKxyHVIr8nBXG9Ud4isjrPipB0MTbJ&_nc_ohc=9GD4DHUhchQQ7kNvwEb2jxd&_nc_oc=AdnXBpM-MSvepPc9ZmuB0wLLS9TilwaP3RjGNf7CC7DRO32CV43vH3d8Kt8MgqpyAY32OMSZLdq7dYveDawRnmPY&_nc_zt=24&_nc_ht=scontent-sin11-1.xx&_nc_gid=DWl4A5D8m0ktjXkotjuiWA&oh=00_AfKVO_GUs8Dr5glJUQFHHGOhA6ojDCzA5pcA9nFTiCrcMQ&oe=682D49D6"
        }
    ];
    
    function displayReviews() {
        reviewsSlider.innerHTML = '';
        
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card p-6';
            
            let stars = '';
            for (let i = 0; i < 5; i++) {
                if (i < review.rating) {
                    stars += '<i class="fas fa-star text-yellow-400"></i>';
                } else {
                    stars += '<i class="far fa-star text-yellow-400"></i>';
                }
            }
            
            reviewCard.innerHTML = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <img src="${review.image}" alt="${review.name}" class="w-12 h-12 rounded-full mr-4">
                        <div>
                            <h4 class="font-semibold">${review.name}</h4>
                            <div class="text-yellow-400">
                                ${stars}
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600">"${review.comment}"</p>
                </div>
            `;
            
            reviewsSlider.appendChild(reviewCard);
        });
        
        updateReviewsPerView();
        const totalWidth = (reviews.length / reviewsPerView) * 100;
        reviewsSlider.style.width = `${totalWidth}%`;
        
        reviewIndicatorsContainer.innerHTML = '';
        const totalReviews = reviews.length;
        
        for (let i = 0; i < totalReviews; i++) {
            const indicator = document.createElement('button');
            indicator.className = `h-2 w-8 bg-green-200 rounded-full ${i === 0 ? 'bg-green-600' : ''}`;
            indicator.setAttribute('data-index', i);
            
            indicator.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showReview(index);
            });
            
            reviewIndicatorsContainer.appendChild(indicator);
        }
        
        showReview(currentReviewIndex);
    }
    
    function updateReviewsPerView() {
        if (window.innerWidth >= 1024) {
            reviewsPerView = 3;
        } else if (window.innerWidth >= 768) {
            reviewsPerView = 2;
        } else {
            reviewsPerView = 1;
        }
    }
    
    function showReview(index) {
        const totalReviews = reviews.length;
        if (index < 0) index = totalReviews - 1;
        if (index >= totalReviews) index = 0;
        
        const cardWidthPercentage = 100 / reviewsPerView;
        const translateValue = index * cardWidthPercentage;
        reviewsSlider.style.transform = `translateX(-${translateValue}%)`;
        
        const indicators = reviewIndicatorsContainer.querySelectorAll('button');
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('bg-green-600');
                indicator.classList.remove('bg-green-200');
            } else {
                indicator.classList.remove('bg-green-600');
                indicator.classList.add('bg-green-200');
            }
        });
        
        currentReviewIndex = index;
    }
    
    prevReviewBtn.addEventListener('click', function() {
        showReview(currentReviewIndex - 1);
    });
    
    nextReviewBtn.addEventListener('click', function() {
        showReview(currentReviewIndex + 1);
    });
    
    window.addEventListener('resize', function() {
        updateReviewsPerView();
        const totalWidth = (reviews.length / reviewsPerView) * 100;
        reviewsSlider.style.width = `${totalWidth}%`;
        showReview(currentReviewIndex);
    });
    
    
    function saveCartToLocalStorage() {
        localStorage.setItem('freshMartCart', JSON.stringify({
            items: cart,
            discount: discountPercentage
        }));
    }
    

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('freshMartCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            cart = parsedCart.items || [];
            discountPercentage = parsedCart.discount || 0;
            
            if (discountPercentage > 0) {
                if (discountPercentage === 20) {
                    discountMessage.textContent = 'Discount applied: 20% off!';
                } else if (discountPercentage === 10) {
                    discountMessage.textContent = 'Discount applied: 10% off!';
                }
                discountMessage.classList.remove('hidden');
                discountMessage.classList.remove('text-red-600');
                discountMessage.classList.add('text-green-600');
            }
            
            updateCart();
        }
    }
    
    console.log('Initializing application...');
    initializeProducts(); 
    displayReviews();
    loadCartFromLocalStorage();
});