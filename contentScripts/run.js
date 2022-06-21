let card_discount = 0;
try {
    card_filter = localStorage.getItem("card_filter");
    card_discount = Number(localStorage.getItem("card_discount"));
    card_calc = localStorage.getItem("card_calc");
} catch(e) {}
let regex = /[^0-9]/g;


function card_discount_filter() {
    document.querySelectorAll(".new-price-value").forEach((element) => {
        element.remove();
    });
    document.querySelectorAll(".baby-product.renew-badge").forEach((element) => {
        let discount_int = NaN;
        let discount_str = element.querySelector(".ccid-txt")?.innerHTML;
        try {
            discount_int = Number(discount_str.replaceAll(regex, ""));
        } catch(e) {}
        if(!card_filter) {
            element.style.display = "block";
            element.style.height  = "calc(460px + 40px)";
            element.querySelector(".baby-product-wrap").style.height = "auto";
        }
        else {
            if(!element.querySelector(".ccid-badge")) {
                element.style.display = "none";
                return;
            }

            element.style.height  = "calc(460px + 40px)";
            element.querySelector(".baby-product-wrap").style.height = "auto";
            if(discount_int < card_discount) {
                element.style.display = "none";
            }
            else {
                element.style.display = "block";
            }
        }

        if(card_calc) {
            let price_div = element.querySelector(".price-value");
            if(!price_div) {
                return;
            }
            let price = Number(price_div.innerHTML.replaceAll(",", ""));
            if(isNaN(price) || isNaN(discount_int)) {
                return;
            }
            let new_price = price * (100 - discount_int) / 100;
            new_price = Math.round(new_price);
            let new_price_str = new_price.toLocaleString('ko-KR');

            let new_price_div = document.createElement("strong");
            new_price_div.className = "new-price-value";
            new_price_div.innerHTML = new_price_str + "원";
            new_price_div.style.fontSize = "16px";
            new_price_div.style.fontFamily = "Tahoma,sans-serif";
            price_div.parentNode.after(new_price_div);
        }
    })
    document.getElementById("product-list-paging").style.display = "block";
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".baby-product.renew-badge").forEach((element) => {
        card_discount_filter();
    })
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if ((msg.from === 'popup')) {
        switch(msg.type) {
            case 'get_card_filter':
                response({
                    msg: {
                        from:'contentscript',
                        type: 'get_card_filter',
                        value: card_filter
                    }
                });
                break;

            case 'get_card_discount':
                response({
                    msg: {
                        from:'contentscript',
                        type: 'get_card_discount',
                        value: card_discount
                    }
                });
                break;

            case 'get_card_calc':
                response({
                    msg: {
                        from:'contentscript',
                        type: 'get_card_calc',
                        value: card_calc
                    }
                });
                break;

            case 'set_card_filter':
                card_filter = msg.value;
                localStorage.setItem("card_filter", card_filter);
                card_discount_filter();
                break;
            case 'set_card_discount':
                card_discount = msg.value;
                localStorage.setItem("card_discount", card_discount);
                card_discount_filter();
                break;
            case 'set_card_calc':
                card_calc = msg.value;
                localStorage.setItem("card_calc", card_calc);
                card_discount_filter();
                break;

            default:
                break;
        }
    }
});