// achievements.js

const ACHIEVEMENTS = {
  FIRST_VISIT: { id: "FIRST_VISIT", title: "A New World", desc: "Entered DeltaLauncher for the first time." },
  TALK_SEAM: { id: "TALK_SEAM", title: "Dark Knowledge", desc: "Listened to Seam's stories in the shop." },
  KONAMI_CODE: { id: "KONAMI_CODE", title: "Gamer Instincts", desc: "Entered the legendary cheat code." }
};

function getUnlockedAchievements() {
  return JSON.parse(localStorage.getItem("delta_achievements") || "[]");
}

function unlockAchievement(id) {
  const unlocked = getUnlockedAchievements();
  if (unlocked.includes(id) || !ACHIEVEMENTS[id]) return;

  unlocked.push(id);
  localStorage.setItem("delta_achievements", JSON.stringify(unlocked));
  showAchievementToast(ACHIEVEMENTS[id]);
}

function showAchievementToast(achievement) {
  // Play sound
  const audio = new Audio("../assets/sounds/snd_select.wav");
  audio.play().catch(() => {});

  // Create UI Toast
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
    <div class="toast-title">ACHIEVEMENT UNLOCKED!</div>
    <div class="toast-name">${achievement.title}</div>
    <div class="toast-desc">${achievement.desc}</div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}