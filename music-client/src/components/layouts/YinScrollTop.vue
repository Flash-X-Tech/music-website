<template>
  <div class="scroll-top" @click="returnTop">
    <div class="box-in"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    function returnTop() {
      let timer: number = null;
      cancelAnimationFrame(timer);
      const startTime = new Date();
      const S = document.body.scrollTop || document.documentElement.scrollTop;
      const T = 500;
      timer = requestAnimationFrame(function func() {
        const diff: number = new Date().valueOf() - startTime.valueOf();
        const t = T - Math.max(0, T - diff);
        document.documentElement.scrollTop = document.body.scrollTop = S - (t * S) / T;
        timer = requestAnimationFrame(func);
        if (t === T) cancelAnimationFrame(timer);
      });
    }
    return { returnTop };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.scroll-top {
  position: fixed;
  z-index: 100;
  width: 40px;
  height: 20px;
  right: 10px;
  bottom: 80px;
  padding-top: 20px;
  text-align: center;
  background-color: $color-white;
  border-radius: 20%;
  overflow: hidden;
  box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover:before {
    top: 50%;
  }
  &:hover .box-in {
    visibility: hidden;
  }
  &:before {
    content: "Back to top";
    position: absolute;
    font-weight: bold;
    font-size: small;
    width: 30px;
    top: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.box-in {
  visibility: visible;
  display: inline-block;
  height: 10px;
  width: 10px;
  border: 1px solid $color-black;
  border-color: $color-black transparent transparent $color-black;

  transform: rotate(45deg) translate(-5px, -5px);
}
</style>
