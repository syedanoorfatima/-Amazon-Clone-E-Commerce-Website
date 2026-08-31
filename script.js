// =====================================================
// AMAZON CLONE - COMPLETE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // PRODUCT DATA
    // =====================================================

    const products = [
        {
            id: 1,
            name: "Smart Watch",
            category: "Electronics",
            price: 69.99,
            oldPrice: 99.99,
            discount: 30,
            rating: 4.4,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
        },

        {
            id: 2,
            name: "Running Shoes",
            category: "Fashion",
            price: 49.99,
            oldPrice: 66.99,
            discount: 25,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
        },

        {
            id: 3,
            name: "Bluetooth Speaker",
            category: "Electronics",
            price: 39.99,
            oldPrice: 66.99,
            discount: 40,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
        },

        {
            id: 4,
            name: "Smartphone",
            category: "Electronics",
            price: 299.99,
            oldPrice: 374.99,
            discount: 20,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80"
        },

        {
            id: 5,
            name: "Premium Laptop",
            category: "Computers",
            price: 799.99,
            oldPrice: 1230,
            discount: 35,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
        },

        {
            id: 6,
            name: "Wireless Headphones",
            category: "Electronics",
            price: 89.99,
            oldPrice: 129.99,
            discount: 30,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
        }
    ];


    // =====================================================
    // LOCAL STORAGE
    // =====================================================

    let cart = JSON.parse(localStorage.getItem("amazonCart")) || [];

    let wishlist =
        JSON.parse(localStorage.getItem("amazonWishlist")) || [];


    // =====================================================
    // DOM ELEMENTS
    // =====================================================

    const cartElement = document.querySelector(".nav-cart");

    const cartCountElement =
        document.querySelector(".cart-count");

    const searchInput =
        document.querySelector(".search-input");

    const searchButton =
        document.querySelector(".search-icon");

    const searchSelect =
        document.querySelector(".search-select");

    const hero =
        document.querySelector(".hero-section");

    const heroLeft =
        document.querySelector(".hero-left");

    const heroRight =
        document.querySelector(".hero-right");

    const backToTop =
        document.querySelector(".footer-panel");


    // =====================================================
    // UPDATE CART COUNT
    // =====================================================

    function updateCartCount() {

        const totalItems = cart.reduce(
            (total, product) => total + product.quantity,
            0
        );

        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }


    // =====================================================
    // SAVE CART
    // =====================================================

    function saveCart() {

        localStorage.setItem(
            "amazonCart",
            JSON.stringify(cart)
        );

        updateCartCount();
    }


    // =====================================================
    // ADD TO CART
    // =====================================================

    function addToCart(product) {

        const existingProduct =
            cart.find(item => item.id === product.id);

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                ...product,
                quantity: 1
            });
        }

        saveCart();

        showNotification(
            `${product.name} added to cart!`
        );
    }


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    function removeFromCart(id) {

        cart = cart.filter(
            product => product.id !== id
        );

        saveCart();

        renderCart();
    }


    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    function increaseQuantity(id) {

        const product =
            cart.find(item => item.id === id);

        if (product) {
            product.quantity++;
        }

        saveCart();

        renderCart();
    }


    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    function decreaseQuantity(id) {

        const product =
            cart.find(item => item.id === id);

        if (!product) return;

        if (product.quantity > 1) {

            product.quantity--;

        } else {

            removeFromCart(id);
            return;
        }

        saveCart();

        renderCart();
    }


    // =====================================================
    // CART TOTAL
    // =====================================================

    function getCartTotal() {

        return cart.reduce(
            (total, product) =>
                total + product.price * product.quantity,
            0
        );
    }


    // =====================================================
    // CREATE CART SIDEBAR
    // =====================================================

    function createCartSidebar() {

        if (document.querySelector(".cart-sidebar")) {
            return;
        }

        const cartSidebar =
            document.createElement("div");

        cartSidebar.className = "cart-sidebar";

        cartSidebar.innerHTML = `

            <div class="cart-header">

                <h2>
                    <i class="fa-solid fa-cart-shopping"></i>
                    Your Cart
                </h2>

                <button class="close-cart">
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>

            <div class="cart-items"></div>

            <div class="cart-footer">

                <h3>
                    Total:
                    $<span class="cart-total">0.00</span>
                </h3>

                <button class="checkout-btn">
                    Proceed to Checkout
                </button>

            </div>

        `;

        document.body.appendChild(cartSidebar);


        // Close cart

        cartSidebar
            .querySelector(".close-cart")
            .addEventListener("click", closeCart);


        // Checkout

        cartSidebar
            .querySelector(".checkout-btn")
            .addEventListener("click", checkout);


        renderCart();
    }


    // =====================================================
    // OPEN CART
    // =====================================================

    function openCart() {

        createCartSidebar();

        document
            .querySelector(".cart-sidebar")
            .classList.add("active");
    }


    // =====================================================
    // CLOSE CART
    // =====================================================

    function closeCart() {

        const sidebar =
            document.querySelector(".cart-sidebar");

        if (sidebar) {
            sidebar.classList.remove("active");
        }
    }


    // =====================================================
    // RENDER CART
    // =====================================================

    function renderCart() {

        const cartItems =
            document.querySelector(".cart-items");

        const cartTotal =
            document.querySelector(".cart-total");

        if (!cartItems) return;


        // Empty cart

        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <h3>Your cart is empty</h3>

                    <p>Add some products to your cart.</p>

                </div>

            `;

            if (cartTotal) {
                cartTotal.textContent = "0.00";
            }

            return;
        }


        cartItems.innerHTML = "";


        cart.forEach(product => {

            const item =
                document.createElement("div");

            item.className = "cart-item";

            item.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <h3>${product.name}</h3>

                    <p class="cart-price">
                        $${product.price.toFixed(2)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            class="decrease"
                            data-id="${product.id}">
                            −
                        </button>

                        <span>
                            ${product.quantity}
                        </span>

                        <button
                            class="increase"
                            data-id="${product.id}">
                            +
                        </button>

                    </div>

                    <button
                        class="remove-item"
                        data-id="${product.id}">
                        Remove
                    </button>

                </div>

            `;

            cartItems.appendChild(item);
        });


        if (cartTotal) {

            cartTotal.textContent =
                getCartTotal().toFixed(2);
        }


        // Increase buttons

        document
            .querySelectorAll(".increase")
            .forEach(button => {

                button.addEventListener("click", () => {

                    increaseQuantity(
                        Number(button.dataset.id)
                    );

                });

            });


        // Decrease buttons

        document
            .querySelectorAll(".decrease")
            .forEach(button => {

                button.addEventListener("click", () => {

                    decreaseQuantity(
                        Number(button.dataset.id)
                    );

                });

            });


        // Remove buttons

        document
            .querySelectorAll(".remove-item")
            .forEach(button => {

                button.addEventListener("click", () => {

                    removeFromCart(
                        Number(button.dataset.id)
                    );

                    showNotification(
                        "Product removed from cart."
                    );

                });

            });
    }


    // =====================================================
    // CHECKOUT
    // =====================================================

    function checkout() {

        if (cart.length === 0) {

            showNotification(
                "Your cart is empty."
            );

            return;
        }

        alert(
            `Order placed successfully!\n\nTotal: $${getCartTotal().toFixed(2)}`
        );

        cart = [];

        saveCart();

        renderCart();

        closeCart();
    }


    // =====================================================
    // CART BUTTON
    // =====================================================

    if (cartElement) {

        cartElement.addEventListener(
            "click",
            openCart
        );
    }


    // =====================================================
    // PRODUCT CARD BUTTONS
    // =====================================================

    const productCards =
        document.querySelectorAll(".product-card");


    productCards.forEach((card, index) => {

        const product = products[index];

        if (!product) return;


        // Prevent adding when clicking random area

        card.style.cursor = "default";


        // Add button

        const addButton =
            document.createElement("button");

        addButton.className =
            "add-to-cart-btn";

        addButton.innerHTML = `
            <i class="fa-solid fa-cart-plus"></i>
            Add to Cart
        `;


        card.appendChild(addButton);


        addButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                addToCart(product);

            }
        );


        // Wishlist button

        const wishlistButton =
            document.createElement("button");

        wishlistButton.className =
            "wishlist-btn";

        wishlistButton.innerHTML =
            `<i class="fa-regular fa-heart"></i>`;


        card.appendChild(wishlistButton);


        wishlistButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleWishlist(
                    product,
                    wishlistButton
                );

            }
        );

    });


    // =====================================================
    // WISHLIST
    // =====================================================

    function toggleWishlist(product, button) {

        const exists =
            wishlist.some(
                item => item.id === product.id
            );


        if (exists) {

            wishlist =
                wishlist.filter(
                    item => item.id !== product.id
                );

            button.innerHTML =
                `<i class="fa-regular fa-heart"></i>`;

            showNotification(
                "Removed from wishlist."
            );

        } else {

            wishlist.push(product);

            button.innerHTML =
                `<i class="fa-solid fa-heart"></i>`;

            showNotification(
                "Added to wishlist!"
            );
        }


        localStorage.setItem(
            "amazonWishlist",
            JSON.stringify(wishlist)
        );
    }


    // =====================================================
    // SEARCH PRODUCTS
    // =====================================================

    function searchProducts() {

        const value =
            searchInput.value
                .trim()
                .toLowerCase();


        if (value === "") {

            showNotification(
                "Please enter a product name."
            );

            return;
        }


        const selectedCategory =
            searchSelect.value;


        let results =
            products.filter(product => {

                const matchesName =
                    product.name
                        .toLowerCase()
                        .includes(value);

                const matchesCategory =
                    selectedCategory === "All" ||
                    product.category === selectedCategory;

                return matchesName &&
                    matchesCategory;
            });


        if (results.length === 0) {

            showNotification(
                "No products found."
            );

            return;
        }


        renderSearchResults(results);

        document
            .querySelector(".deals-section")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }


    // =====================================================
    // RENDER SEARCH RESULTS
    // =====================================================

    function renderSearchResults(results) {

        const productRow =
            document.querySelector(".product-row");

        if (!productRow) return;


        productRow.innerHTML = "";


        results.forEach(product => {

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            card.innerHTML = `

                <div class="discount">
                    ${product.discount}% off
                </div>

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <h3>${product.name}</h3>

                <div class="rating">
                    ${getStars(product.rating)}
                    <span>${product.rating}</span>
                </div>

                <p class="price">
                    $${product.price.toFixed(2)}
                </p>

                <button class="add-to-cart-btn">
                    <i class="fa-solid fa-cart-plus"></i>
                    Add to Cart
                </button>

            `;


            productRow.appendChild(card);


            card
                .querySelector(".add-to-cart-btn")
                .addEventListener("click", () => {

                    addToCart(product);

                });
        });
    }


    // =====================================================
    // STAR RATING
    // =====================================================

    function getStars(rating) {

        const fullStars =
            Math.floor(rating);

        const emptyStars =
            5 - fullStars;

        return (
            "★".repeat(fullStars) +
            "☆".repeat(emptyStars)
        );
    }


    // =====================================================
    // SEARCH BUTTON
    // =====================================================

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchProducts
        );
    }


    // =====================================================
    // ENTER KEY SEARCH
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    searchProducts();

                }

            }
        );
    }


    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    if (searchSelect) {

        searchSelect.addEventListener(
            "change",
            () => {

                const selected =
                    searchSelect.value;


                if (selected === "All") {

                    showNotification(
                        "Showing all products."
                    );

                    return;
                }


                const results =
                    products.filter(
                        product =>
                            product.category === selected
                    );


                renderSearchResults(results);


                document
                    .querySelector(".deals-section")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    }


    // =====================================================
    // BACK TO TOP
    // =====================================================

    if (backToTop) {

        backToTop.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    // =====================================================
    // HERO SLIDER
    // =====================================================

    const heroImages = [

        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85",

        "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=85",

        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1800&q=85"

    ];


    let currentSlide = 0;


    function changeHero() {

        if (!hero) return;


        hero.style.backgroundImage = `
            linear-gradient(
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.60)
            ),
            url("${heroImages[currentSlide]}")
        `;
    }


    // Initial hero image

    changeHero();


    // Next slide

    if (heroRight) {

        heroRight.addEventListener(
            "click",
            () => {

                currentSlide++;

                if (
                    currentSlide >=
                    heroImages.length
                ) {
                    currentSlide = 0;
                }

                changeHero();

            }
        );
    }


    // Previous slide

    if (heroLeft) {

        heroLeft.addEventListener(
            "click",
            () => {

                currentSlide--;

                if (currentSlide < 0) {

                    currentSlide =
                        heroImages.length - 1;
                }

                changeHero();

            }
        );
    }


    // Automatic slider

    setInterval(() => {

        currentSlide++;

        if (
            currentSlide >=
            heroImages.length
        ) {
            currentSlide = 0;
        }

        changeHero();

    }, 5000);


    // =====================================================
    // NOTIFICATION
    // =====================================================

    function showNotification(message) {

        const oldNotification =
            document.querySelector(".notification");

        if (oldNotification) {
            oldNotification.remove();
        }


        const notification =
            document.createElement("div");

        notification.className =
            "notification";

        notification.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;


        document.body.appendChild(
            notification
        );


        setTimeout(() => {

            notification.classList.add(
                "hide"
            );

            setTimeout(() => {

                notification.remove();

            }, 300);

        }, 2200);
    }


    // =====================================================
    // MOBILE MENU
    // =====================================================

    const panel =
        document.querySelector(".panel");

    const panelAll =
        document.querySelector(".panel-all");


    if (panel && panelAll) {

        panelAll.addEventListener(
            "click",
            () => {

                panel.classList.toggle(
                    "mobile-open"
                );

            }
        );
    }


    // =====================================================
    // SCROLL EFFECT
    // =====================================================

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 300) {

                if (backToTop) {
                    backToTop.classList.add(
                        "visible"
                    );
                }

            } else {

                if (backToTop) {
                    backToTop.classList.remove(
                        "visible"
                    );
                }
            }

        }
    );


    // =====================================================
    // IMAGE ERROR HANDLING
    // =====================================================

    document
        .querySelectorAll("img")
        .forEach(img => {

            img.addEventListener(
                "error",
                () => {

                    img.src =
                        "https://via.placeholder.com/600x400?text=Product+Image";

                }
            );

        });


    // =====================================================
    // INITIALIZE
    // =====================================================

    updateCartCount();

});
function renderCart() {
    const cartContainer = document.querySelector(".cart-container");
    const cartTotal = document.querySelector(".cart-total");

    if (!cartContainer || !cartTotal) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Your Amazon Clone cart is empty</h3>
                <p>Add some products to your cart to see them here.</p>
            </div>
        `;

        cartTotal.textContent = "$0.00";
        return;
    }

    let total = 0;

    cart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        total += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h3>${product.name}</h3>

                    <p class="cart-item-price">
                        $${product.price.toFixed(2)}
                    </p>

                    <div class="quantity-controls">

                        <button onclick="decreaseQuantity(${product.id})">
                            −
                        </button>

                        <strong>${product.quantity}</strong>

                        <button onclick="increaseQuantity(${product.id})">
                            +
                        </button>

                    </div>
                </div>

                <button
                    class="remove-cart-btn"
                    onclick="removeFromCart(${product.id})">

                    <i class="fa-solid fa-trash"></i>
                    Remove

                </button>

            </div>
        `;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(id) {

    cart = cart.filter(product => product.id !== id);

    saveCart();

    showNotification("Product removed from cart.");
}

function increaseQuantity(id) {

    const product = cart.find(
        item => item.id === id
    );

    if (product) {
        product.quantity++;
    }

    saveCart();
}

function decreaseQuantity(id) {

    const product = cart.find(
        item => item.id === id
    );

    if (!product) return;

    if (product.quantity > 1) {
        product.quantity--;
    } else {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
}

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();
}

function updateCartCount() {

    const count = cart.reduce(
        (total, product) =>
            total + product.quantity,
        0
    );

    const cartCount =
        document.querySelector(".cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}