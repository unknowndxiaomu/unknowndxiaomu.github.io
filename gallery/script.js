const galleries = () => {
  // Handle single images
  document.querySelectorAll('.hexo-gallery-slider > img').forEach((img) => {
    const gallery = img.parentElement;

    if (img.complete) {
      gallery.classList.add('initialized');
    } else {
      img.addEventListener('load', () => {
        gallery.classList.add('initialized');
      });
    }
  });

  // Handle slider galleries
  document.querySelectorAll('.slider-wrap').forEach((sliderWrap) => {
    const width = sliderWrap.offsetWidth;
    const gallery = sliderWrap.closest('.hexo-gallery-slider');

    // Store data using dataset API
    sliderWrap.dataset.pos = '0';
    const totalSlides = sliderWrap.querySelectorAll('ul li').length;
    sliderWrap.dataset.totalSlides = totalSlides.toString();
    sliderWrap.dataset.sliderWidth = width.toString();

    // Track loading of all images
    let loadedImages = 0;

    // Function to set dimensions once image is available
    const setDimensions = () => {
      const firstImage = sliderWrap.querySelector('img');
      const naturalWidth = firstImage.naturalWidth;
      const naturalHeight = firstImage.naturalHeight;
      const aspectRatio = naturalHeight / naturalWidth;
      const height = width * aspectRatio;

      if (height > 0 && !isNaN(height)) {
        // Set dimensions maintaining aspect ratio
        sliderWrap.querySelectorAll('img').forEach((img) => {
          img.style.width = `${width}px`;
          img.style.height = `${height}px`;
        });

        sliderWrap.style.height = `${height}px`;
        sliderWrap.querySelectorAll('.slider li').forEach((li) => {
          li.style.height = `${height}px`;
          li.style.width = `${width}px`;
        });
      }
    };

    const completeInitialization = () => {
      // Set dimensions and slider width all at once
      setDimensions();
      const slider = sliderWrap.querySelector('ul.slider');
      slider.style.width = `${width * totalSlides}px`;

      // next slide
      const nextBtn = sliderWrap.querySelector('.next');
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // const scrollPos = window.scrollY;
          slideRight(sliderWrap);
          // requestAnimationFrame(() => {
          //   window.scrollTo(0, scrollPos);
          // });
        });
      }

      // previous slide
      const prevBtn = sliderWrap.querySelector('.previous');
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // const scrollPos = window.scrollY;
          slideLeft(sliderWrap);
          // requestAnimationFrame(() => {
          //   window.scrollTo(0, scrollPos);
          // });
        });
      }

      // create pagination dots
      const paginationUl = sliderWrap.querySelector('.pagination-wrap ul');
      if (paginationUl) {
        for (let i = 0; i < totalSlides; i++) {
          const li = document.createElement('li');
          li.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // const scrollPos = window.scrollY;
            select(sliderWrap, i);
            // requestAnimationFrame(() => {
            //   window.scrollTo(0, scrollPos);
            // });
          });
          paginationUl.appendChild(li);
        }
      }

      // Setup all possible counter values
      const counter = sliderWrap.querySelector('.counter');
      if (counter) {
        const counterHtml = Array.from(
          { length: totalSlides },
          (_, i) =>
            `<span class="counter-value${i === 0 ? ' active' : ' hidden'}">${i + 1} / ${totalSlides}</span>`,
        ).join('');
        counter.innerHTML = counterHtml;
      }

      // Set up counter and pagination
      countSlides(sliderWrap);
      pagination(sliderWrap);

      // Make gallery visible once everything is ready
      gallery.classList.add('initialized');
    };

    // Get all images and handle loading
    const images = Array.from(sliderWrap.querySelectorAll('img'));
    let allLoaded = true;

    images.forEach((img) => {
      if (!img.complete) {
        allLoaded = false;
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === totalSlides) {
            completeInitialization();
          }
        });
      } else {
        loadedImages++;
      }
    });

    if (allLoaded) {
      completeInitialization();
    }

    // hide/show controls/btns when hover
    sliderWrap.addEventListener('mouseenter', () => {
      sliderWrap.classList.add('active');
    });
    sliderWrap.addEventListener('mouseleave', () => {
      sliderWrap.classList.remove('active');
    });
  });
};

/************************
 //*> SLIDER FUNCTIONS
************************/
const slideLeft = (elem) => {
  let pos = parseInt(elem.dataset.pos);
  pos--;
  if (pos < 0) {
    pos = parseInt(elem.dataset.totalSlides) - 1;
  }
  elem.dataset.pos = pos.toString();

  const width = parseInt(elem.dataset.sliderWidth);
  const slider = elem.querySelector('ul.slider');
  slider.style.left = `${-(width * pos)}px`;

  countSlides(elem);
  pagination(elem);
};

const slideRight = (elem) => {
  let pos = parseInt(elem.dataset.pos);
  pos++;
  if (pos >= parseInt(elem.dataset.totalSlides)) {
    pos = 0;
  }
  elem.dataset.pos = pos.toString();

  const width = parseInt(elem.dataset.sliderWidth);
  const slider = elem.querySelector('ul.slider');
  slider.style.left = `${-(width * pos)}px`;

  countSlides(elem);
  pagination(elem);
};

const select = (elem, index) => {
  elem.dataset.pos = index.toString();

  const width = parseInt(elem.dataset.sliderWidth);
  const slider = elem.querySelector('ul.slider');
  slider.style.left = `${-(width * index)}px`;

  countSlides(elem);
  pagination(elem);
};

/************************
 //*> UI UPDATE FUNCTIONS
************************/
const countSlides = (elem) => {
  const counter = elem.querySelector('.counter');
  if (counter) {
    const pos = parseInt(elem.dataset.pos);
    const counters = counter.querySelectorAll('.counter-value');
    counters.forEach((c, i) => {
      if (i === pos) {
        c.classList.remove('hidden');
        c.classList.add('active');
      } else {
        c.classList.remove('active');
        c.classList.add('hidden');
      }
    });
  }
};

const pagination = (elem) => {
  const dots = elem.querySelectorAll('.pagination-wrap ul li');
  const pos = parseInt(elem.dataset.pos);

  dots.forEach((dot, index) => {
    if (index === pos) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
};

// Start gallery initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', galleries);
} else {
  galleries();
}
