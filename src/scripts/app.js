"use strict";
let habits = [];
const HABIT_KEY = "HABIT_KEY";
let globalActiveHabitId;

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
  popup: {
    cover: document.querySelector(".cover"),
    closeButton: document.querySelector(".close-button"),
    openButton: document.querySelector(".menu__add"),
    iconField: document.querySelector(".popup__form input[name='icon']"),
  },
};

/* Utils */

function loadData() {
  const habitsString = localStorage.getItem(HABIT_KEY);
  const habitArray = JSON.parse(habitsString);
  if (Array.isArray(habitArray)) {
    habits = habitArray;
  }
}

function saveData() {
  localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}


function validateForm(form, fields) {
  const formData = new FormData(form);
  res = {};
  for (const field of fields) {
    const fieldValue = data.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

/* RENDER */
function rerenderMenu(activeHabit) {
  for (const habit of habits) {
    const existed = document.querySelector(`[menu-habbit-id="${habit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.classList.add("icon");
      element.setAttribute("menu-habbit-id", habit.id);
      element.innerHTML = `<img src="images/${habit.icon}.svg" alt="${habit.name}"/>`;
      element.addEventListener("click", () => {
        rerender(habit.id);
      });
      if (activeHabit.id === habit.id)
        element.classList.add("menu__item_active");

      page.menu.appendChild(element);
      continue;
    }

    activeHabit.id === habit.id
      ? existed.classList.add("icon_active")
      : existed.classList.remove("icon_active");
  }
}
function renderHead(activeHabit) {
  page.header.h1.innerText = activeHabit.name;
  const progress =
    activeHabit.days.length / activeHabit.target > 1
      ? 100
      : (activeHabit.days.length / activeHabit.target) * 100;
  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function renderContent(activeHabit) {
  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = ` 
    <h2 class="habbit__day">День ${Number(index) + 1}</h2>
    <p class="habbit__comment">${activeHabit.days[index].comment}</p>
    <button class="habbit__delete" onclick=deleteDay(${index})>
      <img src="./images/delete-button.svg" alt="Удалить день ${index + 1}" />
    </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabit.days.length + 1}`;
}
//Working with days
function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
  }
  habits = habits.map((habit) => {
    if (habit.id === globalActiveHabitId) {
      return { ...habit, days: habit.days.concat([{ comment }]) };
    }
    return habit;
  });
  form["comment"].value = "";
  rerender(globalActiveHabitId);
  saveData();
}

function deleteDay(index) {
  habits = habits.map((habit) => {
    if (habit.id === globalActiveHabitId) {
      habit.days.splice(index, 1);
      return {
        ...habit,
        days: habit.days,
      };
    }
    return habit;
  });
  rerender(globalActiveHabitId);
  saveData();
}
//Working with days

function rerender(activeHabitId) {
  globalActiveHabitId = activeHabitId;
  const activeHabit = habits.find((habit) => habit.id === activeHabitId);
  if (!activeHabit) return;
  rerenderMenu(activeHabit);
  renderHead(activeHabit);
  renderContent(activeHabit);
}
//Скрытие popup
page.popup.closeButton.addEventListener("click", () => {
  page.popup.cover.classList.add("cover__hidden");
});

page.popup.cover.addEventListener("click", (event) => {
  if (event.target.classList.contains("cover"))
    page.popup.cover.classList.add("cover__hidden");
});

page.popup.openButton.addEventListener("click", () => {
  page.popup.cover.classList.remove("cover__hidden");
});
//Скрытие popup
//Working with habits
function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.icon_active");
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}
//Working with habits
function addHabit(event) {
  event.preventDefault();
}
/* INIT */
(() => {
  loadData();
  rerender(habits[0].id);
})();
