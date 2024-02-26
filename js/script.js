const canvas = document.querySelector(".canvas");
const clearBtn = document.querySelector(".clear");
const exportBtn = document.querySelector(".export");
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

const defaultColors = ["#121212", "#ffffff", "#f8fb6a", "#86e67e", "#31c6ed", "#fc035e", "#9714ff", "rainbow"];

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
            pixel.classList.add("grid");
            gridRow.appendChild(pixel);
        }
        canvas.appendChild(gridRow);
    }
}

function generateDefaultColors() {
    if (defaultColorPalette.children.length != 0) return;
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
            colorDiv.style.background = "none"
            colorDiv.style.border = "#262626 4px solid"
            colorDiv.addEventListener("click", (event) => {
                if (event.shiftKey) colorDiv.style.background = "none";
                else if (colorDiv.style.background === "none") {
                    colorDiv.style.backgroundColor = currentColor;
                }
                else {
                    currentColor = colorDiv.style.background;
                }
            })
            colorRow.appendChild(colorDiv);
        }
        userColorPalette.appendChild(colorRow);
    }
}


function repaintCanvas(pixelColor) {
    Array.from(pixels).forEach(pixel => {
        pixel.style.background = pixelColor;
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
                pixel.target.style.background = defaultColors[randomIndex];
                lastPixel = pixel.target;
            }
        }
        else {
            pixel.target.style.background = currentColor;
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
        repaintCanvas("none");
    })

    exportBtn.addEventListener("click", exportCanvas);

    eraserBtn.addEventListener("click", () => {
        currentColor = "none";
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
        restart();
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
        restart();
    })

    dimensionInput.addEventListener("keydown", (event) => {
        console.log(event);
        if (event.key == 'Enter') {
            dimensionInput.blur();
            if (dimensionInput.value < 4) dimensionInput.value = 4;
            restart();
        }
    })
}

function exportCanvas() {
    html2canvas(canvas, { backgroundColor: null }).then(function (canvas) {
        var dataURL = canvas.toDataURL();
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = 'export.png';
        link.click();
    });
}

function start() {
    canvas.innerHTML = "";
    generateBoard(dimensionInput.value);
    generateDefaultColors();
    generateUserColors();
    getAllPixels();
    captureEvents();
    captureUtilityEvents();
}

function restart() {
    canvas.innerHTML = "";
    generateBoard(dimensionInput.value);
    getAllPixels();
    captureEvents();
}

start();