const canvas = document.querySelector(".canvas");
const clearBtn = document.querySelector(".clear");
const eraserBtn = document.querySelector(".eraser");
const defaultColorPalette = document.querySelector(".default-colors");
const colorPicker = document.querySelector("input[type='color']");
const colorSelectorBtn = document.querySelector(".color-picker");
const customColorsBtn = document.querySelector(".custom-colors-btn")

let isSelectingColor = false;
const DIMENSION = 21;

let pixels;
let currentColor = "black";

const defaultColors = ["#333333", "#ff9a51", "#f8fb6a", "#86e67e", "#31c6ed", "#FF51E3", "#9714ff", "rainbow"];

function generateBoard(dimension) {
    for (let i = 0; i < dimension; i++) {
        const gridRow = document.createElement("div");
        gridRow.classList.add("pixelRow");
        for (let j = 0; j < dimension; j++) {
            const pixel = document.createElement("div");
            pixel.style.height = canvas.offsetHeight / dimension + "px";
            pixel.style.width = canvas.offsetWidth / dimension + "px";
            // pixel.style.background = "red";
            pixel.classList.add("pixel");
            gridRow.appendChild(pixel);
        }
        canvas.appendChild(gridRow);
    }
}

function generateDefaultColors() {
    let colorIndex = 0;
    for (let i = 0; i < 2; i++) {
        const colorRow = document.createElement("div");
        colorRow.classList.add("color-row");
        for (let j = 0; j < defaultColors.length / 2; j++) {
            const colorDiv = document.createElement("div");
            colorDiv.classList.add("color-select");
            if (defaultColors[colorIndex] === "rainbow") {
                colorDiv.classList.add("rainbow");
                colorDiv.addEventListener("click", () => {
                    currentColor = "rainbow";
                })
            }
            else {
                colorDiv.style.backgroundColor = defaultColors[colorIndex++];
                colorDiv.addEventListener("click", () => {
                    currentColor = colorDiv.style.backgroundColor;
                })
            }
            colorRow.appendChild(colorDiv);
        }
        defaultColorPalette.appendChild(colorRow);
    }
}


function repaintCanvas(pixelColor) {
    Array.from(pixels).forEach(pixel => {
        pixel.style.backgroundColor = pixelColor;
    })
}

function getAllPixels() {
    pixels = document.querySelectorAll(".pixel");
}

let lastPixel;
function colorPixel(pixel) {
    if (currentColor === "rainbow") {
        const randomIndex = Math.floor(Math.random() * defaultColors.length);

        // Adding this logic, so the colors don't flicker in one pixel
        if (lastPixel != pixel.target) {
            pixel.target.style.backgroundColor = defaultColors[randomIndex];
            lastPixel = pixel.target;
        }
    }
    else {
        pixel.target.style.backgroundColor = currentColor;
    }
}

function captureEvents() {
    window.addEventListener("mousedown", () => {
        Array.from(pixels).forEach(pixel => {
            pixel.addEventListener("mousemove", colorPixel)
        })
    })

    window.addEventListener("mouseup", () => {
        Array.from(pixels).forEach(pixel => {
            pixel.removeEventListener("mousemove", colorPixel)
        })
    })

    Array.from(pixels).forEach(pixel => {
        pixel.addEventListener("click", () => {
            if (isSelectingColor) {
                currentColor = pixel.style.backgroundColor;
                isSelectingColor = false;
                document.body.style.cursor = "auto";
            }
        })
    })

}

function captureUtilityEvents() {
    clearBtn.addEventListener("click", () => {
        repaintCanvas("white");
    })

    eraserBtn.addEventListener("click", () => {
        currentColor = "white";
    })

    colorPicker.addEventListener("change", () => {
        currentColor = colorPicker.value;
    })

    customColorsBtn.addEventListener("click", () => {
        colorPicker.click();
    })

    colorSelectorBtn.addEventListener("click", () => {
        document.body.style.cursor = "crosshair";
        isSelectingColor = true;
    })
}



generateBoard(DIMENSION);
generateDefaultColors();
getAllPixels();
captureEvents();
captureUtilityEvents();
