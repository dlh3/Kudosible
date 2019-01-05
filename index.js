const KUDOSIBLE_ID = 'kudosible';
const KUDOSIBLE_COUNT_ID = 'kudosibleCount';

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
    <span id="${KUDOSIBLE_COUNT_ID}"></span> kudosible activities
    <br />(N)ext (K)udos (S)kip
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

  // add event listeners
  kudosibleBox.addEventListener('click', focusNext);
  document.addEventListener('keypress', handleKeypress);

  // focus on the first kudosible activity
  // also refreshes the kudos box
  focusNext();
}

// keypress event handler
function handleKeypress(event) {
  // ignore keypresses in an input field
  if (INPUT_TAG_NAMES.includes(event.target.tagName.toLowerCase())) {
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
    default:
      break;
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

// clear prior card highlight
function clearCardHighlight(clearIt) {
  clearIt && clearIt.closest(FEED_ENTRY_SELECTOR).classList.remove(KUDOS_HIGHLIGHT_CLASS);
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

    it.scrollIntoView(false);
    it.closest(FEED_ENTRY_SELECTOR).classList.add(KUDOS_HIGHLIGHT_CLASS);
  }
}

// update the kudosible box
function updateKudosBox(numBtns) {
  const countField = document.getElementById(KUDOSIBLE_COUNT_ID);
  countField.innerHTML = numBtns;

  if (numBtns) {
    kudosibleBox.classList.remove(HIDDEN_CLASS);
  } else {
    kudosibleBox.classList.add(HIDDEN_CLASS);
  }
}


// HIT IT!
init();