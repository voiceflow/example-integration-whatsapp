class WhatsAppRateLimiter {
    constructor() {
        this.lastSentTimes = new Map(); // Tracks the last sent time for each phone number
        this.backoffDelays = new Map(); // Tracks the current backoff delay for each phone number
        this.defaultDelay = 2000; // 2 seconds in milliseconds
        this.maxBackoffDelay = 60000; // Maximum backoff delay (e.g., 60 seconds)
    }

    /**
     * Sends a message to a phone number with rate limiting and backoff.
     * @param {string} phoneNumber - The recipient's phone number.
     * @param {string} message - The message to send.
     * @param {function} sendFunction - A function that actually sends the message (e.g., API call).
     */
    async sendMessageDelay(phoneNumber, message, sendFunction) {
        const now = Date.now();
        const lastSentTime = this.lastSentTimes.get(phoneNumber) || 0;
        const backoffDelay = this.backoffDelays.get(phoneNumber) || 0;

        // If within backoff delay, wait before sending
        const waitTime = Math.max(this.defaultDelay, backoffDelay) - (now - lastSentTime);
        if (waitTime > 0) {
            console.log(`Waiting ${waitTime}ms before sending to ${phoneNumber}`);
            await this.sleep(waitTime);
        }

        try {
        // Attempt to send the message
        await sendFunction(phoneNumber, message);
        console.log(`Message sent to ${phoneNumber}: "${message}"`);
        this.lastSentTimes.set(phoneNumber, Date.now());
        this.backoffDelays.delete(phoneNumber); // Reset backoff on success
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log(`HTTP 400 error for ${phoneNumber}, entering backoff`);
            const nextBackoff = this.calculateBackoffDelay(phoneNumber);
            this.backoffDelays.set(phoneNumber, nextBackoff);

            // Retry with modified message after backoff
            const modifiedMessage = `Sorry, I had to think longer: ${message}`;
            console.log(`Retrying after backoff with message: "${modifiedMessage}"`);
            await this.sendMessageDelay(phoneNumber, modifiedMessage, sendFunction);
        } else {
            console.error(`Failed to send message to ${phoneNumber}: ${error.message}`);
        }
    }
}

    /**
     * Handles incoming messages with a delay to avoid responding during active delays.
     * @param {string} phoneNumber - The sender's phone number.
     * @param {function} processFunction - A function that processes the incoming message.
     */
    async receiveMessageDelay(phoneNumber, processFunction) {
        const now = Date.now();
        const lastSentTime = this.lastSentTimes.get(phoneNumber) || 0;
        const backoffDelay = this.backoffDelays.get(phoneNumber) || 0;

        if (now - lastSentTime < Math.max(this.defaultDelay, backoffDelay)) {
            console.log(`Ignoring incoming message from ${phoneNumber} due to active delay`);
            return;
        }

        // Process the incoming message
        processFunction(phoneNumber);
    }

    /**
     * Calculates the next backoff delay using an exponential strategy.
     * @param {string} phoneNumber - The recipient's phone number.
     * @returns {number} The next backoff delay in milliseconds.
     */
    calculateBackoffDelay(phoneNumber) {
        const currentDelay = this.backoffDelays.get(phoneNumber) || 0;
        const nextDelay = Math.min(currentDelay * 4 || this.defaultDelay, this.maxBackoffDelay);
        return nextDelay;
    }

    /**
     * Helper function to sleep for a specified time using setTimeout.
     * @param {number} ms - Time in milliseconds.
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = WhatsAppRateLimiter;
