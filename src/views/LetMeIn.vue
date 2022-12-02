<template>
  <div class="flex justify-center pb-5">
    <button class="w-fit" @click="toggleDark()">toggle dark mode</button>
  </div>
  
  <div v-if="!user">
    <form class="signup">
      <Field label="email">
        <input type="email" v-model="signupEmail" />
      </Field>
      <Field label="password">
        <input type="password" v-model="signupPassword" />
      </Field>
      <button @click.prevent="signupEmailPassword(signupEmail, signupPassword);">signup</button>
    </form>
    
    <form class="login">
      <Field label="email">
        <input type="email" v-model="loginEmail" />
      </Field>
      <Field label="password">
        <input type="password" v-model="loginPassword" />
      </Field>
      <button @click.prevent="signInEmail(loginEmail, loginPassword);">login</button>
    </form>
  </div>

  <div v-else>
    <p>logged in as {{ user.email }}</p>
    <button @click="signOutUser" class="max-w-xs my-2">logout</button>
  </div>

  <img class="pt-4" src="https://pbs.twimg.com/profile_banners/799084934673690624/1588044805/1080x360" />

</template>

<script>
import Field from '@/components/Field.vue';
import { ref } from 'vue';
import { useAuth, signOutUser, signInEmail, signupEmailPassword } from '@/firebase.js';
import { useDark, useToggle } from '@vueuse/core';

export default {
  components: { Field },
  setup(){
    const { user } = useAuth();
    const signupEmail = ref('');
    const loginEmail = ref('');
    const signupPassword = ref('');
    const loginPassword = ref('');

    const isDark = useDark();
    const toggleDark = useToggle(isDark);

    return {
      signupEmail, signupPassword, signupEmailPassword,
      loginEmail, loginPassword,
      user, signOutUser, signInEmail,
      isDark, toggleDark
    };
  }
}
</script>