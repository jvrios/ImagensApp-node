<template>
    <div class="popup">
      <div class="popup-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <img :src="image.url" alt="Popup Image">
        <button @click="$emit('toggle-favorite', image)" :disabled="isProcessing" class="favorite-button">
          <svg v-if="isFavorited" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="heart-icon">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
</template>
  
  <script>
  export default {
    props: {
      image: {
        type: Object,
        required: true
      },
      isFavorited: {
        type: Boolean,
        required: true
      },
      isProcessing: {
        type: Boolean,
        required: true
      }
    },
    methods: {
        closePopup() {
            if (!this.isProcessing) {
            this.$emit('close');
            }
        }
    }

  }
  </script>
  
  <style scoped>
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 10px;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }
  
  .favorite-button {
    background: none;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .heart-icon {
    width: 24px;
    height: 24px;
  }
  </style>