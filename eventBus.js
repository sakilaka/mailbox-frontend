import { reactive } from "vue";

export const eventBus = reactive({
  isSidebarVisible: true,
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  },
});

