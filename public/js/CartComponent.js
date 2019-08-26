Vue.component('cart', {
  data() {
    return {
      cartUrl: '/api/cart',
      itemsList: [],
      isVisible: false,
    };
  },
  template: `
    <div class="cart cart__pos">
      <button type="button" class="cart__main-btn" @click="isVisible = !isVisible">
        <img src="img/cart.svg" alt="Cart">
        <span v-if="itemsList.length" class="cart__qty cart__qty_pos">{{ itemsList.length }}</span>
      </button>
      <div v-show="isVisible" class="cart__block cart__sub-menu">
        <span class="cart__block-arrow"></span>
        <div class="cart__column">
          <ul class="cart__list">
            <cart-item 
              v-for="item in itemsList"
              :item="item"
              :key="item.id_product"
             >
            </cart-item>
          </ul>
          <div v-if="itemsList.length" class="cart__total-block">
            <div>TOTAL</div>
            <div class="dollar cart__total-sum">{{ getTotalSum() }}</div>
          </div>
          <div v-else class="cart__empty">Cart Is Empty</div>
          <a href="checkout.html" class="btn btn__secondary cart__btn">Checkout</a>
          <a href="cart.html" class="btn btn__secondary cart__btn">Go to cart</a>
        </div>
      </div>
    </div>
  `,
  methods: {
    getTotalSum() {
      return this.itemsList.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    },
    addProductItem(product) {
      const item = this.itemsList.find(el => el.id_product === product.id_product);
      if (item) {
        this.$parent.putJSON(`/api/cart/${item.id_product}`, {quantity: 1})
          .then(data => {
            if (data.result) {
              item.quantity++;
            }
          })
      } else {
        const newItem = Object.assign({quantity: 1}, product);
        this.$parent.postJSON(`/api/cart`, newItem)
          .then(data => {
            if (data.result) {
              this.itemsList.push(newItem);
            }
          })
      }
    },
    setProductQty(product, newQuantity) {
      this.$parent.putJSON(`/api/cart/${product.id_product}`, {quantity: newQuantity - product.quantity})
        .then(data => {
          if (data.result) {
            product.quantity = newQuantity;
          }
        })
    },
    removeProductItem(product) {
      if (product.quantity > 1) {
        this.$parent.putJSON(`/api/cart/${product.id_product}`, {quantity: -1})
          .then(data => {
            if (data.result) {
              product.quantity--;
            }
          })
      } else {
        this.removeProduct(product);
      }
    },
    removeProduct(product) {
      this.$parent.deleteJSON(`/api/cart/${product.id_product}`)
        .then(data => {
          if (data.result) {
            this.itemsList.splice(this.itemsList.indexOf(product), 1);
          }
        })
    },
    clearCart() {
      this.$parent.deleteJSON(`/api/cart`)
        .then(data => {
          if (data.result) {
            this.itemsList = [];
          }
        })
    },
  },
  mounted() {
    this.$parent.getJSON(`${this.cartUrl}`)
      .then(data => {
        for (const item of data) {
          this.itemsList.push(item);
        }
      })
  },
});

Vue.component('cartItem', {
  props: ['item'],
  data() {
    return {
      tempImg: 'https://placehold.it/72x85',
    };
  },
  template: `
    <li class="cart__item">
      <a href="single.html">
        <img :src="tempImg" :alt="item.product_name"></a>
      <div class="cart__item-desc">
        <a href="single.html" class="cart__item-title">{{ item.product_name }}</a>
        <img src="img/rating_4-5.png" alt="rating_4-5_stars">
        <p class="cart__item-total">
          <span class="cart__item-qty">{{ item.quantity }}</span> x
          <span class="dollar cart__item-sum">{{ item.price }}</span>
        </p>
      </div>
      <a href="#" class="cart__item-remove" @click.prevent="$parent.removeProductItem(item)"></a>
    </li>
  `,
});

