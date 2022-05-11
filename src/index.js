import './styles/styles.css';
import pictures from "./js/app.js";
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import refs from './js/refs';

const createGalleryItem = ({ preview, original, description }) =>
  `<li class="gallery__item">
<a
  class="gallery__link"
  href=${original}
>
  <img
    class="gallery__image"
    src=${preview}
    data-source=${original}
    alt=${description}
  />
</a>
</li>`;

const galleryItem = pictures.reduce(
  (acc, item) => acc + createGalleryItem(item),
  ""
);

refs.gallery.insertAdjacentHTML("afterbegin", galleryItem);
refs.gallery.addEventListener('click', openImg);

let instance = null;

function openImg(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'IMG') {
        return;
    }
    instance = basicLightbox.create(
        `<img
        src=${e.target.getAttribute('data-source')}
        alt=${e.target.alt}
        />`,
    );

    instance.show();
    const elem = instance.element();
    refs.modalImage = elem.querySelector('img');

    window.addEventListener('keyup', onKey);
}

const findCurrentImageIndex = () => {
    return pictures.findIndex(img => img.original === refs.modalImage.src);
};

function onKey(event) {
    if (event.code === "Escape") {
        instance.close();
      
        refs.modalImage = null;
        window.removeEventListener('keyup', onKey);
    }

    if (event.code === "ArrowRight") {
        let imgIndex = findCurrentImageIndex();
        if (imgIndex === pictures.length - 1) {
            imgIndex -= pictures.length;
        }
        imgIndex += 1;
        refs.modalImage.src = pictures[imgIndex].original;
        refs.modalImage.alt = pictures[imgIndex].description;
    }

    if (event.code === "ArrowLeft") {
        let imgIndex = findCurrentImageIndex();
        if (imgIndex === 0) {
            imgIndex += pictures.length;
        }
        imgIndex -= 1;
        refs.modalImage.src = pictures[imgIndex].original;
        refs.modalImage.alt = pictures[imgIndex].description;
    }
}
