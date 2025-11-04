<template>
  <div class="flex flex-col w-4/5 mx-auto my-24">
    <!-- Sliders Container -->
    <div class="relative min-h-[50px]">
      <!-- Background Track -->
      <div class="absolute w-full h-0.5 bg-gray-300 top-1/2 transform -translate-y-1/2"></div>

      <!-- Active Range Track -->
      <div
        class="absolute h-0.5 bg-green-400 top-1/2 transform -translate-y-1/2"
        :style="activeTrackStyle"
      ></div>

      <!-- From Slider (Min) -->
      <input
        ref="fromSlider"
        type="range"
        :min="min"
        :max="max"
        :value="minValue"
        @input="handleFromSliderChange"
        class="absolute w-full h-0.5 bg-transparent appearance-none pointer-events-none cursor-pointer z-10
               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto
               [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white
               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#C6C6C6]
               [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-gray-100
               [&::-webkit-slider-thumb]:active:shadow-[inset_0_0_3px_#387bbe,0_0_9px_#387bbe]
               [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto
               [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white
               [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_0_1px_#C6C6C6]
               [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
      />

      <!-- To Slider (Max) -->
      <input
        ref="toSlider"
        type="range"
        :min="min"
        :max="max"
        :value="maxValue"
        @input="handleToSliderChange"
        :class="[
          'absolute w-full h-0.5 bg-transparent appearance-none pointer-events-none cursor-pointer',
          'z-20',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto',
          '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#C6C6C6]',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-gray-100',
          '[&::-webkit-slider-thumb]:active:shadow-[inset_0_0_3px_#387bbe,0_0_9px_#387bbe]',
          '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto',
          '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_0_1px_#C6C6C6]',
          '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none',
          minValue <= 0 ? 'z-20' : 'z-0'
        ]"
      />
    </div>

    <!-- Form Controls -->
    <div class="relative flex justify-between text-2xl text-gray-600 mt-4">
      <!-- Min Input Container -->
      <div class="flex flex-col items-center">
        <div class="mb-2">Min</div>
        <input
          type="number"
          :min="min"
          :max="max"
          :value="minValue"
          @input="handleMinInputChange"
          class="w-12 h-8 text-xl text-gray-500 border-none bg-transparent text-center
                 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:opacity-100"
        />
      </div>

      <!-- Max Input Container -->
      <div class="flex flex-col items-center">
        <div class="mb-2">Max</div>
        <input
          type="number"
          :min="min"
          :max="max"
          :value="maxValue"
          @input="handleMaxInputChange"
          class="w-12 h-8 text-xl text-gray-500 border-none bg-transparent text-center
                 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:opacity-100"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  minValue: {
    type: Number,
    default: 10
  },
  maxValue: {
    type: Number,
    default: 30
  }
})

// Emits
const emit = defineEmits(['update:minValue', 'update:maxValue'])

// Refs
const fromSlider = ref(null)
const toSlider = ref(null)

// Reactive values
const currentMin = ref(props.minValue)
const currentMax = ref(props.maxValue)

// Computed style for active track
const activeTrackStyle = computed(() => {
  const range = props.max - props.min
  const fromPercent = ((currentMin.value - props.min) / range) * 100
  const toPercent = ((currentMax.value - props.min) / range) * 100

  return {
    left: `${fromPercent}%`,
    width: `${toPercent - fromPercent}%`
  }
})

// Watch for prop changes
watch(() => props.minValue, (newVal) => {
  currentMin.value = newVal
})

watch(() => props.maxValue, (newVal) => {
  currentMax.value = newVal
})

// Event handlers
const handleFromSliderChange = (event) => {
  const value = parseInt(event.target.value, 10)
  if (value > currentMax.value) {
    currentMin.value = currentMax.value
    emit('update:minValue', currentMax.value)
  } else {
    currentMin.value = value
    emit('update:minValue', value)
  }
}

const handleToSliderChange = (event) => {
  const value = parseInt(event.target.value, 10)
  if (value < currentMin.value) {
    currentMax.value = currentMin.value
    emit('update:maxValue', currentMin.value)
  } else {
    currentMax.value = value
    emit('update:maxValue', value)
  }
}

const handleMinInputChange = (event) => {
  const value = parseInt(event.target.value, 10)
  if (isNaN(value)) return

  const clampedValue = Math.max(props.min, Math.min(props.max, value))

  if (clampedValue > currentMax.value) {
    currentMin.value = currentMax.value
    emit('update:minValue', currentMax.value)
  } else {
    currentMin.value = clampedValue
    emit('update:minValue', clampedValue)
  }
}

const handleMaxInputChange = (event) => {
  const value = parseInt(event.target.value, 10)
  if (isNaN(value)) return

  const clampedValue = Math.max(props.min, Math.min(props.max, value))

  if (clampedValue < currentMin.value) {
    currentMax.value = currentMin.value
    emit('update:maxValue', currentMin.value)
  } else {
    currentMax.value = clampedValue
    emit('update:maxValue', clampedValue)
  }
}
</script>
