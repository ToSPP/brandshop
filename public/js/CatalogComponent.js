Vue.component('catalog', {
  data() {
    return {
      catalogUrl: '/api/catalog',
    };
  },
  template: `
    <div class="container catalog__container">
      <catalog-menu :catalog-url="catalogUrl"></catalog-menu>
      <div class="catalog">
        <catalog-filters></catalog-filters>
        <catalog-sort></catalog-sort>
        <products :catalog-url="catalogUrl" ref="products" class-name="catalog"></products>
        <catalog-pagination></catalog-pagination>
      </div>
    </div>
  `,
});

Vue.component('catalog-menu', {
  props: ['catalogUrl'],
  data() {
    return {
      url: this.catalogUrl,
      menuBlocks: [],
    };
  },
  template: `
    <div class="catalog-menu">
      <div class="catalog-menu__block"
           v-for="(block, i) in menuBlocks"
           :key="i">
        <catalog-menu-block :block="block" ref="menuBlock"></catalog-menu-block>
      </div>
    </div>
  `,
  methods: {
    splitToItems(data) {
      const items = {
        category: {},
        brand: {},
        designer: {},
      };

      for (const item of data) {
        if (item.category) items.category[item.category] = '';
        if (item.brand) items.brand[item.brand] = '';
        if (item.designer) items.designer[item.designer] = '';
      }

      for (let key in items) {
        const item = {};
        item[key] = Object.keys(items[key]);
        this.menuBlocks.push(item);
      }
    },
  },
  mounted() {
    this.$root.getJSON(`${this.url}`)
      .then(data => {
        this.splitToItems(data);
      });
  },
});

Vue.component('catalog-menu-block', {
  props: ['block'],
  data() {
    return {
      isVisible: false,
    };
  },
  template: `
    <div>
      <h3 class="catalog-menu__title"
          @click="showList"
       >{{ getTitleItem(block) }}</h3>
       <transition-group
          tag="ul"
          class="catalog-menu__list"
          :class="{'catalog-menu__list_active': isVisible}"
          :css="false"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >  
          <li class="catalog-menu__item"
              v-for="(item, j) in getListItems()"
              :key="item"
              :data-index="j">
            <a href="#" class="catalog-menu__link">{{ item }}</a>
          </li>
      </transition-group>  
    </div>
  `,
  methods: {
    getListItems() {
      return this.isVisible ? Object.values(this.block)[0] : [];
    },
    getTitleItem(obj) {
      let title = Object.keys(obj)[0];
      return title.charAt(0).toUpperCase() + title.slice(1);
    },
    showList() {
      if (this.isVisible) {
        this.isVisible = false;
      } else {
        for (const item of this.$parent.$refs.menuBlock) {
          item.isVisible = false;
        }
        this.isVisible = true;
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter(el, done) {
      const delay = el.dataset.index * 30;
      setTimeout(() => {
        el.style.opacity = 1;
        el.style.height = '2.5em';
      }, delay);
    },
    leave(el, done) {
      const delay = el.dataset.index * 30;
      setTimeout(() => {
        el.style.opacity = 0;
        el.style.height = 0;
        setTimeout(() => el.remove(), 50);
      }, delay);
    },
  },
});

Vue.component('catalog-filters', {
  template: `
    <div class="catalog__filters">
      <div class="filter">
        <h3 class="filter__h3">Trending now</h3>
        <ul class="filter__list filter__trending">
          <li class="filter__item">
            <a href="#" class="filter__link">Bohemian</a>
          </li>
          <li>|</li>
          <li class="filter__item">
            <a href="#" class="filter__link">Floral</a>
          </li>
          <li>|</li>
          <li class="filter__item">
            <a href="#" class="filter__link">Lace</a>
          </li>
          <li class="row-divider"></li>
          <li class="filter__item">
            <a href="#" class="filter__link">Floral</a>
          </li>
          <li>|</li>
          <li class="filter__item">
            <a href="#" class="filter__link">Lace</a>
          </li>
          <li>|</li>
          <li class="filter__item">
            <a href="#" class="filter__link">Bohemian</a>
          </li>
        </ul>
      </div>
      <div class="filter">
        <h3 class="filter__h3">Size</h3>
        <div class="filter__sizes">
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_xxs">
            <span class="filter__checkbox-title">XXS</span></label>
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_xs">
            <span class="filter__checkbox-title">XS</span></label>
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_s">
            <span class="filter__checkbox-title">S</span></label>
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_m">
            <span class="filter__checkbox-title">M</span></label>
          <div class="trend_row_divider"></div>
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_l">
            <span class="filter__checkbox-title">L</span></label>
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_xl">
            <span class="filter__checkbox-title">XL</span></label>
          <label class="filter__checkbox">
            <input type="checkbox" id="filter_size_xxl">
            <span class="filter__checkbox-title">XXL</span></label>
        </div>
      </div>
      <div class="filter">
        <h3 class="filter__h3">pRICE</h3>
        <div id="slider-range"></div>
        <div class="filter-range-amounts">
          <span id="amountFrom" class="dollar"></span>
          <span id="amountTo" class="dollar"></span>
        </div>
      </div>
    </div>
  `,
});

Vue.component('catalog-sort', {
  template: `
    <div class="catalog__sort">
      <div>
        <span class="sort__block sort__title">Sort By</span>
        <div class="sort__block sort__options">
        <span id="sortBy" class="sort__value caret-down"
              data-sortby="name">Name</span>
          <ul class="sort__list">
            <li class="sort__item" data-sortby="name">Name</li>
            <li class="sort__item" data-sortby="price">Price</li>
            <li class="sort__item" data-sortby="rating">Rating</li>
          </ul>
        </div>
      </div>
      <div>
        <span class="sort__block sort__title">Show</span>
        <div class="sort__block sort__options">
        <span id="showBy" class="sort__value caret-down"
              data-showby="9">09</span>
          <ul class="sort__list">
            <li class="sort__item" data-showby="3">03</li>
            <li class="sort__item" data-showby="6">06</li>
            <li class="sort__item" data-showby="9">09</li>
            <li class="sort__item" data-showby="12">12</li>
            <li class="sort__item" data-showby="15">15</li>
          </ul>
        </div>
      </div>
    </div>
  `,
});

Vue.component('catalog-pagination', {
  template: `
    <div class="pagination__wrap">
      <ul class="pagination">
        <li>
        <span class="pagination__link_disabled">
          <i class="fas fa-angle-left"></i></span>
        </li>
        <li>
          <a href="#" class="pagination__link pagination__link_active">1</a>
        </li>
        <li>
          <a href="#" class="pagination__link">2</a></li>
        <li>
          <a href="#" class="pagination__link">3</a></li>
        <li>
          <a href="#" class="pagination__link">4</a></li>
        <li>
          <a href="#" class="pagination__link">5</a></li>
        <li>
          <a href="#" class="pagination__link">6.....20</a></li>
        <li>
          <a href="#" class="pagination__link">
            <i class="fas fa-angle-right"></i></a></li>
      </ul>
      <a href="#" 
         class="btn__primary_inverse btn__view-all"
         @click.prevent="$parent.$refs.products.getAllProducts()">View All</a>
    </div>
  `,
});