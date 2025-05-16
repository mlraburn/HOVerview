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

        const actualDirection = directionString.trim().split(' ').pop();

        if (actualDirection === 'northbound') {
            // add .northbound and remove others
            arrowElement.classList.add('northbound');
            arrowElement.classList.remove('southbound');

            // make arrow go up and change text
            statusTextElement.textContent = 'North bound!';
            arrowElement.textContent = '↑';

            // add .northbound to status
            statusElement.classList.add('northbound');
            statusElement.classList.remove('southbound');

        } else if (actualDirection === 'southbound') {
            // add .southbound and remove others
            arrowElement.classList.add('southbound');
            arrowElement.classList.remove('northbound');

            // make arrow go down and change text
            statusTextElement.textContent = 'South bound!';
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

document.addEventListener('DOMContentLoaded', initApp);