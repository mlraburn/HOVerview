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
            lastUpdatedTimeElement.classList.add('fade-time');
            throw new Error('API request failed.');
        }

        const data = await response.json();

        await sleep(1000)

        const directionString = data.direction;
        const timestampDate = data.timestamp;

        console.log(timestampDate);

        // Once we get an updated time we will stop fade on ...
        // But we will post time kinda slow
        updateTime(timestampDate);

        const actualDirection = directionString.trim().split(' ').pop();

        // We only spin animate the arrow if the status of the arrow is different
        const spinObj = checkIfArrowStatusIsDifferent(actualDirection);
        if (spinObj.spin) {
            // we need to spin by spinObj.degrees amount of degrees
            // 1. Create a unique animation name
            const animationName = `spin-${Date.now()}`;

            // 2. Create a style element for the keyframes
            const styleEl = document.createElement('style');
            styleEl.textContent = `
                @keyframes ${animationName} {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(${spinObj.degrees}deg); }
                }`;
            document.head.appendChild(styleEl);

            // 3. Store the original text content and classes
            const originalText = arrowElement.textContent;
            const originalClasses = [...arrowElement.classList];

            // 4. Remove direction classes temporarily during animation
            arrowElement.classList.remove('northbound', 'southbound');

            // 5. Apply the animation
            arrowElement.style.animation = `${animationName} 0.5s ease-in-out forwards`;

            // 6. Wait for animation to complete
            const handleAnimationEnd = () => {
                // Remove animation
                arrowElement.style.animation = '';

                // Update the text content based on new direction
                if (actualDirection === 'northbound') {
                    arrowElement.textContent = '↑';
                } else if (actualDirection === 'southbound') {
                    arrowElement.textContent = '↓';
                } else {
                    arrowElement.textContent = '→';
                }

                // Clean up
                arrowElement.removeEventListener('animationend', handleAnimationEnd);
                document.head.removeChild(styleEl);
            };

            arrowElement.addEventListener('animationend', handleAnimationEnd);
        }

        if (actualDirection === 'northbound') {
            // add .northbound and remove others
            arrowElement.classList.add('northbound');
            arrowElement.classList.remove('southbound');

            // make arrow go up
            statusTextElement.textContent = 'North Bound!';

            // add .northbound to status
            statusElement.classList.add('northbound');
            statusElement.classList.remove('southbound');

        } else if (actualDirection === 'southbound') {
            // add .southbound and remove others
            arrowElement.classList.add('southbound');
            arrowElement.classList.remove('northbound');

            // make arrow go down and change text
            statusTextElement.textContent = 'South Bound!';


            // add .southbound to status
            statusElement.classList.add('southbound');
            statusElement.classList.remove('northbound');
        } else {
            // remove directions from arrow element
            arrowElement.classList.remove('northbound');
            arrowElement.classList.remove('southbound');

            // make arrow go horizontal and change text
            statusTextElement.textContent = 'Loading...';

            // remove .southbound and .northbound from status
            statusElement.classList.remove('northbound');
            statusElement.classList.remove('southbound');
        }

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkIfArrowStatusIsDifferent(nextDirection) {

    let currentDirection = '';

    let spinDictionary = {
        spin: false,
        degrees: 0
    };

    if (arrowElement.classList.length > 1) {
        if (arrowElement.classList.contains('northbound')) {
            currentDirection = 'northbound';
        } else {
            currentDirection = 'southbound';
        }
    } else {
        currentDirection = 'unknown';
    }

    if (nextDirection === currentDirection) {
        return spinDictionary; // this returns the default which is spin: false, degrees 0
    }

    if (nextDirection === 'northbound') {
        if (currentDirection === 'unknown') {
            // this is when the arrow is already facing right ->
            spinDictionary.spin = true;
            spinDictionary.degrees = -90;
        } else {
            // this is situation when arrow is already facing down.
            spinDictionary.spin = true;
            spinDictionary.degrees = 180;
        }

    } else if (nextDirection === 'southbound') {
        if (currentDirection === 'unknown') {
            spinDictionary.spin = true;
            spinDictionary.degrees = 90;
        } else {
            //scenario where it is facing north already.
            spinDictionary.spin = true;
            spinDictionary.degrees = 180;
        }
    } else { // next direction is now unknown
        if (currentDirection === 'northbound') {
            spinDictionary.spin = true;
            spinDictionary.degrees = 90;
        } else {
            // situation where the current direction is southbound
            spinDictionary.spin = true;
            spinDictionary.degrees = -90;
        }
    }

    return spinDictionary;
}

document.addEventListener('DOMContentLoaded', initApp);