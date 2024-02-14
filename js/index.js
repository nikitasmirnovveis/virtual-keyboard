import {allKeys} from "./declarations.js";

// DECLARATIONS
let cursorPosition = 0;

const body = document.querySelector('body');
    const header = document.createElement('header');
            const header_container = document.createElement('div');
                const header_content = document.createElement('div');
                    const header_title = document.createElement('h1');  
                    // ('Logitech MX Keys Mini - virtual keyboard')          
    const main = document.createElement('main');
        const textarea = document.createElement('textarea');
        const kbd_container = document.createElement('div');
            const kbd_content = document.createElement('div');


body.appendChild(header).classList.add('header');
    header.appendChild(header_container).classList.add('header-container');
        header_container.appendChild(header_content).classList.add('header-content');
            header_content.appendChild(header_title).classList.add('header_title');
                header_title.textContent = 'Logitech MX Keys Mini - virtual keyboard';

        
    body.appendChild(main).classList.add('main');
        main.appendChild(textarea).classList.add('textarea');
                            textarea.id=('textarea');
                            
    main.appendChild(kbd_container).classList.add('kbd-container');
        kbd_container.appendChild(kbd_content).classList.add('kbd-content');
        


//keep textarea saved after reload
textarea.addEventListener('input', () => {
    localStorage.setItem('savedTextarea', textarea.value); // Save the textarea value to localStorage
});
const savedValue = localStorage.getItem('savedTextarea'); // Check if a value is stored in localStorage
if (savedValue) {textarea.value = savedValue;} // Set the textarea value to the saved value (if it exists)





// Create rows for each row in allKeys
for (let rowName in allKeys) {
    const row = document.createElement('div');
    row.classList.add('row');

    // Create keys for each event code in the row
    for (let eventCode in allKeys[rowName]) {
        const key = document.createElement('div');
        key.classList.add('key');
        key.classList.add(`${eventCode}`);

        // Create language (e.g., eng, rus) divs for each key
        for (let language in allKeys[rowName][eventCode]) {
            const langDiv = document.createElement('div');
            langDiv.classList.add(language);

            // Create case (e.g., caseDown, caseUp, caps, shiftCaps) divs for each language
            for (let caseType in allKeys[rowName][eventCode][language]) {
                const caseDiv = document.createElement('div');
                caseDiv.classList.add(caseType);
                caseDiv.textContent = allKeys[rowName][eventCode][language][caseType];

                // Add the .hidden class to hide elements by default
                if (caseType !== 'caseDown') {
                    caseDiv.classList.add('hidden');
                }

                // Add a click event listener to each key
                caseDiv.addEventListener('click', () => {

                    if ([
                        'Escape', 'AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
                        'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight', 'Insert', 'Delete', 'Enter',
                        'ShiftLeft', 'ShiftRight', 'Fn', 'Start', 'MetaLeft', 'Tab', 'Space', 
                        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
                    ].includes(eventCode)){
                        // kbd_content.querySelector('.Tab').addEventListener('click', () => {
                        //     textarea.value += ' '.repeat(4);//'\u00A0\u00A0\u00A0\u00A0';
                        //     textarea.dispatchEvent(new Event('input'));
                        // })
                    }else{
                        insertSpecialKey(caseDiv.textContent);
                    }
                
                });
                
                langDiv.appendChild(caseDiv);
            }

            // If language is 'rus', add the .hidden class to all children elements
            if (language === 'rus') {
                langDiv.classList.add('hidden');
                // Array.from(langDiv.children).forEach(child => {
                //     child.classList.add('hidden');
                // });
            }
            key.appendChild(langDiv);
        }
        row.appendChild(key);
    }
    kbd_content.appendChild(row);
}


//SPECIAL KEYS virtual
kbd_content.querySelector('.Tab').addEventListener('click', () => {
    insertSpecialKey(' '.repeat(4));
})
kbd_content.querySelector('.Space').addEventListener('click', () => {
    insertSpecialKey(' ');
})

