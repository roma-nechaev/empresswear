<template>
  <transition name="noty">
    <b-alert
      :variant="variant"
      :show="dismissCountDown"
      dismissible
      fade
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
      >{{ notify.message }}</b-alert
    >
  </transition>
</template>

<script>
export default {
  data() {
    return {
      dismissSecs: 5,
      dismissCountDown: 0,
      variant: ""
    };
  },
  computed: {
    notify() {
      return this.$store.state.notify;
    }
  },
  watch: {
    "notify.showAlert"() {
      this.showAlert();
    },
    dismissCountDown() {
      switch (this.notify.code) {
        case "rest_no_route":
          this.variant = "info";
          break;
        case "info":
          this.variant = "info";
          break;
        case 200:
          this.variant = "success";
          break;
        case 201:
          this.variant = "success";
          break;
        default:
          this.variant = "warning";
      }
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
      if (this.notify.code == 200 || this.notify.code == 201) {
        this.playSound("ok");
      } else {
        this.playSound("select");
      }
    },
    playSound(sound) {
      const a = new Audio("/sounds/".concat(sound, ".mp3"));
      try {
        (a.volume = 0.2), a.play();
      } catch (n) {
        console.log("Sound Not Avaliable");
      }
    }
  }
};
</script>

<style lang="scss">
.alert {
  z-index: 1060;
  width: 350px;
  position: fixed !important;
  top: 85px;
  right: 15px;
  font-size: 0.875rem;
}

.noty-enter-active,
.noty-leave-active {
  transition: all 0.4s;
}
.noty-enter,
.noty-leave-to {
  opacity: 0;
  transform: scale(1.2, 0.7);
}
</style>
