// composables/useCountdown.js
import { ref, onMounted, onUnmounted } from "vue";

export const useCountdown = (targetDateString) => {
  const timeLeft = ref({ days: "00", hours: "00", mins: "00", secs: "00" });
  let countdownInterval;

  const targetDate = new Date(targetDateString).getTime();

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      timeLeft.value = { days: "00", hours: "00", mins: "00", secs: "00" };
      clearInterval(countdownInterval);
      return;
    }

    timeLeft.value = {
      days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0",
      ),
      hours: String(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      ).padStart(2, "0"),
      mins: String(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      ).padStart(2, "0"),
      secs: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(
        2,
        "0",
      ),
    };
  };

  onMounted(() => {
    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  });

  onUnmounted(() => {
    clearInterval(countdownInterval);
  });

  return { timeLeft };
};