kbd_content.querySelector('.Backspace').addEventListener('click', () => {
    const cursorStart = textarea.selectionStart;
    const cursorEnd = textarea.selectionEnd;
    const currentValue = textarea.value;

    if (cursorStart === cursorEnd && cursorStart > 0) {
        // If there's no selection and the cursor is not at the beginning
        const newValue =
            currentValue.substring(0, cursorStart - 1) +
            currentValue.substring(cursorEnd);

        textarea.value = newValue;
        textarea.selectionStart = cursorStart - 1; // Move the cursor one position back
        textarea.selectionEnd = cursorStart - 1;
        textarea.focus();
    } else if (cursorStart !== cursorEnd) {
        // If there's a selection, delete the selected text
        const newValue =
            currentValue.substring(0, cursorStart) +
            currentValue.substring(cursorEnd);

        textarea.value = newValue;
        textarea.selectionStart = cursorStart; // Set the cursor to the start of the selection
        textarea.selectionEnd = cursorStart;
        textarea.focus();
    }
    textarea.dispatchEvent(new Event('input'));
})

kbd_content.querySelector('.Delete').addEventListener('click', () => {
    const cursorStart = textarea.selectionStart;
    const cursorEnd = textarea.selectionEnd;
    const currentValue = textarea.value;

    if (cursorStart === cursorEnd && cursorEnd < currentValue.length) {
        // If there's no selection and the cursor is not at the end
        const newValue =
            currentValue.substring(0, cursorStart) +
            currentValue.substring(cursorEnd + 1);

        textarea.value = newValue;
        textarea.selectionStart = cursorStart; // Keep the cursor at the same position
        textarea.selectionEnd = cursorStart;
        textarea.focus();
    } else if (cursorStart !== cursorEnd) {
        // If there's a selection, delete the selected text
        const newValue =
            currentValue.substring(0, cursorStart) +
            currentValue.substring(cursorEnd);

        textarea.value = newValue;
        textarea.selectionStart = cursorStart; // Set the cursor to the start of the selection
        textarea.selectionEnd = cursorStart;
        textarea.focus();
    }
    textarea.dispatchEvent(new Event('input'));
})

kbd_content.querySelector('.ArrowUp').addEventListener('click', () => {
    moveCursorUp();
})
kbd_content.querySelector('.ArrowLeft').addEventListener('click', () => {
    moveCursorLeft();
})
kbd_content.querySelector('.ArrowDown').addEventListener('click', () => {
    moveCursorDown();
})
kbd_content.querySelector('.ArrowRight').addEventListener('click', () => {
    moveCursorRight();
})


kbd_content.querySelector('.Enter').addEventListener('click', () => {
    insertSpecialKey('\n');
})




//CHANGE LANGUAGE
document.addEventListener('keydown', (event) => {
    // Check if the Shift and Alt keys are pressed
    if (event.shiftKey && event.altKey) {
        // Toggle the visibility of .eng and .rus keys
        const engKeys = document.querySelectorAll('.eng');
        const rusKeys = document.querySelectorAll('.rus');
        // Toggle the .hidden class for .eng keys
        engKeys.forEach((key) => {
            key.classList.toggle('hidden');
        });
        // Toggle the .hidden class for .rus keys
        rusKeys.forEach((key) => {
            key.classList.toggle('hidden');
        });
    }
});


let shiftKeyHeld = false;
let capsLockActive = false;

