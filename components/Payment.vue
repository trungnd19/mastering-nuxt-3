<template>
    <Modal @close="$emit('close')">
        <div class="bg-slate-200 p-8 rounded-xl w-full max-w-2xl">
            <div v-if="success" class="flex flex-col justify-center items-center space-y-6">
                <h2 class="text-xl font-bold">Thanks for buying the course!</h2>
                <button @click="login"
                    class="mt-4 w-full text-md text-black h-12 px-16 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition bg-blue-300 hover:bg-blue-200">
                    Login with Github to access
                </button>
            </div>
            <form v-else @submit.prevent="handleSubmit">
                <h2 class="font-bold text-xl text-center">Buying {{ course.title }}</h2>
                <div class="mt-8 text-base width bg-white py-6 px-8 rounded shadow-md">
                    <div class="w-full flex justify-between items-center mb-8">
                        <label class="font-bold">Email</label>
                        <input class="input ml-6 focus:outline-none text-left w-full" type="email" autocomplete="email"
                            v-model="email" placeholder="your@email.com" required />
                    </div>

                    <div id="card-element">
                        <!-- Elements will create input elements here -->
                    </div>
                </div>

                <button
                    class="font-sans mt-4 w-full text-lg text-black h-12 px-16 rounded focus:outline-none focus:shadow-outline font-bold flex items-center justify-center transition"
                    :class="processingPayment || email === ''
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-yellow-300 hover:bg-yellow-200 cursor-pointer'
                        " :disabled="processingPayment || email === ''">
                    <Loading v-if="processingPayment" class="h-5 w-5" />
                    <span v-else>Pay $97</span>
                </button>
            </form>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, Loading } from "#components";
import useCourse from "~/composables/useCourse";
import { ref, useHead, useRuntimeConfig } from "#imports";
const course = await useCourse();
const config = useRuntimeConfig();
const stripe = ref(null);
const card = ref(null);
const email = ref("");
const processingPayment = ref(false);
const success = ref(false);
const paymentIntentId = ref(null);
const formStyle = {
    base: {
        fontSize: "16px",
        color: "#3d4852",
        "::placeholder": {
            color: "#8795a1",
        },
    },
};
function setupStripe() {
    console.log("setupStripe");
}
function login() {
    console.log("login");
}
function handleSubmit() {
    console.log("handleSubmit");
}
useHead({
    script: [
        {
            src: "https://js.stripe.com/v3/",
            onload: setupStripe,
        },
    ],
});
</script>