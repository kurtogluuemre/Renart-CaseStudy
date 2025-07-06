document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/yuzuk");
    const products = await response.json();
    const wrapper = document.querySelector(".swiper-wrapper");

    wrapper.innerHTML = products.map(product => renderCard(product)).join("");

    new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 4,
            }
        }
    });
});

function renderCard(product) {
    const colors = Object.keys(product.images);
    const defaultColor = colors[0];
    const defaultImage = product.images[defaultColor];

    return `
        <div class="swiper-slide">
            <div class="product-card">
                <img src="${defaultImage}" class="product-img" />
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toFixed(2)} USD</p>

                <div class="color-picker">
                    ${colors.map(color => `
                        <span class="color-dot" style="background-color: ${getColorCode(color)}"
                            onclick="changeImage(this, '${product.images[color]}')"></span>
                    `).join('')}
                </div>
                <div class="color-name">${getColorName(defaultColor)}</div>

                <div class="rating">${renderStars(product.popularity)} ${product.popularity.toFixed(1)}/5</div>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push("★");
        } else if (i === fullStars && hasHalfStar) {
            stars.push("☆");
        } else {
            stars.push("☆");
        }
    }

    return `<span class="stars">${stars.join('')}</span>`;
}

function getColorName(colorKey) {
    switch (colorKey.toLowerCase()) {
        case 'yellow': return 'Yellow Gold';
        case 'white': return 'White Gold';
        case 'rose': return 'Rose Gold';
        default: return '';
    }
}

function getColorCode(color) {
    switch (color.toLowerCase()) {
        case 'yellow': return '#E6CA97';
        case 'white': return '#D9D9D9';
        case 'rose': return '#E1AAA9';
        default: return '#000';
    }
}

function changeImage(elem, newSrc) {
    const card = elem.closest('.product-card');
    const img = card.querySelector('.product-img');
    img.src = newSrc;
}
