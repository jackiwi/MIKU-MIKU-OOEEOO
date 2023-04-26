import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';

import Field from '@/components/Field.vue';

import { syncfusionConfig } from '@/../sConfig';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(syncfusionConfig);

createApp(App)
  .use(router)
  .component("Field", Field)
  .mount('#app');