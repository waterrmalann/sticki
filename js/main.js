"use strict";

console.log("_       __     __                    __");
console.log("| |     / /__  / /_  ____  ____ _____/ /");
console.log("| | /| / / _ \/ __ \/ __ \/ __ `/ __  / ");
console.log("| |/ |/ /  __/ /_/ / /_/ / /_/ / /_/ /  ");
console.log("|__/|__/\___/_.___/ .___/\__,_/\__,_/   ");
console.log("                 /_/                    ");

const e_notesContainer = document.getElementById('notesContainer');
const e_addNote = document.getElementById('addNote');

var appData = {
    'identifier': 0,
    'notes': []
};

function uniqueID() {
    appData.identifier += 1;
    return 'n' + appData.identifier;
}

function randomPastelColor() {
    var _hue = Math.floor(Math.random() * 360);
    let _pastel = `hsl(${_hue}, 100%, 80%)`;
    return _pastel;
}

function loadData() {
    let _data = localStorage.getItem("webpad-appData");
    if (_data) {
        appData = JSON.parse(_data);
    }
}

function saveData() {
    localStorage.setItem("webpad-appData", JSON.stringify(appData));
}

function createNote(id, content, toDatabase = true) {
    const _noteElement = document.createElement("textarea");
    _noteElement.classList.add("note");
    _noteElement.value = content;
    _noteElement.placeholder = "Take a note...";
    _noteElement.id = id;
    _noteElement.maxLength = 192;
    _noteElement.style.backgroundColor = randomPastelColor();

    _noteElement.addEventListener("change", () => {
        updateNote(id, _noteElement.value);
    });
    _noteElement.addEventListener("dblclick", () => {
        const _confirmation = confirm("Are you sure you wish to delete this note?");
        if (_confirmation) {
            deleteNoteByElement(_noteElement);
        }
    });
    e_notesContainer.insertBefore(_noteElement, e_addNote);

    if (toDatabase) {
        const _noteObject = {
            'id': id,
            'content': content
        }
        appData.notes.push(_noteObject);
    }

    saveData();
}

function deleteNoteByElement(element) {
    appData.notes.splice(appData.notes.findIndex(e => e.id === element.id), 1);
    e_notesContainer.removeChild(element);

    saveData();
}

function updateNote(id, content) {
    let _target = appData.notes.find(_note => _note.id === id);
    _target.content = content;

    saveData();
}

loadData();
appData.notes.forEach((_note) => {
    createNote(_note.id, _note.content, false);
});

e_addNote.addEventListener("click", () => createNote(uniqueID(), ""));


