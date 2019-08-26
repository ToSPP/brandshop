Vue.component('slider', {
  props: ['images'],
  data() {
    return {
      allImages: this.images || [],
      currentImg: '',
      tempImg: 'https://placehold.it/597x724',
    };
  },
  template: `
    <div class="slider">
      <i class="slider__arrow_prev fas fa-angle-left" @click="changeImg('prev')"></i>
      <div class="container slider__container">
        <img :src="currentImg" alt="Product Moschino">
      </div>
      <i class="slider__arrow_next fas fa-angle-right" @click="changeImg('next')"></i>
    </div>
  `,
  methods: {
    changeImg(dir) {
      const idx = this.allImages.indexOf(this.currentImg);
      if (~idx) {
        switch (dir) {
          case 'prev':
            return this.currentImg = idx ? this.allImages[idx - 1] : this.allImages[this.allImages.length - 1];
          case 'next':
            return this.currentImg = (idx === this.allImages.length - 1) ? this.allImages[0] : this.allImages[idx + 1];
        }
      }
    },
  },
  mounted() {
    return this.currentImg = this.allImages.length ? this.allImages[0] : this.tempImg;
  },
});