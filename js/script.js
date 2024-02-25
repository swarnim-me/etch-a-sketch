const canvas = document.querySelector(".canvas");

const dimension = 16;

console.log(canvas.offsetHeight);
console.log(canvas.offsetWidth);
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

const pixels = document.querySelectorAll(".pixel");
const pixelsArray = Array.from(pixels);
console.log(pixelsArray);
function colorPixel(pixel) {
    pixel.target.style.backgroundColor = "red";
}
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