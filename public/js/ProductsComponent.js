Vue.component('products', {
  props: ['catalogUrl', 'className'],
  data() {
    return {
      url: this.catalogUrl || '/api/catalog',
      productsList: [],
      filteredProducts: [],
      classes: {
        catalog: 'catalog__wrap',
        featured: 'products__catalog',
        other: 'products-other__catalog',
      }
    };
  },
  template: `
    <div :class="classes[className]">
      <product-card v-for="product in filteredProducts"
               :product="product"
               :full="!(className === 'featured')"
               :key="product.id_product"
      ></product-card>
    </div>
  `,
  methods: {
    getAllProducts() {
      return this.filteredProducts = this.productsList;
    },
    getCatalogProducts() { // заглушка
      return this.filteredProducts = this.productsList.slice(5, 14);
    },
    getFeaturedProducts() { // заглушка
      const find = this.productsList.filter(product => product.rating > 4);
      return this.filteredProducts = find.slice(0, 8);
    },
    getOtherProducts() { // заглушка
      const find = this.productsList.filter(product => product.rating === 3);
      return this.filteredProducts = find.slice(0, 4);
    }
  },
  mounted() {
    this.$root.getJSON(`${this.url}`)
      .then(data => {
        for (const product of data) {
          this.productsList.push(product);
          this.filteredProducts.push(product);
        }
        if (this.className === 'catalog') { // заглушка
          this.getCatalogProducts();
        }
        if (this.className === 'featured') { // заглушка
          this.getFeaturedProducts();
        }
        if (this.className === 'other') { // заглушка
          this.getOtherProducts();
        }
      });
  },
});

Vue.component('product-card', {
  props: ['product', 'full'],
  template: `
    <div class="product">
      <a href="#" class="product__add" @click.prevent="$root.$refs.cart.addProductItem(product)">
        <img src="img/cart_w.svg" class="cart_w" alt="cart">Add to Cart</a>
      <a v-if="full" href="#" class="product__retweet">
        <img src="img/retweet.svg" alt="retweet"></a>
      <a v-if="full" href="#" class="product__like">
        <img src="img/like.svg" alt="like"></a>
      <a href="single.html">
        <img :src="'img/' + product.img" class="product__img" :alt="product.product_name"></a>
      <div class="product__desc">
        <a href="single.html" class="product__desc-link">
          <h3 class="product__desc-h3">{{ product.product_name }}</h3></a>
        <div class="product__desc-row">
          <span class="product__price dollar color-pink">{{ product.price }}</span>
          <img src="img/rating_4.png" class="product__rating" alt="rating_4_stars">
        </div>
      </div>
    </div>
  `,
});

Vue.component('product-single', {
  template: `
    <div class="description container">
      <div class="description__container">
        <h3 class="collection__name">WOMEN COLLECTION</h3>
        <div class="names-separator"></div>
        <h3 class="product__name">Moschino Cheap And Chic</h3>
        <p class="description__text">Compellingly actualize fully researched processes before proactive outsourcing.
          Progressively syndicate collaborative architectures before cutting-edge services. Completely visualize parallel
          core competencies rather than exceptional portals. </p>
        <div class="product-properties">
          <div class="property">
            <span class="text_grey">MATERIAL:</span> COTTON
          </div>
          <div class="property">
            <span class="text_grey">DESIGNER:</span> BINBURHAN
          </div>
          <div class="property-price dollar">561</div>
          <div class="product-options">
            <div class="option">CHOOSE COLOR
              <div class="option__block">
                <div class="attr-color-red option__color-chosen" data-color="red">Red</div>
                <i class="fas fa-angle-down"></i>
                <ul class="option__dropdown">
                  <li class="option__item attr_color_green" data-color="green">Green</li>
                  <li class="option__item attr_color_cyan" data-color="cyan">Cyan</li>
                  <li class="option__item attr_color_yellow" data-color="yellow">Yellow</li>
                </ul>
              </div>
            </div>
            <div class="option">CHOOSE SIZE
              <div class="option__block">
                <div class="option__current-size" data-size="xxl">XXL</div>
                <i class="fas fa-angle-down"></i>
                <ul class="option__dropdown">
                  <li class="option__item" data-size="xl">XL</li>
                  <li class="option__item" data-size="l">L</li>
                  <li class="option__item" data-size="m">M</li>
                  <li class="option__item" data-size="s">S</li>
                  <li class="option__item" data-size="xs">XS</li>
                </ul>
              </div>
            </div>
            <div class="option">QUANTITY
              <input class="option__input" type="number" value="1" min="1" max="99">
            </div>
          </div>
          <button type="button" class="btn btn__primary_inverse btn__options_submit">
            <span class="cart_r">Add to Cart</span></button>
        </div>
      </div>
    </div>
  `,
});