<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div class="fold" :class="{ turn: toggle }">
      <yin-icon :icon="iconList.ZHEDIE" @click="toggle = !toggle"></yin-icon>
    </div>

    <el-slider class="progress" v-model="nowTime" @change="changeTime" size="small"></el-slider>
    <div class="control-box">
      <div class="info-box">

      <div @click="goPlayerPage">
         <el-image class="song-bar-img" fit="contain"/>
      </div>

        <div v-if="songId">
          <div class="song-info">{{ this.songTitle }} - {{ this.singerName }}</div>
          <div class="time-info">{{ startTime }} / {{ endTime }}</div>
        </div>
      </div>
      <div class="song-ctr">
        <yin-icon class="yin-play-show" :icon="playStateList[playStateIndex]" @click="changePlayState"></yin-icon>

        <yin-icon class="yin-play-show" :icon="iconList.SHANGYISHOU" @click="prev"></yin-icon>

        <yin-icon :icon="playBtnIcon" @click="togglePlay"></yin-icon>
        <!--下一首-->
        <yin-icon class="yin-play-show" :icon="iconList.XIAYISHOU" @click="next"></yin-icon>

        <el-dropdown class="yin-play-show" trigger="click">
          <yin-icon v-if="volume !== 0" :icon="iconList.YINLIANG"></yin-icon>
          <yin-icon v-else :icon="iconList.JINGYIN"></yin-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-slider class="yin-slider" style="height: 150px; margin: 10px 0" v-model="volume"
                         :vertical="true"></el-slider>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="song-ctr song-edit">
     
        <yin-icon
            class="yin-play-show"
            :class="{ active: isCollection }"
            :icon="isCollection ? iconList.like : iconList.dislike"
            @click="changeCollection"
        ></yin-icon>
        <!--下载-->
        <yin-icon
            class="yin-play-show"
            :icon="iconList.download"
            @click="
            downloadMusic({
              songUrl,
              songName: singerName + '-' + songTitle,
            })
          "
        ></yin-icon>

        <yin-icon :icon="iconList.LIEBIAO" @click="changeAside"></yin-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onMounted, ref, watch} from "vue";
import {mapGetters, useStore} from "vuex";
import mixin from "@/mixins/mixin";
import YinIcon from "./YinIcon.vue";
import {HttpManager} from "@/api";
import {formatSeconds} from "@/utils";
import {Icon, RouterName} from "@/enums";

export default defineComponent({
  components: {
    YinIcon,
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const store = useStore();
    const {routerManager, playMusic, checkStatus, downloadMusic} = mixin();

    const isCollection = ref(false); // 是否收藏

    const userIdVO = computed(() => store.getters.userId);
    const songIdVO = computed(() => store.getters.songId);
    const token = computed(() => store.getters.token);

    watch(songIdVO, () => {
      initCollection();
    });
    watch(token, (value) => {
      if (!value) isCollection.value = false;
    });

    async function initCollection() {
      if (!checkStatus(false)) return;

      const userId = userIdVO.value;
      const type = '0';
      const songId = songIdVO.value;
      isCollection.value = ((await HttpManager.isCollection({userId, type, songId})) as ResponseBody).data;
    }

    async function changeCollection() {
      if (!checkStatus()) return;

      const userId = userIdVO.value;
      const type = '0'; 
      const songId = songIdVO.value;

      const result = isCollection.value
          ? ((await HttpManager.deleteCollection(userIdVO.value, songIdVO.value)) as ResponseBody)
          : ((await HttpManager.setCollection({userId, type, songId})) as ResponseBody);
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result.data == true || result.data == false) isCollection.value = result.data;
    }

    onMounted(() => {
      if (songIdVO.value) initCollection();
    });

    return {
      isCollection,
      playMusic,
      routerManager,
      checkStatus,
      attachImageUrl: HttpManager.attachImageUrl,
      changeCollection,
      downloadMusic
    };
  },
  data() {
    return {
      startTime: "00:00",
      endTime: "00:00",
      nowTime: 0, 
      toggle: true,
      volume: 50,
      playState: Icon.XUNHUAN,
      playStateList: [Icon.XUNHUAN, Icon.LUANXU],
      playStateIndex: 0,
      iconList: {
        download: Icon.XIAZAI,
        ZHEDIE: Icon.ZHEDIE,
        SHANGYISHOU: Icon.SHANGYISHOU,
        XIAYISHOU: Icon.XIAYISHOU,
        YINLIANG: Icon.YINLIANG1,
        JINGYIN: Icon.JINGYIN,
        LIEBIAO: Icon.LIEBIAO,
        dislike: Icon.Dislike,
        like: Icon.Like,
      },
    };
  },
  computed: {
    ...mapGetters([
      "userId",
      "isPlay", 
      "playBtnIcon",
      "songId",
      "songUrl", 
      "songTitle",
      "singerName",
      "songPic",
      "curTime",
      "duration", 
      "currentPlayList",
      "currentPlayIndex", 
      "showAside", 
      "autoNext",
    ]),
  },
  watch: {
  
    isPlay(value) {
      this.$store.commit("setPlayBtnIcon", value ? Icon.ZANTING : Icon.BOFANG);
    },
    volume() {
      this.$store.commit("setVolume", this.volume / 100);
    },
    
    curTime() {
      this.startTime = formatSeconds(this.curTime);
      this.endTime = formatSeconds(this.duration);
   
      this.nowTime = (this.curTime / this.duration) * 100;
    },
  
    autoNext() {
      this.next();
    },
  },
  methods: {
    changeAside() {
      this.$store.commit("setShowAside", !this.showAside);
    },
   
    togglePlay() {
      this.$store.commit("setIsPlay", this.isPlay ? false : true);
    },
    changeTime() {
      this.$store.commit("setChangeTime", this.duration * (this.nowTime * 0.01));
    },
    changePlayState() {
      this.playStateIndex = this.playStateIndex >= this.playStateList.length - 1 ? 0 : ++this.playStateIndex;
      this.playState = this.playStateList[this.playStateIndex];
    },

    prev() {
      if (this.playState === Icon.LUANXU) {
        let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
        playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
        this.$store.commit("setCurrentPlayIndex", playIndex);
        this.toPlay(this.currentPlayList[playIndex].url);
      } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
        if (this.currentPlayIndex > 0) {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex - 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        } else {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayList.length - 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        }
      }
    },

    next() {
      if (this.playState === Icon.LUANXU) {
        let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
        playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
        this.$store.commit("setCurrentPlayIndex", playIndex);
        this.toPlay(this.currentPlayList[playIndex].url);
      } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
        if (this.currentPlayIndex < this.currentPlayList.length - 1) {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex + 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        } else {
          this.$store.commit("setCurrentPlayIndex", 0);
          this.toPlay(this.currentPlayList[0].url);
        }
      }
    },

    toPlay(url) {
      if (url && url !== this.songUrl) {
        const song = this.currentPlayList[this.currentPlayIndex];
        this.playMusic({
          id: song.id,
          url,
          pic: song.pic,
          index: this.currentPlayIndex,
          name: song.name,
          lyric: song.lyric,
          currentSongList: this.currentPlayList,
        });
      }
    },
    goPlayerPage() {
      this.routerManager(RouterName.Lyric, {path: `${RouterName.Lyric}/${this.songId}`});
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/yin-play-bar.scss";
</style>
