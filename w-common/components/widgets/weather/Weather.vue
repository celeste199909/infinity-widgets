<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="bg-blue-500 text-white p-3 w-full h-full rounded-xl flex flex-col justify-center items-center gap-1"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <div
      v-if="weatherInfo"
      class="w-full h-full flex flex-col justify-center items-center"
    >
      <div class="h-14 flex justify-center items-center text-center">
        <img class="w-5 h-5" src="../../../assets/icons/location-48.png" />
        <div>{{ weatherInfo?.city }}</div>
      </div>
      <div class="flex justify-center items-center overflow-hidden">
        <img
          class="w-full h-full block select-none"
          :src="getLocalImage(weatherPhenomenaMap.get(weatherInfo?.weather) as string)"
          alt=""
          srcset=""
        />
      </div>
      <div
        class="flex-grow-0 h-14 flex flex-row justify-center items-center gap-2"
      >
        <div>{{ weatherInfo?.temperature }} ℃</div>
        <div>{{ weatherInfo?.weather }}</div>
      </div>
    </div>
  </div>
  <!-- 有样式 -->
  <div
    v-else
    class="bg-blue-500 text-white p-2 w-full h-full rounded-xl flex flex-col justify-center items-center gap-1"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <!-- 展示天气 -->
    <div
      v-if="!showSelectDistrict"
      class="w-full h-full flex flex-col justify-center items-center"
    >
      <div
        v-if="weatherInfo"
        class="w-full h-full flex flex-col justify-center items-center gap-3"
      >
        <div
          class="h-14 flex justify-center items-center text-center cursor-pointer"
          @click="handleShowSelectDistrict"
        >
          <img class="w-5 h-5" src="../../../assets/icons/location-48.png" />
          <div>{{ weatherInfo?.city }}</div>
        </div>
        <div class="flex justify-center items-center overflow-hidden">
          <img
            class="w-full h-full block select-none"
            :src="getLocalImage(weatherPhenomenaMap.get(weatherInfo?.weather) as string)"
          />
        </div>
        <div class="h-14 flex justify-center items-center text-center">
          <div>{{ weatherInfo?.temperature }} ℃</div>
          <div>{{ weatherInfo?.weather }}</div>
        </div>
      </div>
    </div>
    <!-- 选择地区 -->
    <div
      v-else
      class="flex flex-col justify-center items-center gap-2 w-full h-full"
      @wheel="handleWheel"
    >
      <div class="pre opacity-80" @click="currentIndex--">
        {{ currentIndex !== 0 ? selectList[currentIndex - 1].name : "" }}
      </div>
      <div class="current font-bold text-lg" @click="handleSelect">
        {{ selectList[currentIndex].name }}
      </div>
      <div class="next opacity-80" @click="currentIndex++">
        {{
          currentIndex < selectList.length - 1
            ? selectList[currentIndex + 1].name
            : ""
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref } from "vue";
import weatherPhenomenaMap from "./weatherMap";
import provinceDistricts from "./provinceDistricts";

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  modifyWidgetData: {
    type: Function,
    required: false,
  },
});

interface WeatherInfo {
  province: string;
  city: string;
  adcode: string;
  weather: string;
  temperature: string;
  winddirection: string;
  windpower: string;
  humidity: string;
  reporttime: string;
  temperature_float: string;
  humidity_float: string;
}

const showSelectDistrict = ref(false);
const weatherInfo: Ref<WeatherInfo | null> = ref(null);
const currentIndex = ref(0);
const selectList = ref(provinceDistricts);
const userDistrict = ref(props.widgetData.data?.userDistrict || provinceDistricts[1]);

onMounted(() => {
  // 获取天气信息
  fetchWeatherInfo(userDistrict.value.adcode);
});

function handleShowSelectDistrict() {
  selectList.value = provinceDistricts;
  showSelectDistrict.value = true;
}

function handleSelect() {
  userDistrict.value = selectList.value[currentIndex.value];
  fetchNextDistrict(userDistrict.value.adcode);
  // 保存用户选择的地区
  if (props.modifyWidgetData) {
    props.modifyWidgetData({
      ...props.widgetData,
      data: {
        userDistrict: userDistrict.value,
      },
    });
  }
  currentIndex.value = 0;
  fetchWeatherInfo(userDistrict.value.adcode);
}

function fetchNextDistrict(adcode: string) {
  const baseUrl = "https://restapi.amap.com/v3/config/district";
  const key = "870f0d2a1a64fd2a1158d6316f385d21";
  const keywords = adcode;
  const subdistrict = "1";
  const url = `${baseUrl}?key=${key}&keywords=${keywords}&subdistrict=${subdistrict}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(
        "%c [ fetchNextDistrict ]-134",
        "font-size:13px; background:pink; color:#bf2c9f;",
        data
      );
      selectList.value = data.districts[0].districts.map((item: any) => {
        return {
          name: item.name,
          adcode: item.adcode,
        };
      });
      // 如果 level 为 street ,返回
      if (data.districts[0].districts[0].level === "street") {
        showSelectDistrict.value = false;
      }
    });
}

function fetchWeatherInfo(adcode: string) {
  const baseUrl = "https://restapi.amap.com/v3/weather/weatherInfo";
  const key = "870f0d2a1a64fd2a1158d6316f385d21";
  const city = adcode;
  const url = `${baseUrl}?key=${key}&city=${city}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(
        "%c [ fetchWeatherInfo ]-134",
        "font-size:13px; background:pink; color:#bf2c9f;",
        data
      );
      weatherInfo.value = data.lives[0];

      console.log(
        "%c [ weatherInfo.value ]-279",
        "font-size:13px; background:pink; color:#bf2c9f;",
        weatherInfo.value
      );
    });
}

function handleWheel(e: WheelEvent) {
  if (e.deltaY > 0 && currentIndex.value < selectList.value.length - 1) {
    currentIndex.value++;
  } else if (e.deltaY < 0 && currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function getLocalImage(name: string) {
  return new URL(`/w-common/assets/icons/weather/${name}.svg`, import.meta.url)
    .href;
}
</script>
<style scoped>
</style>