// SHIFT
function toggleShift() {
    kbd_content.querySelector('.ShiftLeft').classList.toggle('active');
    kbd_content.querySelector('.ShiftRight').classList.toggle('active');
    const elements = document.querySelectorAll('.caseDown, .caseUp');    
    elements.forEach(element => {
        if(!shiftKeyHeld){    
            shiftKeyHeld=true;
            element.classList.toggle('hidden');
        } else {
            shiftKeyHeld=false
            element.classList.toggle('hidden');
        }

    });
}
kbd_content.querySelector('.ShiftLeft').addEventListener('mousedown', () => {
    toggleShift();
})
kbd_content.querySelector('.ShiftRight').addEventListener('mousedown', () => {
    toggleShift();
})
kbd_content.querySelector('.ShiftLeft').addEventListener('mouseup', () => {
    toggleShift();
})
kbd_content.querySelector('.ShiftRight').addEventListener('mouseup', () => {
    toggleShift();
})

// CAPS
function toggleCaps() {
    kbd_content.querySelector('.CapsLock').classList.toggle('active');
    const elements = document.querySelectorAll('.caseDown, .caps');    
    elements.forEach(element => {
        if(!capsLockActive){    
            capsLockActive=true;
            // kbd_content.querySelector('.CapsLock').classList.add('active');
            element.classList.toggle('hidden');
        } else {
            capsLockActive=false
            // kbd_content.querySelector('.CapsLock').classList.remove('active');
            element.classList.toggle('hidden');
        }
    });
} 
kbd_content.querySelector('.CapsLock').addEventListener('click', () => {
    
        toggleCaps(); 
    
});






// //CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT//CAPSSHIFT
// function toggleCapsShift() {
//     // kbd_content.querySelector('.CapsLock').classList.toggle('active');
//     const elements = document.querySelectorAll('.caseDown, .caseUp, .caps, .shiftCaps');    
//     elements.forEach(caseDiv => {
//             caseDiv.classList.toggle('hidden');
//     });
// } 
// // kbd_content.querySelector('.CapsLock').addEventListener('click', () => {
// //     toggleCapsShift(); 
// // });

// document.addEventListener('keydown', (event) => {
//     while (shiftKeyHeld && capsLockActive) {
//         toggleCapsShift();
//     }
// });




                    
kbd_content.firstElementChild.classList.add('row1');
        //making arrows the precise visual way
        let row6 = kbd_content.lastElementChild;
        let row6keys = row6.querySelectorAll('.key');
        let startIndex = row6keys.length-4;
        let arrows = document.createElement('div');
        arrows.classList.add('arrows');
        for (let i = startIndex; i < row6keys.length; i++) {
            arrows.appendChild(row6keys[i]);
        }
        row6.appendChild(arrows);

        const footer = document.createElement('footer');
        const footer_container = document.createElement('div');
            const footer_content = document.createElement('div');
        body.appendChild(footer);





//REAL KEYBOARD
//REAL KEYBOARD
//REAL KEYBOARD
document.addEventListener('keydown', (event) => {
    // event.preventDefault();
    if ([
        'AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
        'Backspace', 'CapsLock', 'ControlLeft', 'ControlRight', 'Insert', 'Delete', 'Enter',
        'ShiftLeft', 'ShiftRight', 'Fn', 'Start', 'MetaLeft', 'Tab', 'Space',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 
        'Control', 'Shift', 'Escape'
    ].includes(event.code)){
        kbd_content.querySelector('.'+event.code).classList.toggle('active');

        // if (event.key ==='Space'){
        //     textarea.value += ' ';//'\u00A0';
        //     textarea.dispatchEvent(new Event('input'));
        // }
        if (event.key === 'Tab' ){
            event.preventDefault();
            insertSpecialKey(' '.repeat(4));
        }
        // if (event.key === 'Backspace' ){
        //     textarea.value = textarea.value.slice(0, -1);
        // }
        // if (event.key === 'Delete' ){
        //     textarea.value = textarea.value.slice(0, -1);
        // }
        if (event.key === 'CapsLock' ){
            if (!event.repeat) {
                // kbd_content.querySelector('.CapsLock').classList.toggle('active');
                toggleCaps();
            }
        }
        if (event.key === 'Shift' ){
            if (!event.repeat) {
                // console.log('real shift');
                toggleShift();
            }
        }
        if (event.key === 'Enter'){
            event.preventDefault();
            insertSpecialKey('\n');
        }
    } else {
        event.preventDefault();
        insertSpecialKey(event.key);
        document.querySelector('.'+event.code).classList.toggle('active');
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Shift'){
        toggleShift();
    } else if(event.key === 'CapsLock') {

    } else {
        kbd_content.querySelector('.'+event.code).classList.remove('active');
    }
})







