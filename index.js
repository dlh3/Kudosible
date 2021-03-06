const KUDOSIBLE_ID = 'kudosible';
const KUDOSIBLE_COUNT_ID = 'kudosibleCount';
const KUDOSIBLE_COUNT_SUFFIX_ID = 'kudosibleCountSuffix';

const HIDDEN_CLASS = 'hidden';
const KUDOSIBLE_SKIP_CLASS = 'kudosible-skip';
const KUDOS_HIGHLIGHT_CLASS = 'kudosible-highlight';

const INPUT_TAG_NAMES = ['input', 'textarea', 'select', 'option'];

const FEED_ENTRY_SELECTOR = '.feed-entry';
const KUDOSIBLE_ACTIVITIES_SELECTOR = `
  .activity button.js-add-kudo:not(.${KUDOSIBLE_SKIP_CLASS}), 
  .group-activity button.js-add-kudo:not(.${KUDOSIBLE_SKIP_CLASS})`;

const STYLE_INNER_HTML = `
  #${KUDOSIBLE_ID} {
    display: flex;
    flex-direction: column;
    right: 5px;
    font-size: 20px;
    box-shadow: 0 2px 1px rgba(0,0,0,0.2);
    z-index: 49;
    position: fixed;
    top: 61px
  }

  #${KUDOSIBLE_ID} div {
      margin: 0 auto
  }

  #${KUDOSIBLE_ID} a {
      margin: 0 3px;
      font-weight: bold;
      color: #bef;
  }

  #${KUDOSIBLE_ID}.${HIDDEN_CLASS} {
      display: none !important;
      visibility: hidden !important
  }

  #${KUDOSIBLE_COUNT_ID} {
      margin: 0 3px;
      font-weight: bold
  }

  .${KUDOS_HIGHLIGHT_CLASS} {
      border: red dashed 1em !important;
  }`;
const BUTTON_INNER_HTML = `
  <div>
    <span id="${KUDOSIBLE_COUNT_ID}"></span> Kudosible <span id="${KUDOSIBLE_COUNT_SUFFIX_ID}"></span> 
    <a href="#next" onclick="triggerKeypress('N')">(N)ext</a> 
    <a href="#kudos" onclick="triggerKeypress('K')">(K)udos</a> 
    <a href="#skip" onclick="triggerKeypress('S')">(S)kip</a> 
  </div>`;

let kudosibleBox;
let i = 0;
let it;

function init() {
  // add styles
  const styles = document.createElement('style');
  styles.innerHTML = STYLE_INNER_HTML;
  document.head.prepend(styles);

  // add kudos box
  kudosibleBox = document.createElement('button');
  kudosibleBox.id = KUDOSIBLE_ID;
  kudosibleBox.innerHTML = BUTTON_INNER_HTML;
  kudosibleBox.className = 'btn btn-sm btn-primary ' + HIDDEN_CLASS;
  document.body.prepend(kudosibleBox);

  // add event listeners and refresh timer
  document.addEventListener('keypress', handleKeypress);
  setInterval(updateKudosBox, 500);
}

// simulate keypress
function triggerKeypress(letter) {
  const keyboardEvent = new KeyboardEvent('keypress', { key: letter });
  document.dispatchEvent(keyboardEvent);
  return false;
}

// keypress event handler
function handleKeypress(event) {
  // ignore keypresses in an input field
  if (event.target.tagName && INPUT_TAG_NAMES.includes(event.target.tagName.toLowerCase())) {
      return;
  }

  // break statements missing by design
  // higher cases should execute all actions below them
  // (kudos action should kudos, skip, and focusNext)
  switch (event.key) {
    case 'K':
    case 'k':
      kudos(it);
    case 'S':
    case 's':
      skip(it);
    case 'N':
    case 'n':
      focusNext();
  }
}

// click the current kudos button
function kudos(kudosIt) {
  kudosIt && kudosIt.click();
}

// mark the current kudos button to be ignored
function skip(skipIt) {
  if (skipIt) {
    skipIt.classList.add(KUDOSIBLE_SKIP_CLASS);
    --i;
  }
}

// scroll the next kudos button into view
function focusNext() {
  clearCardHighlight(it);

  const kudosBtns = document.querySelectorAll(KUDOSIBLE_ACTIVITIES_SELECTOR);
  if (kudosBtns) {
    updateKudosBox(kudosBtns.length);

    it = kudosBtns[i++];
    if (!it) {
      i = 0;
      return;
    }

    const feedEntry = it.closest(FEED_ENTRY_SELECTOR);
    feedEntry.classList.add(KUDOS_HIGHLIGHT_CLASS);
    scrollIntoView(feedEntry);
  }
}

// clear prior card highlight
function clearCardHighlight(clearIt) {
  clearIt && clearIt.closest(FEED_ENTRY_SELECTOR).classList.remove(KUDOS_HIGHLIGHT_CLASS);
}

// update the kudosible box, accept numBtns if passed, otherwise, query to find it
function updateKudosBox(numBtns = document.querySelectorAll(KUDOSIBLE_ACTIVITIES_SELECTOR).length) {
  const countField = document.getElementById(KUDOSIBLE_COUNT_ID);
  countField.innerHTML = numBtns;

  const countSuffixField = document.getElementById(KUDOSIBLE_COUNT_SUFFIX_ID);
  countSuffixField.innerText = numBtns === 1 ? 'activity' : 'activities';

  if (numBtns) {
    kudosibleBox.classList.remove(HIDDEN_CLASS);
  } else {
    kudosibleBox.classList.add(HIDDEN_CLASS);
  }
}

function scrollIntoView(feedEntry) {
  if (feedEntry.classList.contains('card')) {
    // the dashboard (with card view) must account for fixed header bar
    window.scrollTo(0, feedEntry.offsetTop);
  } else {
    // but this works for club/athlete feeds
    feedEntry.scrollIntoView(true);
  }
}


// HIT IT!
init();
