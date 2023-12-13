import { searchImages } from './search-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMoreEl = document.querySelector('.js-load-more');

let page = 1;
let currentQuery = '';

formEl.addEventListener('submit', onFormElSubmit);
buttonLoadMoreEl.addEventListener('click', onButtonLoadMoreClick);

async function onFormElSubmit(event) {
  page = 1;

  event.preventDefault();
  buttonLoadMoreEl.hidden = false;
  galleryEl.innerHTML = '';
  currentQuery = event.currentTarget.elements[0].value;
  const images = await getImages(currentQuery);

  buttonLoadMoreEl.hidden = page * 40 >= images.totalHits;
  if (!images.totalHits) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  }

  renderSearchedImages(images);
}

async function getImages(query, page) {
  try {
    return await searchImages(query, page);
  } catch (error) {
    console.log(error);
  }
}

function renderSearchedImages(images) {
  const markup = images.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a class="gallery-link" href="${largeImageURL}"><img class="gallery_image" src="${webformatURL}" width="300" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

async function onButtonLoadMoreClick() {
  page++;
  const images = await getImages(currentQuery, page);
  renderSearchedImages(images);
  const { totalHits } = images;
  if (page * 40 >= totalHits) {
    buttonLoadMoreEl.hidden = true;
    if (totalHits && page > 1)
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
  } else {
    buttonLoadMoreEl.hidden = false;
  }
}
