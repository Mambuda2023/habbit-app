"use strict";
let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

/* Page */
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector("h1"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDay: document.querySelector(".habbit__day"),
  },
};

/* Utils */

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* RENDER */
function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.classList.add("menu__item");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}"/>`;
      element.addEventListener("click", () => {
        rerender(habbit.id);
      });
      if (activeHabbit.id === habbit.id)
        element.classList.add("menu__item_active");

      page.menu.appendChild(element);
      continue;
    }

    activeHabbit.id === habbit.id
      ? existed.classList.add("menu__item_active")
      : existed.classList.remove("menu__item_active");
  }
}
function renderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function renderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = ` 
    <h2 class="habbit__day">День ${Number(index) + 1}</h2>
    <p class="habbit__comment">${activeHabbit.days[index].comment}</p>
    <button class="habbit__delete">
      <img src="./images/delete-button.svg" alt="Удалить день ${index + 1}" />
    </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  if (!activeHabbit) return;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) return;
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderContent(activeHabbit);
}

/* INIT */
(() => {
  loadData();
  rerender(habbits[0].id);
})();
