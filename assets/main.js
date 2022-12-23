const addForm = document.querySelector('#addClipboards'); // Form for adding clipboard
// Form and button for editing clipboard 
const editButton = document.querySelectorAll('.edit-menu');
const editForm = document.querySelector('#editClipboards');
const deleteButton = document.querySelectorAll('.delete-clipboards'); // Button for deleting clipboard
const reset = document.querySelector('.reset-clipboards');
const appCanvas = document.querySelector('.app-main'); // Main app widget
const clipboards = JSON.parse(localStorage.getItem('clipboards')) || []; // Loading the clipboard from browser's localstorage
let clipboardIndex; // For Selection
const selections = []; // NEXT For multiselection

function addingClipboards(e) {
    e.preventDefault();
    const title = (this.querySelector('[name=title]')).value;
    const content = (this.querySelector('[name=content]')).value;
    const clipboard = {
        title: title,
        content: content,
        lastEdited: lastEdited(),
    }
    clipboards.push(clipboard);
    localStorage.setItem('clipboards', JSON.stringify(clipboards));
    createView(clipboards, appCanvas);
    this.reset();
}

function createView(clipboards = [], contentList) {
    const reversedClipboards = clipboards.reverse()
    contentList.innerHTML = reversedClipboards.map((content, i) => {
        return `
        <div class="clipboard-component" data-index=${i} id="clipboard-${i}">
            <h4>${content.title}</h4>
            <p>${content.content}</p>
            <span>Last Edited on ${content.lastEdited}</span>
        </div>`;
    }).join('');
}

function editClipboards() {
    const titleToEdit = clipboards[clipboardIndex].title || '';
    const contentToEdit = clipboards[clipboardIndex].content || '';
    document.querySelector('[name=title-edit]').value = titleToEdit;
    document.querySelector('[name=content-edit]').value = contentToEdit;
}

function editingClipboards(e) {
    const newTitle = (this.querySelector('[name=title-edit]')).value;
    const newContent = (this.querySelector('[name=content-edit]')).value;
    clipboards[clipboardIndex].title = newTitle;
    clipboards[clipboardIndex].content = newContent;
    clipboards[clipboardIndex].lastEdited = lastEdited();
    localStorage.setItem('clipboards', JSON.stringify(clipboards));
    createView(clipboards, appCanvas);
    this.reset();
}

function lastEdited() {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const timeNow = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`
        .toString();

    return timeNow
}

function clipboardSelection(e) {
    const allClipboards = document.querySelectorAll('.clipboard-component');
    if (!e.target.matches('.clipboard-component')) {
        allClipboards.forEach(clipboard => clipboard.classList.remove('selected'));
        addForm.reset();
        editForm.reset();
        while (selections.length) {
            selections.pop();
        }
        console.log(selections);
        return;
    };
    const clipboardChild = e.target;
    clipboardIndex = clipboardChild.dataset.index;
    // if (e.ctrlKey && e.target.matches('.clipboard-component')) {
    //     selections.push(clipboardIndex);
    //     clipboardChild.classList.add('selected');
    //     console.log(selections);

    // } else {
    //     allClipboards.forEach(clipboard => clipboard.classList.remove('selected'));
    //     clipboardIndex = clipboardChild.dataset.index;
    //     clipboardChild.classList.add('selected');
    //     console.log(e.target);
    // }
    allClipboards.forEach(clipboard => clipboard.classList.remove('selected'));
    clipboardIndex = clipboardChild.dataset.index;
    clipboardChild.classList.add('selected');
    console.log(e.target);
}

function clipboardRemoval(e) {
    e.preventDefault()
    const confirmDialog = confirm("Are you sure want to delete this clipboard?");
    if (confirmDialog) {
        // BUG Multiselection : Wrong index number deleted, find better algorithm
        if (selections.length != 0) {
            for (let i = 0; i < (selections.length); i++) {
                clipboards.splice(selections[i], 1);
            };
            while (selections.length) {
                selections.pop();
            }
        } else {
            clipboards.splice(clipboardIndex, 1);
        };
        localStorage.setItem('clipboards', JSON.stringify(clipboards));
    } else {
        return;
    }
    createView(clipboards, appCanvas);
    addForm.reset();
    clipboardIndex = NaN;
    console.log(clipboardIndex);
}

function resetApp(e) {
    const confirmReset = confirm("WARNING! All your Clipboards will be deleted, do you wish to continue?");
    if (confirmReset) {
        localStorage.removeItem('clipboards');
        while (clipboards.length) {
            clipboards.pop();
        };
        createView(clipboards, appCanvas);
    } else return;
}

// For testing a return what key is pressed on keyboard
function multiSelection(e) {
    if (e.ctrlKey) {
        console.log('Control is Pressed')
    } else {
        console.log(e.keyCode);
    }
}

appCanvas.addEventListener('click', clipboardSelection);
addForm.addEventListener('submit', addingClipboards);
editForm.addEventListener('submit', editingClipboards);
reset.addEventListener('click', resetApp);
editButton.forEach(button => button.addEventListener('click', () => {
    try {
        editClipboards();
    } catch (TypeError) {
        return
    }
}));
deleteButton.forEach(button => button.addEventListener('click', clipboardRemoval));

createView(clipboards, appCanvas);