// import packages

// DOM elements
const statusTextElement = document.getElementById('statusText');
const statusElement = document.getElementById('status');
const arrowElement = document.getElementById('arrow');
const infoElement = document.getElementById('info');
const lastUpdatedElement = document.getElementById('last-updated');
const lastUpdatedTimeElement = document.getElementById('last-updated-time');
const refreshButtonElement = document.getElementById('refresh-button');

// Backend Path
const BACKEND_API_PATH = '/api/lane-status';


async function getStatusOfLanes() {
    try {
        statusTextElement.textContent = 'Loading...';

        const response = await fetch(BACKEND_API_PATH);

        if (!response.ok) {
            statusTextElement.textContent = 'error'
            throw new Error('API request failed.');
        }

        const data = await response.json();

        const directionString = data.direction;
        const timestampDate = data.timestamp;

        console.log(timestampDate);

        // Once we get an updated time we will stop fade on ...
        // But we will post time kinda slow
        updateTime(timestampDate);

        const actualDirection = directionString.trim().split(' ').pop();

        if (actualDirection === 'northbound') {
            // add .northbound and remove others
            arrowElement.classList.add('northbound');
            arrowElement.classList.remove('southbound');

            // make arrow go up and change text
            statusTextElement.textContent = 'North Bound!';
            arrowElement.textContent = '↑';

            // add .northbound to status
            statusElement.classList.add('northbound');
            statusElement.classList.remove('southbound');

        } else if (actualDirection === 'southbound') {
            // add .southbound and remove others
            arrowElement.classList.add('southbound');
            arrowElement.classList.remove('northbound');

            // make arrow go down and change text
            statusTextElement.textContent = 'South Bound!';
            arrowElement.textContent = '↓';

            // add .southbound to status
            statusElement.classList.add('southbound');
            statusElement.classList.remove('northbound');
        } else {
            // remove directions from arrow element
            arrowElement.classList.remove('northbound');
            arrowElement.classList.remove('southbound');

            // make arrow go horizontal and change text
            statusTextElement.textContent = 'Loading...';
            arrowElement.textContent = '⟷'

            // remove .southbound and .northbound from status
            statusElement.classList.remove('northbound');
            statusElement.classList.remove('southbound');
        }

        // Add the pulse animation
        arrowElement.classList.add('pulse');
        setTimeout(() => {
            arrowElement.classList.remove('pulse');
        }, 800);

    } catch (error) {
        console.log('Error:', error);
    }
}

function initApp() {

    getStatusOfLanes();

}

function updateTime(timeStamp, delay = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            lastUpdatedTimeElement.classList.remove('fade-time');
            lastUpdatedTimeElement.textContent = updateTimeLocalAndFormat(timeStamp);
            resolve();
        }, delay);
    });
}

function updateTimeLocalAndFormat(timeStamp) {
    const date = new Date(timeStamp);

    // Unless you use getUTC... functions then it will be local time
    // Format Hours
    let hours = date.getHours() % 12;  // get 0 - 11 using mod
    hours = hours ? hours : 12;  // because 0 is false then convert 0 to 12
    const formattedHours = hours.toString().padStart(2, '0'); // ensure 2 digits

    // Format Minutes
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');

    // Format AM PM (only A or P)
    const formattedAMPM = date.getHours() >= 12 ? 'P' : 'A';

    // Format Day
    const formattedDay = date.getDate().toString().padStart(2, '0');

    // Format Month (MMM)
    const formattedMonth = date.toLocaleString('en-US', {month: 'long'}).slice(0, 3).toUpperCase();

    // Format Year
    const formattedYear = date.getFullYear();

    return `${formattedHours}:${formattedMinutes}${formattedAMPM} ${formattedDay} ${formattedMonth} ${formattedYear}`;
}

document.addEventListener('DOMContentLoaded', initApp);