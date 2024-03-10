<template>
  <div
    class="bg-blue-500 text-white p-2 w-full h-full rounded-xl flex flex-col justify-center items-center gap-1"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <!-- 展示天气 -->
    <div class="w-full h-full flex flex-col justify-center items-center">
      <div
        v-if="weatherInfo"
        class="w-full h-full flex flex-col justify-center items-center gap-3"
      >
        <div
          class="h-14 flex justify-center items-center text-center cursor-pointer"
          @click="handleShowSetting"
        >
          <Icon name="location" class="w-5 h-5" color="#ffffff" />
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
  </div>
  <!-- 设置 -->
  <Teleport to="body">
    <CustomWindow
      v-if="isShowSetting"
      :widgetData="widgetData"
      :name="'设置'"
      :winId="'custom-win-' + widgetData.id"
      :width="400"
      :height="300"
      :maxminze="false"
      :closeFunction="closeSetting"
      :btnColor="'#666'"
      :showTitle="false"
    >
      <div
        class="bg-white w-full h-full pt-20 flex flex-col justify-start items-center"
      >
        <!-- 选择地区 -->
        <label
          class="input py-1 input-bordered w-full max-w-xs rounded-lg flex items-center gap-2 border mx-auto outline-1 outline-neutral-200"
        >
          <input
            type="text"
            class="grow outline-none"
            placeholder="输入城市"
            v-model="searchKeyword"
            @keydown.enter="fetchDistrictBySearch"
          />
          <kbd class="kbd kbd-sm border rounded-md bg-slate-200 text-slate-500"
            >Enter</kbd
          >
        </label>
        <!-- 展示 -->
        <div
          class="p-2 text-[14px] w-full max-w-xs h-full overflow-y-scroll flex flex-col justify-start items-center"
        >
          <div
            class="p-2 text-[14px] rounded-md w-full text-slate-700 cursor-pointer hover:bg-gray-100 hover:text-blue-500"
            v-for="item in searchResult"
            @click="handleSelect(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </CustomWindow>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import weatherPhenomenaMap from "./weatherMap";
import provinceDistricts from "./provinceDistricts";
import Icon from "../../icon/Icon.vue";
import CustomWindow from "../../../components/CustomWindow.vue";

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

const weatherInfo: Ref<WeatherInfo | null> = ref(null);
const currentIndex = ref(0);
const selectList = ref(provinceDistricts);
const userDistrict = ref(
  props.widgetData.data?.userDistrict || provinceDistricts[1]
);

onMounted(() => {
  // 获取天气信息
  fetchWeatherInfo(userDistrict.value.adcode);
});

// function handleShowSelectDistrict() {
//   selectList.value = provinceDistricts;
//   showSelectDistrict.value = true;
// }

function handleSelect(item: District) {
  userDistrict.value = item;
  // 保存用户选择的地区
  if (props.modifyWidgetData) {
    props.modifyWidgetData({
      ...props.widgetData,
      data: {
        userDistrict: userDistrict.value,
      },
    });
  }
  fetchWeatherInfo(item.adcode);
}
// 搜索设置
// {
//     "citycode": "0735",
//     "adcode": "431021",
//     "name": "桂阳县",
//     "center": "112.733804,25.75382",
//     "level": "district",
//     "districts": []
// }
interface District {
  citycode: string;
  adcode: string;
  name: string;
  center: string;
  level: string;
  districts: [];
}
const searchKeyword = ref("");
const searchResult: Ref<District[]> = ref([]);

function fetchDistrictBySearch(e: Event) {
  const baseUrl = "https://restapi.amap.com/v3/config/district";

  const key = "870f0d2a1a64fd2a1158d6316f385d21";
  const keywords = searchKeyword.value;
  const subdistrict = "0";
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
      searchResult.value = data.districts;
      // selectList.value = data.districts[0].districts.map((item: any) => {
      //   return {
      //     name: item.name,
      //     adcode: item.adcode,
      //   };
      // });
      // // 如果 level 为 street ,返回
      // if (data.districts[0].districts[0].level === "street") {
      //   // showSelectDistrict.value = false;
      // }
    });
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
        // showSelectDistrict.value = false;
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

// 设置
const isShowSetting = ref(false);

function handleShowSetting() {
  isShowSetting.value = true;
}

function closeSetting() {
  isShowSetting.value = false;
}
</script>
<style scoped></style>
