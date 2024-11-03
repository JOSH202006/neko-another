const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'pinterest',
  description: 'Fetch images from Pinterest based on a query',
  author: 'Jay Mar',
  role: 1,

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ').trim();

    if (!query) {
      await sendMessage(senderId, { text: 'Please provide a search query for Pinterest images.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const images = response.data.result;

      if (images && images.length > 0) {
        const limitedImages = images.slice(0, 3);  // Limit to 3 images
        for (const imageUrl of limitedImages) {
          const imageMessage = {
            attachment: {
              type: 'image',
              payload: {
                url: imageUrl,
                is_reusable: true
              }
            }
          };
          await sendMessage(senderId, imageMessage, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: 'No images found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Pinterest images:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
          
