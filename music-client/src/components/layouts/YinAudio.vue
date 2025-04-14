<template>
  <audio :src="attachImageUrl(songUrl)" controls="controls" :ref="player" preload="true" @canplay="canplay" @timeupdate="timeupdate" @ended="ended">
 
  </audio>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, computed, watch } from "vue";
import { useStore } from "vuex";
import { HttpManager } from "@/api";
import { onMounted } from 'vue';

export default defineComponent({
  setup() {

    const { proxy } = getCurrentInstance();
    const store = useStore();
    const divRef = ref<HTMLAudioElement>();
    const player = (el) => {
      divRef.value = el;
    };

     const muted = ref(true); // 添加一个 reactive 的 muted 属性

    const audioDom = document.querySelector('audio');
    if (audioDom) {
    
      audioDom.muted = true;
      audioDom.play()
        .then(() => {
    
        })
        .catch(error => {
          console.error('Autoplay failed, user interaction is required.', error);
        });
    }


    const songUrl = computed(() => store.getters.songUrl);
    const isPlay = computed(() => store.getters.isPlay); 
    const volume = computed(() => store.getters.volume); 
    const changeTime = computed(() => store.getters.changeTime);
    const autoNext = computed(() => store.getters.autoNext); 
   
    watch(isPlay, () => togglePlay());
   
    watch(changeTime, () => (divRef.value.currentTime = changeTime.value));
    watch(volume, (value) => (divRef.value.volume = value));


    function togglePlay() {
      isPlay.value ? divRef.value.play() : divRef.value.pause();
    }

    function canplay() {
  
      proxy.$store.commit("setDuration", divRef.value.duration);
   
      if (muted.value) {
        divRef.value.muted = false;
        muted.value = false;
      }
      // divRef.value.play();
      proxy.$store.commit("setIsPlay", true);
    }

    function timeupdate() {
      proxy.$store.commit("setCurTime", divRef.value.currentTime);
    }

    function ended() {
      proxy.$store.commit("setIsPlay", false);
      proxy.$store.commit("setCurTime", 0);
      proxy.$store.commit("setAutoNext", !autoNext.value);
    }



    return {
      songUrl,
      player,
      canplay,
      timeupdate,
      ended,
      muted,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style scoped>
audio {
  display: none;
}
</style>
