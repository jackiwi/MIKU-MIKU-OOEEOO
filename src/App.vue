<template>
  <nav class="flex justify-evenly">
    <router-link to="/">Home</router-link>

    <Menu as="div" class="-mt-0.5 flex justify-center">
      <MenuButton class="dark:text-stone-100 hover:!text-zinc-700">combo tracker</MenuButton>
      <MenuItems class="menuItems">
        <MenuItem class="menuItem">
          <router-link to="/lemmein">lemme in</router-link>
        </MenuItem>
        <MenuItem class="menuItem">
          <router-link to="/ap">tracker</router-link>
        </MenuItem>
        <MenuItem class="menuItem">
          <router-link to="/stats">stats</router-link>
        </MenuItem>
      </MenuItems>
    </Menu>
    <router-link to="/events">event list</router-link>

    <Menu as="div" class="-mt-0.5 flex justify-center">
      <MenuButton class="dark:text-stone-100 hover:!text-zinc-700">tools</MenuButton>
      <MenuItems class="menuItems">
        <MenuItem class="menuItem">
          <router-link to="/exp">exp calc</router-link>
        </MenuItem>
        <MenuItem class="menuItem">
          <router-link to="/ep">EP calc</router-link>
        </MenuItem>
      </MenuItems>
    </Menu>
  </nav>

  <div class="p-4 flex flex-col place-content-evenly text-center">
    <router-view/>
  </div>

  <div ref="scrollTopButton"
    class="invisible sticky w-full flex justify-start bottom-0 pb-3 pl-5 transition">
    <button class="rounded-full" @click="scrollToTop">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </div>
</template>

<script>
  export default {
    mounted() {
      window.addEventListener("scroll", this.handleScroll);
    },
 
    beforeUnmount() {
      window.removeEventListener("scroll", this.handleScroll);
    },
 
    methods: {
      handleScroll() {
        const scrollBtn = this.$refs.scrollTopButton;

        if (window.scrollY > 0) {
          scrollBtn.classList.remove("invisible");
        } else {
          scrollBtn.classList.add("invisible");
        }
      },
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },

    setup(){
      return {
        Menu, MenuButton, MenuItem, MenuItems
      };
    }
  }
</script>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useDark } from '@vueuse/core';
const isDark = useDark();
</script>

<style>
html.dark {
  color-scheme: dark;
}
</style>