function moveCursorLeft() {
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition > 0) {
        textarea.selectionStart = cursorPosition - 1;
        textarea.selectionEnd = cursorPosition - 1;
        textarea.focus();
    }
}

function moveCursorRight() {
    const cursorPosition = textarea.selectionStart;
    const textLength = textarea.value.length;
    if (cursorPosition < textLength) {
        textarea.selectionStart = cursorPosition + 1;
        textarea.selectionEnd = cursorPosition + 1;
        textarea.focus();
    }
}

// Function to move the cursor up by one line (assuming a textarea with line breaks)
function moveCursorUp() {
    // Calculate the new cursor position
    const cursorPosition = textarea.selectionStart;
    const textValue = textarea.value;
    const lines = textValue.split('\n');
    const currentLineIndex = textValue.substr(0, cursorPosition).split('\n').length - 1;

    if (currentLineIndex > 0) {
        const currentLine = lines[currentLineIndex];
        const previousLine = lines[currentLineIndex - 1];
        const currentLinePosition = cursorPosition - currentLine.length - 1; // -1 for the newline character
        const newPosition = currentLinePosition - previousLine.length - 1; // -1 for the newline character

        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
        textarea.focus();
    }
    // const event = new KeyboardEvent('keydown', { key:'ArrowUp' });
    // textarea.dispatchEvent(event);//textarea.dispatchEvent(new Event('input'));
    // textarea.focus();
}

// Function to move the cursor down by one line (assuming a textarea with line breaks)
function moveCursorDown() {
    // Calculate the new cursor position
    const cursorPosition = textarea.selectionStart;
    const textValue = textarea.value;
    const lines = textValue.split('\n');
    const currentLineIndex = textValue.substring(0, cursorPosition).split('\n').length - 1;

    if (currentLineIndex < lines.length - 1) {
        const currentLine = lines[currentLineIndex];
        const nextLine = lines[currentLineIndex + 1];
        const currentLinePosition = cursorPosition - currentLine.length - 1; // -1 for the newline character
        const newPosition = currentLinePosition + nextLine.length + 1; // +1 for the newline character

        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
        textarea.focus();
    }
    // const event = new KeyboardEvent('keydown', { key:'ArrowDown',
    // code: 'ArrowDown',
    // keyCode: 40, });
    // document.dispatchEvent(event);//textarea.dispatchEvent(new Event('input'));
    // const arrowDownKeyPress = new KeyboardEvent('keydown', {
    //     key: 'ArrowDown',
    //     code: 'ArrowDown',
    //     keyCode: 40,
    //     which: 40,
    //     charCode: 0,
    //     bubbles: true,
    //     cancelable: true,
    //   });
      
    //   textarea.dispatchEvent(arrowDownKeyPress);
    // textarea.focus();
}

function insertSpecialKey(key){
    // event.preventDefault();
    const cursorStart = textarea.selectionStart;
    const cursorEnd = textarea.selectionEnd;
    const currentValue = textarea.value;
    const specialKey = key 
    // Calculate the new value with spaces inserted at the cursor position
    const newValue =
        currentValue.substring(0, cursorStart) +
        specialKey +
        currentValue.substring(cursorEnd);

    textarea.value = newValue;
    textarea.selectionStart = cursorStart + specialKey.length; // Move the cursor forward
    textarea.selectionEnd = cursorStart + specialKey.length;
    textarea.focus();

    textarea.dispatchEvent(new Event('input'));
}