import type { Config } from "@react-router/dev/config";

export default {
  // Tento řádek říká robotovi: "Zapomeň na src, všechno je ve složce app"
  appDirectory: "app",
  ssr: false,
} satisfies Config;
