<template>
    <div class="profile d-flex">
        <EmailList />
    </div>
</template>

<script>
import EmailList from '../EmailList.vue';

export default {
    components: {
        EmailList
    }
};
</script>

<style scoped>
.profile {
    display: flex;
    height: 90vh;
}
</style>
