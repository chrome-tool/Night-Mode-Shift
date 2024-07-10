import {
  getDarkMode,
  getColor,
  getOpacity,
  createScreenCover,
} from "./utils.js";

class Content {
  excute = async () => {
    const darkModeVal = await getDarkMode();
    const colorval = await getColor();
    const opacityVal = await getOpacity();
    const screenCoverDiv = document.getElementById("screen-cover");
    if (darkModeVal) {
      screenCoverDiv.style.backgroundColor = colorval;
      screenCoverDiv.style.opacity = opacityVal;
      screenCoverDiv.style.display = "block";
    } else {
      screenCoverDiv.style.display = "none";
    }
  };

  init = async () => {
    createScreenCover();
    await this.excute();
  };
}

new Content().init();
