const {default: axios} = require("axios");

class WhatsAppRateLimiter {
    constructor(defaultDelay) {
        this.lastSentTimes = new Map(); // Tracks the last sent time for each phone number
        this.backoffDelays = new Map(); // Tracks the current backoff delay for each phone number
        this.defaultDelay = defaultDelay; // seconds in milliseconds
        this.maxBackoffDelay = 60000; // Maximum backoff delay (e.g., 60 seconds)
    }

    /**
     * Sends a message to a phone number with rate limiting and backoff.
     * @param {string} phoneNumber - The recipient's phone number.
     * @param {string} message - The message to send.
     * @param {function} sendFunction - A function that actually sends the message (e.g., API call).
     */
    async sendMessageDelay(phoneNumber, phoneNumberID, messages) {
        for (let j = 0; j < messages.length; j++) {
            const message = messages[j].value
            const now = Date.now();
            const lastSentTime = this.lastSentTimes.get(phoneNumber) || 0;
            const backoffDelay = this.backoffDelays.get(phoneNumber) || 0;
            const timeoutPerKB = 10; // Adjust as needed
            // Calculate wait time if within backoff delay
            const waitTime = Math.max(this.defaultDelay, backoffDelay) - (now - lastSentTime);
            if (waitTime > 0) {
                console.log(`Waiting ${waitTime}ms before sending to ${phoneNumber}`);
                await this.sleep(waitTime);
            }

            const {data, ignore} = this.createMessageData(messages[j], phoneNumber);
            console.log('data:', data);
            console.log('phoneNumber:', phoneNumber);
            console.log('phoneNumberID:', phoneNumberID);
            if (!ignore) {
                try {
                    // Attempt to send the message
                    await this.makeHttpRequest(phoneNumberID, data);
                    console.log(`Message sent to ${phoneNumber}: "${message}"`);
                    this.lastSentTimes.set(phoneNumber, Date.now());
                    this.backoffDelays.delete(phoneNumber); // Reset backoff on success
                    if (messages[j].type === 'image') {
                        try {
                            const response = await axios.head(messages[j].value)
                            if (response.headers['content-length']) {
                                const imageSizeKB =
                                    parseInt(response.headers['content-length']) / 1024
                                const timeout = imageSizeKB * timeoutPerKB
                                await new Promise((resolve) => setTimeout(resolve, timeout))
                            }
                        } catch (error) {
                            console.error('Failed to fetch image size:', error)
                            await new Promise((resolve) => setTimeout(resolve, 5000))
                        }
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        const errorData = error.response.data.error;

                        // Check for specific rate-limiting error code
                        if (errorData && errorData.code === 131056) {
                            console.log(`Rate limit error for ${phoneNumber}: ${errorData.message}`);
                            console.log(`Details: ${errorData.error_data.details}`);

                            const nextBackoff = this.calculateBackoffDelay(phoneNumber);
                            this.backoffDelays.set(phoneNumber, nextBackoff);

                            console.log(`Retrying original message: "${messages.type}"`);
                            await this.sendMessageDelay(phoneNumber, messages);

                        } else {
                            console.error(`Unhandled HTTP 400 error for ${phoneNumber}: ${errorData?.message || 'Unknown error'}`);
                        }
                    } else {
                        console.error(`Failed to send message to ${phoneNumber}: ${error.message}`);
                    }
                }
            }
        }
    }

    async makeHttpRequest(phoneNumberID, data) {
        console.log(`WhatsappVersion: ${process.env.WHATSAPP_VERSION}`);
        console.log(`Bearer ${process.env.WHATSAPP_TOKEN}`);
        try {
            const response = await axios({
                method: 'POST',
                    url: `https://graph.facebook.com/${process.env.WHATSAPP_VERSION}/${phoneNumberID}/messages`,
                    data: data,
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                },
              });
      return response.data;
    } catch (error) {
      throw error;
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

    createMessageData(message, from) {
        let data;
        let ignore = false;

        if (message.type === 'image') {
            data = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: from,
                type: 'image',
                image: {
                    link: message.value,
                },
            };
        } else if (message.type === 'audio') {
            data = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: from,
                type: 'audio',
                audio: {
                    link: message.value,
                },
            };
        } else if (message.type === 'buttons') {
            data = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: from,
                type: 'interactive',
                interactive: {
                    type: 'button',
                    body: {
                        text: message.previousValue || 'Make your choice',
                    },
                    action: {
                        buttons: message.buttons,
                    },
                },
            };
        } else if (message.type === 'text') {
            data = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: from,
                type: 'text',
                text: {
                    preview_url: true,
                    body: message.value,
                },
            };
        } else {
            ignore = true;
        }

        return {data, ignore};
    }
}

module.exports = WhatsAppRateLimiter;
