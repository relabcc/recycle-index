import isArray from 'lodash/isArray';
import chunk from 'lodash/chunk';
import { getImage } from '../components/utils/useWebpImage';

const getImageContainer = () => {
  let container = document.getElementById('re-image-preloader');
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 're-image-preloader');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.zIndex = '-999';
    container.style.width = '1px';
    document.body.appendChild(container);
  }
  return container;
}

const loadTask = (src) => new Promise((res) => {
  const img = new Image();
  img.onload = () => setTimeout(res);
  const container = getImageContainer();
  container.appendChild(img);
  img.src = isArray(src) ? getImage(src) : (src?.default || src);
});

const loader = (images) => {
  if (isArray(images)) {
    const queue = chunk(images.filter(Boolean), 6);
    if (queue.length > 1) {
      return queue.reduce((prev, chunks) => {
        return prev.then(() => Promise.all(chunks.map(loadTask)));
      }, Promise.resolve());
    } else {
      return Promise.all(images.map(loadTask));
    }
  }
  return loadTask(images);
}

export default loader
