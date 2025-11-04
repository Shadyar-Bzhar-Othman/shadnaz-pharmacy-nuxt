<template>
  <label :for="name" class="text-sm font-[400] px-1 flex">
    <span>{{ tname != "" ? tname : capitalName }}</span>

    <Icon
      v-if="required"
      name="mdi:required"
      class="text-destructive-500 size-3"
    />
  </label>

  <MapboxMap
    map-id="main-map"
    :options="{
      style: 'mapbox://styles/mapbox/standard',
      center: [props.long, props.lat],
      zoom: 12,
      bearing: 0,
      pitch: 30,
    }"
    class="w-full h-64 rounded-lg"
  >
    <!-- Marker -->
    <MapboxDefaultMarker
      marker-id="main-marker"
      :lnglat="[markerLong, markerLat]"
    >
      <template #marker>
        <div
          class="bg-primary/20 w-10 h-10 rounded-full shadow-main flex justify-center items-center"
        >
          <div class="bg-primary w-5 h-5 rounded-full"></div>
        </div>
      </template>
    </MapboxDefaultMarker>

    <!-- Controls -->
    <MapboxGeolocateControl position="top-right" />
    <MapboxFullscreenControl position="top-right" />
  </MapboxMap>

  <!-- Errors -->
  <ul
    v-if="hasError"
    class="flex justify-start items-start flex-col text-xxs text-destructive-500 gap-1 ml-2"
  >
    <li v-for="message in errors[name]" :key="message">
      {{ message }}
    </li>
  </ul>
</template>

<script setup lang="ts">
// Imports
import { toCapitalizedWords } from "@/helpers/functions";

// Props
const props = defineProps({
  lat: { type: Number, default: 35.5558 },
  long: { type: Number, default: 45.4351 },
  onlyView: { type: Boolean, default: false },
  name: {
    type: String,
    required: true,
  },
  tname: {
    type: String,
    required: false,
    default: "",
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  required: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emits = defineEmits(["update:lat", "update:long"]);

// States
const markerLat = ref(props.lat);
const markerLong = ref(props.long);
const marker = useMapboxMarkerRef("main-marker");

// Functions
useMapbox("main-map", (map) => {
  if (props.onlyView) return;

  map.on("click", (e: any) => {
    const { lng, lat } = e.lngLat;

    // Animate map
    map.flyTo({
      center: [lng, lat],
      speed: 0.8,
      curve: 1.2,
    });

    map.once("moveend", () => {
      markerLat.value = lat;
      markerLong.value = lng;

      emits("update:lat", lat);
      emits("update:long", lng);

      if (marker.value) marker.value.setLngLat([lng, lat]);
    });
  });
});

// Computed Properties
const hasError = computed(
  () => props.errors && props.errors[props.name]?.length
);

const capitalName = computed(() => toCapitalizedWords(props.name));
</script>
