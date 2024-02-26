const canvas = document.querySelector(".canvas");
const clearBtn = document.querySelector(".clear");
const eraserBtn = document.querySelector(".eraser");
const defaultColorPalette = document.querySelector(".default-colors");
const userColorPalette = document.querySelector(".user-colors");
const colorPicker = document.querySelector("input[type='color']");
const colorSelectorBtn = document.querySelector(".color-picker");
const customColorsBtn = document.querySelector(".custom-colors-btn")
const plusBtn = document.querySelector(".plus");
const minusBtn = document.querySelector(".minus");
const dimensionInput = document.querySelector(".dimension");
const toggleGrid = document.querySelector(".toggle-grid");
const fillCanvasBtn = document.querySelector(".fill-canvas");
let modes = {
    normalMode: 1,
    fillMode: 2,
    selectMode: 3
}
let mode = modes.normalMode;
const DIMENSION = dimensionInput.value;
const USER_COLORS_COUNT = 8;
let pixels;

const defaultColors = ["#333333", "#ff9a51", "#f8fb6a", "#86e67e", "#31c6ed", "#FF51E3", "#9714ff", "rainbow"];

let currentColor = defaultColors[0];
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
    defaultColorPalette.innerHTML = "";
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

function generateUserColors() {
    if (userColorPalette.children.length != 0) return;
    for (let i = 0; i < 2; i++) {
        const colorRow = document.createElement("div");
        colorRow.classList.add("color-row");
        for (let j = 0; j < 4; j++) {
            const colorDiv = document.createElement("div");
            colorDiv.classList.add("color-select");
            colorDiv.classList.add("user-color");
            colorDiv.style.backgroundColor = "white";
            colorDiv.addEventListener("click", (event) => {
                if (event.shiftKey) colorDiv.style.backgroundColor = "white";
                else if (colorDiv.style.backgroundColor === "white") {
                    colorDiv.style.backgroundColor = currentColor;
                }
                else {
                    currentColor = colorDiv.style.backgroundColor;
                }
            })
            colorRow.appendChild(colorDiv);
        }
        userColorPalette.appendChild(colorRow);
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
    if (mode === modes.normalMode) {
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
            if (mode == modes.selectMode) {
                currentColor = pixel.style.backgroundColor;
                mode = modes.normalMode;
                document.body.style.cursor = "auto";
            }
            else if (mode == modes.fillMode) {
                repaintCanvas(currentColor);
                mode = modes.normalMode;
                document.body.style.cursor = "auto";
            }
        })
    })
}

function enforceMinMax(el) {
    if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            el.value = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}

function captureUtilityEvents() {
    toggleGrid.addEventListener("click", () => {
        Array.from(pixels).forEach(pixel => {
            pixel.classList.toggle("grid");
        })
    })

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
        mode = modes.selectMode;
    })
    fillCanvasBtn.addEventListener("click", () => {
        document.body.style.cursor = "copy";
        mode = modes.fillMode;
    })
    enforceMinMax(dimensionInput);
    plusBtn.addEventListener("click", (event) => {
        // canvas.innerHTML = "";
        if (event.shiftKey && Number(dimensionInput.value) + 10 <= 99)
            dimensionInput.value = Number(dimensionInput.value) + 10;
        else if (Number(dimensionInput.value) + 1 <= 99)
            dimensionInput.value = Number(dimensionInput.value) + 1;
        else
            dimensionInput.value = 99;
        start();
        // generateBoard(dimensionInput.textContent);
    })

    minusBtn.addEventListener("click", (event) => {
        if (event.shiftKey && Number(dimensionInput.value) - 10 >= 4)
            dimensionInput.value = Number(dimensionInput.value) - 10;
        else if (Number(dimensionInput.value) - 1 >= 4)
            dimensionInput.value = Number(dimensionInput.value) - 1;
        else
            dimensionInput.value = 4;
        // generateBoard(dimensionInput.textContent);
        start();
    })

    dimensionInput.addEventListener("keydown", (event) => {
        console.log(event);
        if (event.key == 'Enter') {
            dimensionInput.blur();
            if (dimensionInput.value < 4) dimensionInput.value = 4;
            start();
        }
    })
}

function start() {
    canvas.innerHTML = "";
    generateBoard(dimensionInput.value);
    generateDefaultColors();
    generateUserColors();
    getAllPixels();
    captureEvents();
}

// Don't need to repeat this, it causes weird bugs
captureUtilityEvents();
start();