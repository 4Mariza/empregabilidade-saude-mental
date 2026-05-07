// Load content from JSON file
fetch('new-page-content.json')
  .then(res => res.json())
  .then(data => {
    renderCarousel(data.carousel);
    renderMythsTruths(data.mythsTruths);
    renderQA(data.qa);
  });

// Carousel
let carouselIndex = 0;
function renderCarousel(tips) {
  const carousel = document.querySelector('.carousel');
  const dots = document.querySelector('.carousel-dots');
  const left = document.querySelector('.carousel-arrow.left');
  const right = document.querySelector('.carousel-arrow.right');

  function show(index) {
    carousel.innerHTML = `<div class="carousel-card" tabindex="0">${tips[index]}</div>`;
    dots.innerHTML = tips.map((_, i) => `<button class="carousel-dot${i===index?' active':''}" aria-label="Ir para dica ${i+1}"></button>`).join('');
  }
  show(carouselIndex);

  left.onclick = () => { carouselIndex = (carouselIndex-1+tips.length)%tips.length; show(carouselIndex); };
  right.onclick = () => { carouselIndex = (carouselIndex+1)%tips.length; show(carouselIndex); };
  dots.onclick = e => {
    if(e.target.classList.contains('carousel-dot')) {
      carouselIndex = [...dots.children].indexOf(e.target);
      show(carouselIndex);
    }
  };
  carousel.onkeydown = e => {
    if(e.key==='ArrowLeft') left.onclick();
    if(e.key==='ArrowRight') right.onclick();
  };
}

// Myths/Truths
function renderMythsTruths(pairs) {
  const grid = document.querySelector('.myths-truths-grid');
  grid.innerHTML = pairs.map((pair, i) => `
    <div class="myth-truth-card" tabindex="0" aria-label="${pair.statement}" data-type="${pair.type.toLowerCase()}">
      <div class="card-inner">
        <div class="card-front">${pair.statement}</div>
        <div class="card-back ${pair.type.toLowerCase()}">${pair.type}</div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.myth-truth-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if(e.key==='Enter'||e.key===' ') { e.preventDefault(); card.classList.toggle('flipped'); }
    });
  });
}

// Q&A Accordion
function renderQA(qa) {
  const acc = document.querySelector('.qa-accordion');
  acc.innerHTML = qa.map((item, i) => `
    <div class="qa-card${i===0?' open':''}">
      <button class="qa-question" aria-expanded="${i===0?'true':'false'}" aria-controls="qa-answer-${i}" id="qa-question-${i}">
        ${item.question}
        <span aria-hidden="true">${i===0?'▼':'▶'}</span>
      </button>
      <div class="qa-answer" id="qa-answer-${i}" aria-labelledby="qa-question-${i}" aria-hidden="${i===0?'false':'true'}">
        ${item.answer.replace(/\n/g,'<br>')}
      </div>
    </div>
  `).join('');
  acc.querySelectorAll('.qa-question').forEach((btn, idx, btns) => {
    btn.addEventListener('click', () => toggleQA(idx));
    btn.addEventListener('keydown', e => {
      if(e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleQA(idx); }
      if(e.key==='Escape') closeAll();
    });
  });
  function toggleQA(idx) {
    acc.querySelectorAll('.qa-card').forEach((card, i) => {
      const open = i===idx && !card.classList.contains('open');
      card.classList.toggle('open', open);
      card.querySelector('.qa-question').setAttribute('aria-expanded', open);
      card.querySelector('.qa-answer').setAttribute('aria-hidden', !open);
      card.querySelector('.qa-question span').textContent = open ? '▼' : '▶';
    });
  }
  function closeAll() {
    acc.querySelectorAll('.qa-card').forEach(card => {
      card.classList.remove('open');
      card.querySelector('.qa-question').setAttribute('aria-expanded', false);
      card.querySelector('.qa-answer').setAttribute('aria-hidden', true);
      card.querySelector('.qa-question span').textContent = '▶';
    });
  }
}
