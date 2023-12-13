import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

async function searchImages(query, page = 1) {
  const params = new URLSearchParams({
    key: '41202229-1e46ba6310cb4aac473b29a70',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export { searchImages };
