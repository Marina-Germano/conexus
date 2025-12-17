<script setup>
import LoginForm from '@/components/LoginForm.vue';
</script>

<template>
    <v-app class="bg-grey-lighten-2">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align ="center" justify="center">
                    <v-col cols="12" sm="8" md="6" lg="4">
                        <v-card class="pa-4 pa-sm-8" elevation="6">
                            <LoginForm />
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped>
</style>