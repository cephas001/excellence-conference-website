<template>
  <div
    class="bg-theme-base p-6 rounded-xl border border-theme-border space-y-4"
  >
    <div>
      <span
        class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
        >Bank Name</span
      >
      <span class="text-white font-medium text-lg">{{
        accountDetails.accountBank
      }}</span>
    </div>
    <div>
      <span
        class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
        >Account Number</span
      >
      <div class="flex items-center gap-3">
        <span class="text-theme-primary font-bold text-2xl font-mono">{{
          accountDetails.accountNumber
        }}</span>
        <button
          @click="copyAccountNumber"
          class="text-gray-500 transition-colors"
          :class="isCopied ? 'text-theme-primary' : 'hover:text-white'"
          title="Copy Account Number"
        >
          <Icon
            :name="
              isCopied
                ? 'heroicons:check-circle'
                : 'heroicons:clipboard-document'
            "
            class="w-5 h-5 transition-all duration-300"
            :class="isCopied ? 'scale-110' : 'scale-100'"
          />
        </button>
      </div>
    </div>
    <div>
      <span
        class="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1"
        >Account Name</span
      >
      <span class="text-gray-300 font-medium">{{
        accountDetails.accountName
      }}</span>
    </div>
  </div>
</template>

<script setup>
const isCopied = ref(false);

const props = defineProps({
  accountDetails: {
    type: Object,
    required: true,
  },
});

const copyAccountNumber = async () => {
  try {
    // Write the account number to the user's clipboard
    await navigator.clipboard.writeText(props.accountDetails.accountNumber);

    // Show the checkmark icon
    isCopied.value = true;

    // Reset back to the clipboard icon after 2 seconds
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
</script>