Vue.component('cartMain', {
  template: `
    <div class="shopping-cart">
      <div class="container shopping-cart__container">
        <table class="product-table shopping-cart__table">
        <tr>
          <th class="product-table__title product-table__column-wide product-table__row_border">Product Details
          </th>
          <th class="product-table__title product-table__column-normal product-table__row_border">unite Price</th>
          <th class="product-table__title product-table__column-narrow product-table__row_border">Quantity</th>
          <th class="product-table__title product-table__column-normal product-table__row_border">shipping</th>
          <th class="product-table__title product-table__column-narrow product-table__row_border">Subtotal</th>
          <th class="product-table__title product-table__column-narrow product-table__row_border">ACTION</th>
        </tr>
        <cart-table-item v-for="item in $root.$refs.cart.itemsList"
                         :item="item"
                         :key="item.id_product"
         ></cart-table-item>
      </table>
        <div class="shopping-cart__buttons">
          <a href="#" class="btn btn__secondary btn__shopping-cart_big" 
             @click.prevent="$root.$refs.cart.clearCart">cLEAR SHOPPING CART</a>
          <a href="products.html" class="btn btn__secondary btn__shopping-cart_big">cONTINUE sHOPPING</a>
        </div>
        <div class="shopping-cart__misc">
          <section class="shopping-cart__section">
            <h3 class="shopping-cart__misc-h3">Shipping Adress</h3>
            <input list="country" class="shopping-cart__datalist" placeholder="Country">
            <datalist id="country">
              <option value="Bangladesh"></option>
              <option value="France"></option>
              <option value="Germany"></option>
              <option value="Russia"></option>
              <option value="Ukraine"></option>
            </datalist>
            <input type="text" class="shopping-cart__input-text" placeholder="State">
            <input type="text" class="shopping-cart__input-text" placeholder="Postcode/Zip">
          </section>
          <section class="shopping-cart__section">
            <h3 class="shopping-cart__misc-h3">coupon discount</h3>
            <p class="shopping-cart__coupon-hint">Enter your coupon code if you have one</p>
            <input type="text" class="shopping-cart__input-text" placeholder="State">
            <button class="btn btn__secondary btn__shopping-cart_small btn__shopping-cart_coupon">Apply coupon</button>
          </section>
          <section class="shopping-cart__section shopping-cart__misc_checkout">
            <div class="shopping-cart__total">
              <h4 class="shopping-cart__misc-h4 shopping-cart__sub-total">Sub total <span
                class="dollar shopping-cart__total-price-margin">{{ $root.$refs.cart.getTotalSum() }}</span></h4>
              <h3 class="shopping-cart__misc-h3">GRAND TOTAL 
                <span class="dollar shopping-cart__total-price-margin 
                             shopping-cart__total-highlight">{{ $root.$refs.cart.getTotalSum() }}</span>
              </h3>
            </div>
            <a href="checkout.html" class="btn btn__primary btn__shopping-cart_checkout">proceed to checkout</a>
          </section>
        </div>
        <button class="btn btn__secondary btn__shopping-cart_small btn__shopping-cart_coupon">get a quote</button>
      </div>
    </div>
  `,
});

Vue.component('cartTableItem', {
  props: ['item'],
  data() {
    return {
      tempImg: 'https://placehold.it/100x115',
    };
  },
  template: `
    <tr>
      <td class="product-table__cell product-table__column-wide product-table__row_border">
        <a href="single.html" class="product-table__product-link">
          <img :src="tempImg" alt="Mango T-Shirt" class="product-table__product-img">
        </a>
        <h3 class="product-table__h3">
          <a href="single.html" class="product-table__product-link">{{ item.product_name }}</a>
        </h3>
        <p class="product-table__product-desc">
          Color: <span class="product-table__product-desc_highlight">Red</span><br>
          Size: <span class="product-table__product-desc_highlight">XL</span>
        </p>
      </td>
      <td class="product-table__cell product-table__row_border"><span class="dollar">{{ item.price }}</span></td>
      <td class="product-table__cell product-table__row_border">
        <input type="number"
               class="product-table__input-quantity"
               min="1" max="99"
               :value="item.quantity"
               @input="changeQuantity()"             
               >
      </td>
      <td class="product-table__cell product-table__text_uppercase product-table__row_border">FREE</td>
      <td class="product-table__cell product-table__row_border">
        <span class="dollar">{{ subtotal(item.price, item.quantity) }}</span>
      </td>
      <td class="product-table__cell product-table__row_border">
        <a href="#" class="cart__item-remove" @click.prevent="$root.$refs.cart.removeProduct(item)"></a>
      </td>
    </tr>
  `,
  methods: {
    changeQuantity() {
      const newQuantity = +event.target.value;
      if (newQuantity > 0) {
        if ((newQuantity - this.item.quantity) === 1) {
          this.$root.$refs.cart.addProductItem(this.item);
        } else if ((newQuantity - this.item.quantity) === -1) {
          this.$root.$refs.cart.removeProductItem(this.item);
        } else {
          this.$root.$refs.cart.setProductQty(this.item, newQuantity);
        }
      } else {
        event.target.value = this.item.quantity;
      }
    },
    subtotal(price, qty) {
      return (price * qty).toFixed(2);
    },
  },
});