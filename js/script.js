const canvas = document.querySelector(".canvas");
const clearBtn = document.querySelector(".clear");
const DIMENSION = 21;

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


function repaintCanvas(pixelColor) {
    Array.from(pixels).forEach(pixel => {
        pixel.style.backgroundColor = pixelColor;
    })
}

function getAllPixels() {
    return document.querySelectorAll(".pixel");
}

function colorPixel(pixel) {
    pixel.target.style.backgroundColor = "red";
}

function captureEvents(pixels) {
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
}

clearBtn.addEventListener("click", () => {
    repaintCanvas("white");
})


generateBoard(DIMENSION);
const pixels = getAllPixels();
captureEvents(pixels);