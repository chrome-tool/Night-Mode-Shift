import {
  getDarkMode,
  setDarkMode,
  getColor,
  setColor,
  getOpacity,
  setOpacity,
} from "./utils.js";

class Popup {
  constructor() {}

  getSelectedColor = () => {
    return document.querySelector(".color-item.active")?.style?.backgroundColor;
  };

  darkModeEvent = async () => {
    const darkMode = document.getElementById("darkMode");
    const opacity = document.getElementById("opacity");
    const colorval = this.getSelectedColor()
      ? this.getSelectedColor()
      : "transparent";
     setDarkMode(darkMode.checked);
     setColor(colorval);
     setOpacity(opacity.value);
     chrome.runtime.sendMessage({
      action: "execute",
    });
  };

  colorPickerSelect = async (e) => {
    const colorPickers = document.querySelectorAll(".color-item");
    for (let colorPicker of colorPickers) {
      colorPicker.classList.remove("active");
    }
    e.target.classList.add("active");
    await this.darkModeEvent();
  };

  init = async () => {
    const darkMode = document.getElementById("darkMode");
    const opacity = document.getElementById("opacity");
    const colorPickers = document.querySelectorAll(".color-item");
    const darkModeVal = await getDarkMode();
    const opacityVal = await getOpacity();
    const colorVal = await getColor();
    darkMode.checked = darkModeVal;
    opacity.value = opacityVal;
    for (let colorPicker of colorPickers) {
      colorPicker.classList.remove("active");
      if (colorPicker.style.backgroundColor === colorVal) {
        colorPicker.classList.add("active");
      }
      colorPicker.addEventListener("click", this.colorPickerSelect);
    }
    darkMode.addEventListener("change", this.darkModeEvent);
    opacity.addEventListener("change", this.darkModeEvent);
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const popup = new Popup();
  popup.init();
});
