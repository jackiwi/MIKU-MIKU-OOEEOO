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

  <div class="flex justify-center">
    <img class="pt-4 max-w-xl" src="https://media.discordapp.net/attachments/794102870446309378/1100809696815882340/image.png" />
  </div>

</template>

<script>
import { ref } from 'vue';
import { useAuth, signOutUser, signInEmail, signupEmailPassword } from '@/firebase';
import { useDark, useToggle } from '@vueuse/core';

export default {
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