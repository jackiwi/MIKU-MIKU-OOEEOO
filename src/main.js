import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Field from '@/components/Field.vue';

createApp(App)
  .use(router)
  .component("Field", Field)
  .mount('#app');