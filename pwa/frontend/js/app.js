// DOM elements
const statusTextElement = document.getElementById('statusText');
const statusElement = document.getElementById('status');
const arrowElement = document.getElementById('arrow');
const infoElement = document.getElementById('info');
const lastUpdatedElement = document.getElementById('last-updated');
const lastUpdatedTimeElement = document.getElementById('last-updated-time');
const refreshButtonElement = document.getElementById('refresh-button');

// Backend Path
const BACKEND_API_PATH = 'api/lane-status';



async function getStatusOfLanes() {

    statusTextElement.textContent = 'Loading...';

    const response = await fetch(BACKEND_API_PATH);

    if (!response.ok) {
        throw new Error('API request failed.');
    }

    const data = await response.json();

    const directionString = data.direction;
    const timestampDate = data.timestamp;

    console.log(timestampDate);

    const actualDirection = directionString.trim().split(' ').pop();

    if (actualDirection === 'northbound') {
        // make arrow go up
        statusTextElement.textContent = 'North bound!';
        arrowElement.textContent = '↓';

    } if (actualDirection === 'southbound') {
        statusTextElement.textContent = 'South bound!';
        // make arrow go down
        arrowElement.textContent = '↑'
    }

}