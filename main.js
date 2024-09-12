/*
* RANGE SLIDER
* adapted from: https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816
*/
document.addEventListener('DOMContentLoaded', () => {
    const fromSlider = document.querySelector('#fromSlider');
    const toSlider = document.querySelector('#toSlider');
    const fromTooltip = document.querySelector('#fromSliderTooltip');
    const toTooltip = document.querySelector('#toSliderTooltip');
    const scale = document.getElementById('scale');
  
    const COLOR_TRACK = "#E5E7EB30";
    const COLOR_RANGE = "#CA8A04";
    const COLOR_BARS = "#FED7AA70";
    const MIN = parseInt(fromSlider.getAttribute('min')); // scale will start from min value (first range slider)
    const MAX = parseInt(fromSlider.getAttribute('max')); // scale will end at max value (first range slider)
    const STEPS = parseInt(scale.dataset.steps); // update the data-steps attribute value to change the scale points


    function controlFromSlider(fromSlider, toSlider, fromTooltip, toTooltip) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
        if (from > to) {
            fromSlider.value = to;
        }
        setTooltip(fromSlider, fromTooltip);
        updateScaleColors(from, to);
    }

    function controlToSlider(fromSlider, toSlider, fromTooltip, toTooltip) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
        setToggleAccessible(toSlider);
        if (from <= to) {
            toSlider.value = to;
        } else {
            toSlider.value = from;
        }
        setTooltip(toSlider, toTooltip);
        updateScaleColors(from, to);
    }

    function getParsed(currentFrom, currentTo) {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
    }

    function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
        const rangeDistance = to.max - to.min;
        const fromPosition = from.value - to.min;
        const toPosition = to.value - to.min;
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
          ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
          ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
          ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
          ${sliderColor} 100%)`;
    }

    function setToggleAccessible(currentTarget) {
        const toSlider = document.querySelector('#toSlider');
        if (Number(currentTarget.value) <= 0) {
            toSlider.style.zIndex = 2;
        } else {
            toSlider.style.zIndex = 0;
        }
    }

    function setTooltip(slider, tooltip) {
        const value = slider.value;
        tooltip.textContent = `$${value}`;
        const thumbPosition = (value - slider.min) / (slider.max - slider.min);
        const percent = thumbPosition * 100;
        const markerWidth = 20; // Width of the marker in pixels
        const offset = (((percent - 50) / 50) * markerWidth) / 2;
        tooltip.style.left = `calc(${percent}% - ${offset}px)`;
    }

    function createScale(min, max, step) {
    const range = max - min;
    const steps = range / step;
    for (let i = 0; i <= steps; i++) {
        const value = min + (i * step);
        const percent = (value - min) / range * 100;
        const heightPercent = (i / steps) * 100; // Height increases from 0% to 100%
        const marker = document.createElement('div');
        marker.classList.add('marker');
        marker.style.left = `${percent}%`;
        marker.style.height = `${heightPercent}%`; // Set height based on position
        marker.dataset.value = value; // Store value for easy access
        scale.appendChild(marker);
    }
}

    function updateScaleColors(from, to) {
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            const value = parseInt(marker.dataset.value, 10);
            if (value >= from && value <= to) {
                marker.style.setProperty('--marker-bg', COLOR_BARS);
            } else {
                marker.style.setProperty('--marker-bg', COLOR_TRACK);
            }
        });
    }

   
   

    // Events
    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromTooltip, toTooltip);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, fromTooltip, toTooltip);

    // Initial load
    fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
    setToggleAccessible(toSlider);
    setTooltip(fromSlider, fromTooltip);
    setTooltip(toSlider, toTooltip);
    createScale(MIN, MAX, STEPS);
    updateScaleColors(parseInt(fromSlider.value, 10), parseInt(toSlider.value, 10));
});