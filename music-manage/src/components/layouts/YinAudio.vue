<template>
  <audio controls="controls" preload="true" v-if="url" :ref="player" :src="attachImageUrl(url)" @canplay="startPlay" @ended="ended"></audio>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { HttpManager } from "@/api";

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const divRef = ref<HTMLAudioElement>();
    const player = (el) => {
      divRef.value = el;
    };

    const url = computed(() => store.getters.url); 
    const isPlay = computed(() => store.getters.isPlay); 
 
    watch(isPlay, () => {
      togglePlay();
    });


    function togglePlay() {
      isPlay.value ? divRef.value.play() : divRef.value.pause();
    }


    function startPlay() {
      divRef.value.play();
    }
  
    function ended() {
      proxy.$store.commit("setIsPlay", false);
    }
    return {
      url,
      isPlay,
      player,
      startPlay,
      ended,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style>
audio {
  display: none;
}
</style>
