<template>
  <!-- Table -->
  <div class="w-full h-full">
    <div class="w-full overflow-x-auto rounded-lg min-h-full">
      <table class="w-full border-collapse border-spacing-y-3 table-auto">
        <thead class="bg-box rounded">
          <tr>
            <th
              v-for="column in effectiveColumns"
              :key="column.key"
              class="relative p-3 text-text-secondary text-xs font-medium tracking-wide text-center text-nowrap"
            >
              <div class="flex justify-center items-center gap-2">
                <h1>{{ column.label }}</h1>
              </div>
            </th>

            <!-- Slots -->
            <th
              v-if="config.hasSlot"
              v-for="slot in config.slots"
              :key="slot.key"
              class="relative p-3 text-text-secondary text-sm font-medium tracking-wide text-center text-nowrap"
            >
              {{ slot.name }}
            </th>

            <!-- Actions -->
            <!-- <th
              class="relative p-3 text-text-secondary text-xs font-medium tracking-wide text-center text-nowrap"
            >
              <div class="flex items-center justify-center gap-1">
                <span>-</span>
              </div>
            </th> -->
          </tr>
        </thead>
        <tbody class="border-spacing-1">
          <tr v-if="isEmpty">
            <td
              :colspan="
                effectiveColumns.length +
                (config.hasSlot && config.slots ? config.slots.length : 0) +
                1
              "
              class="text-center p-3"
            >
              <span class="text-sm font-normal">{{
                message ?? $t("messages.noDataAvailable")
              }}</span>
            </td>
          </tr>
          <tr
            v-for="(item, index) in data"
            :key="item.id"
            :class="index % 2 === 0 ? '' : ''"
            class="text-text shadow-main bg-table hover:bg-table-hover cursor-pointer"
            @click="onTab(item)"
            @touchend="onTab(item)"
          >
            <td
              v-for="(column, colIndex) in effectiveColumns"
              :key="column.key"
              class="p-3 text-sm text-center whitespace-pre"
            >
              <template v-if="column.isImage">
                <div
                  class="m-auto h-8 w-8 cursor-pointer"
                  @click.stop="showImagePreview(item[column.key])"
                >
                  <img
                    :src="item[column.key]"
                    alt="Image"
                    class="h-full w-full rounded object-cover"
                  />
                </div>
              </template>

              <template v-else>
                <div
                  :class="[
                    column.key != 'id' ? 'w-[200px] m-auto' : 'w-[40px] m-auto',
                  ]"
                >
                  <div
                    :class="[
                      '',
                      'w-full text-center text-wrap break-words m-auto flex justify-center items-center gap-0.5',
                      column.style ? column.style(item[column.key], item) : '',
                    ]"
                  >
                    <span>
                      {{
                        column.key === "id"
                          ? getId(index + 1)
                          : column.formatter
                          ? column.formatter(item[column.key], item)
                          : item[column.key] == 0
                          ? item[column.key]
                          : !item[column.key] || item[column.key] == "null"
                          ? "-"
                          : item[column.key]
                      }}
                    </span>

                    <Icon
                      v-if="column.canCopy"
                      name="solar:copy-bold"
                      class="transition duration-300 text-primary hover:text-primary-hover cursor-pointer size-5"
                      @click.stop="
                        copyToClipboard(
                          column.key === 'id'
                            ? getId(index + 1)
                            : column.formatter
                            ? column.formatter(item[column.key], item)
                            : item[column.key] == 0
                            ? item[column.key]
                            : !item[column.key] || item[column.key] == 'null'
                            ? '-'
                            : item[column.key]
                        )
                      "
                    />
                  </div>
                </div>
              </template>
            </td>

            <!-- Slots -->
            <td
              v-if="config.hasSlot"
              v-for="slot in config.slots"
              :key="slot.key"
              class="p-3 text-sm text-center whitespace-pre"
            >
              <div class="flex justify-center items-center w-full h-full">
                <slot :name="slot.key" :item="item"></slot>
              </div>
            </td>

            <!-- Actions -->
            <!-- <td class="p-3 text-sm text-center whitespace-nowrap">
              <div class="flex justify-center items-center w-full h-full">
                <Icon
                  name="lsicon:view-filled"
                  class="text-xl text-primary cursor-pointer"
                  @click="onTab(item)"
                />
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Image Preview -->
  <Teleport to="body">
    <BaseImagePreview
      v-if="imagePreview"
      :image="image"
      @close="closeImagePreview"
    />
  </Teleport>
</template>

<script lang="ts" setup>
// Types
import type { DataTableProps } from "@/types/shared/data-table";

// Props
const props = defineProps<DataTableProps>();

// States
const imagePreview = ref(false);
const image = ref("");

// Emits
const emits = defineEmits(["on-tab"]);

// Computed Properties
const getId = computed(() => {
  return (id: number) => props.perPage * (props.currentPage - 1) + id;
});

// Column visibility stuff
let tableColumnsApi: any = null;

try {
  tableColumnsApi = inject("tableColumns", null);
} catch (e) {
  tableColumnsApi = null;
}

const effectiveColumns = computed(() => {
  const cols = props.config?.columns || [];

  if (!tableColumnsApi || !tableColumnsApi.registerColumn) return cols;

  cols.forEach((c: any) =>
    tableColumnsApi.registerColumn({ key: c.key, label: c.label })
  );

  const visibleRaw = tableColumnsApi.visibleColumns as any;

  const visible =
    visibleRaw && typeof visibleRaw === "object" && "value" in visibleRaw
      ? visibleRaw.value
      : visibleRaw;

  if (!visible) return cols;

  return cols.filter((c: any) => {
    if (typeof visible[c.key] === "undefined") return true;
    return !!visible[c.key];
  });
});

// Functions
const onTab = (item: Record<string, any>) => emits("on-tab", item);

const showImagePreview = (imageUrl: string) => {
  image.value = imageUrl;
  imagePreview.value = true;
};

const closeImagePreview = () => {
  image.value = "";
  imagePreview.value = false;
};

const copyToClipboard = (text: string) => {
  if (!text || text === "-") return;

  navigator.clipboard.writeText(text).then(
    () => {},
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
};
</script>
