<template>
  <div v-if="!isLogin">
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
    <button @click="signOutUser" class="max-w-xs my-2">logout</button>
  </div>

</template>

<script>
import Field from '@/components/Field.vue';
import { ref } from 'vue';
import { useAuth, signupEmailPassword } from '@/firebase.js';

export default {
  components: { Field },
  setup(){
    const { user, isLogin, signOutUser, signInEmail } = useAuth();
    const signupEmail = ref('');
    const loginEmail = ref('');
    const signupPassword = ref('');
    const loginPassword = ref('');

    return {
      signupEmail, signupPassword, signupEmailPassword,
      loginEmail, loginPassword,
      user, isLogin, signOutUser, signInEmail
    };
  }
}
</script>