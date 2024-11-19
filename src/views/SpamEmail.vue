<template>
    <div class="email-list">
        <div class="d-flex gap-5 p-4">
            <FolderIcon class="h-5 w-5" />
            <EnvelopeOpenIcon class="h-5 w-5" />
            <StarIcon class="h-5 w-5" />
            <StarIcon class="h-5 w-5 text-warning" />
        </div>

        <hr>

        <div v-for="email in emails" :key="email.id"
            class="email-item ms-3 d-flex justify-content-between align-items-center p-3 border-bottom">
            <div class="d-flex">
                <div class="d-flex gap-2">
                    <input type="checkbox">
                    <!-- <StarIcon class="h-5 w-5" /> -->
                </div>
                <div class="email-info ms-5">
                    <strong>{{ email.sender }}</strong> - <span class="text-muted">{{ email.subject }}</span>
                    <p class="text-muted">{{ email.snippet }}</p>
                </div>
            </div>

            <div class="email-actions d-flex">
                <EyeIcon class="h-5 w-5 mx-2" />
                <EnvelopeIcon class="h-5 w-5 mx-2" />
                <TrashIcon class="h-5 w-5 mx-2" />
            </div>
        </div>

    </div>
</template>

<script>
import { EyeIcon, EnvelopeIcon, TrashIcon, FolderIcon, EnvelopeOpenIcon, StarIcon } from '@heroicons/vue/24/outline';

export default {
    components: {
        EyeIcon,
        EnvelopeIcon,
        TrashIcon,
        FolderIcon,
        StarIcon,
        EnvelopeOpenIcon
    },
    data() {
        return {
            emails: [
                { id: 1, sender: "Jane Doe", subject: "Meeting Agenda", snippet: "Hi John, I hope you're doing well..." },
                // Add more sample emails here
            ]
        };
    }
};
</script>

<style scoped>
.email-list {
    flex: 1;
}

.email-item:hover {
    background-color: #f1f1f1;
}

.h-5 {
    height: 1.25rem;
}

.w-5 {
    width: 1.25rem;
}
</style>
