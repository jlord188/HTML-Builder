const socket = io();



// Intercept Enter keypress event inside contenteditable <p> elements
document.addEventListener('keydown', function(event) {
    const activeElement = document.activeElement;
    if (event.key === 'Enter' && activeElement.tagName.toLowerCase() === 'p' && activeElement.isContentEditable) {
        // Prevent default behavior of Enter keypress (creating a new block-level element)
        event.preventDefault();

        // Insert a line break (<br>) at the current caret position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});



function toggleCustomUrlInput() {
    const backgroundSelect = document.getElementById('background-select');
    const colourBackgroundSelect = document.getElementById('colour-background-select');
    const customUrlInput = document.getElementById('custom-url');
    const customUrlColourInput = document.getElementById('custom-url-colour');
    
    if (backgroundSelect.value === 'other') {
        customUrlInput.style.display = 'block';
    } else {
        customUrlInput.style.display = 'none';
    }

    if (colourBackgroundSelect.value === 'other') {
        customUrlColourInput.style.display = 'block';
    } else {
        customUrlColourInput.style.display = 'none';
    }
}

function addComponent() {
    let backgroundUrl = document.getElementById('background-select').value;
    if (backgroundUrl === 'other') {
        backgroundUrl = document.getElementById('custom-url').value;
    }
    const textalignment = document.getElementById('Text-alignment').value;
    const h2Text = document.getElementById('h1-text').value;
    const pText = document.getElementById('p-text').value;
    socket.emit('add component', { type: 'Header', backgroundUrl, textalignment, h2Text, pText });
}

function addColourComponent() {
    let backgroundUrl = document.getElementById('colour-background-select').value;
    if (backgroundUrl === 'other') {
        backgroundUrl = document.getElementById('custom-url-colour').value;
    }
    const textalignment = document.getElementById('Text-alignment-colour').value;
    const h2Text = document.getElementById('colour-h2-text').value;
    const pText = document.getElementById('colour-p-text').value;
    socket.emit('add component', { type: 'Colour', backgroundUrl, textalignment, h2Text, pText });
}

function addFooterComponent() {
    const textalignment = document.getElementById('Text-alignment-footer').value;
    const pText = document.getElementById('footer-p-text').value;
    socket.emit('add component', { type: 'Footer', textalignment, pText });
}

function addThreeColumnComponent() {
    const textalignment = document.getElementById('Text-alignment-col3').value;
    const data = {
        type: 'ThreeColumn',
        textalignment: textalignment,
        columns: []
    };
    for (let i = 1; i <= 3; i++) {
        let colData = {
            h2Text: document.getElementById(`h2-text-col${i}-3col`).value,
            pText: document.getElementById(`p-text-col${i}-3col`).value,
            imgUrl: document.getElementById(`img-url-col${i}-3col`).value,
            imgStyle: document.getElementById(`img-style-col${i}-3col`).value,
            buttonUrl: document.getElementById(`button-url-col${i}-3col`).value,
            buttonText: document.getElementById(`button-text-col${i}-3col`).value
        };
        console.log(`Column ${i} Data: `, colData); // Log each column's data
        data.columns.push(colData);
    }
    console.log('Final data to emit:', data, textalignment); // Final data structure before emit
    socket.emit('add component', data, textalignment);
}

function addTwoColumnComponent() {
    const textalignment = document.getElementById('Text-alignment-col2').value;
    const data = {
        type: 'TwoColumn',
        textalignment: textalignment,
        columns: []
    };
    for (let i = 1; i <= 2; i++) {
        console.log(`Checking input for column ${i}`);
        console.log(document.getElementById(`h2-text-col${i}-2col`)); // Check if the element is null
        let colData = {
            h2Text: document.getElementById(`h2-text-col${i}-2col`).value,
            pText: document.getElementById(`p-text-col${i}-2col`).value,
            imgUrl: document.getElementById(`img-url-col${i}-2col`).value,
            imgStyle: document.getElementById(`img-style-col${i}-2col`).value,
            buttonUrl: document.getElementById(`button-url-col${i}-2col`).value,
            buttonText: document.getElementById(`button-text-col${i}-2col`).value
        };
        data.columns.push(colData);
    }
    console.log('Final data to emit:', data, textalignment);
    socket.emit('add component', data, textalignment);
}



function addOneColumnComponent() {
    const textalignment = document.getElementById('Text-alignment-col1').value;
    const data = {
        type: 'OneColumn',
        textalignment: textalignment,
        columns: [{
            h2Text: document.getElementById('h2-text-col1').value,
            pText: document.getElementById('p-text-col1').value,
            imgUrl: document.getElementById('img-url-col1').value,
            imgStyle: document.getElementById('img-style-col1').value,
            buttonUrl: document.getElementById('button-url-col1').value,
            buttonText: document.getElementById('button-text-col1').value
        }]
    };
    socket.emit('add component', data, textalignment);
}




socket.on('component added', (data) => {
    const previewArea = document.getElementById('components-preview');
    let componentHTML = '';
    if (data.type === 'Header') {
        componentHTML = `
            <div id="component-${data.id}" class="component">
                <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                    <tr>
                        <td style="background-image: url('${data.backgroundUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%;">    
                            <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                                <tr>
                                    <td width="100%" style="padding: 40px;">
                                        <h1 contenteditable="true"  style="font-family: Georgia, bold; font-size: 36px; color: #240F6E; text-align: ${data.textalignment};">${data.h2Text}</h1>
                                        <p contenteditable="true" style="font-family: sans-serif; color: #383838; font-size: 16px; line-height: 1.4; text-align: ${data.textalignment}">${data.pText}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                    <div id="components-preview">
                        <!-- Up button -->
                        <div class="up-btn-container">
                            <button onclick="moveComponent('${data.id}', 'up')" class="move-btn up-btn">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                            </button>
                        </div>  
                        <div>
                        <!-- Down button -->
                            <button onclick="moveComponent('${data.id}', 'down')" class="move-btn down-btn">
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
                            </button>
                        <!-- Delete button -->
                            <button onclick="deleteComponent('${data.id}')" class="delete-btn">
                            <i class="fas fa-times-circle"></i>
                            </button>
                            <button onclick="applyBold('${data.id}')" class="bold-btn">
                            <i class="fas fa-bold"></i>
                            </button>
                            <button onclick="applyLink('${data.id}')" class="link-btn">
                            <i class="fas fa-link"></i>
                            </button>
                            <button onclick="applyBullet('${data.id}')" class="bullet-btn">
                            <i class="fas fa-list-ul"></i>
                            </button>
                            <button onclick="setTextAlignment('${data.id}', 'left')"class="left-btn">
                            <i class="fas fa-align-left"></i>
                            </button>
                            <button onclick="setTextAlignment('${data.id}', 'center')"class="center-btn">
                            <i class="fas fa-align-center"></i>
                            </button>
                            <button onclick="setTextAlignment('${data.id}', 'right')"class="right-btn">
                            <i class="fas fa-align-right"></i>
                            </button>
                            <button onclick="changeFont('${data.id}')" class="font-btn">
                            <i class="fas fa-font"></i>
                            </button>
                            <button onclick="changeFontColor('${data.id}')" class="font-color-btn">
                            <i class="fas fa-paint-brush"></i>
                            </button>
                            <button onclick="changeFontSize('${data.id}')" class="font-size-btn">
                            <i class="fas fa-text-height"></i>
                            </button>
                            <button onclick="embedVideo()" class="embed-video-btn">
                            <i class="fas fa-video"></i>
                            </button>
                            <button onclick="embedImage('componentId')" class="embed-image-btn">
                            <i class="fas fa-image"></i>
                            </button>
                    </div>
                    </div>
            </div>


        `;
    } else if (data.type === 'ThreeColumn') {
        let columnsHTML = data.columns.map((col, idx) => {
            const imgHeight = col.imgStyle === 'square' ? '250px' : '134px';
            const imgWidth = col.imgStyle === 'square' ? '250px' : '100%';
            const imageHTML = col.imgUrl ? `
                <div id="image-${data.id}-${idx}" style="position: relative; text-align: center; width: 100%;">
                    <div style="display: inline-block; height: ${imgHeight}; width: ${imgWidth}; background-image: url('${col.imgUrl}'); background-size: cover; background-position: center; border-radius: 10px;">
                        <button onclick="deleteImage('${data.id}', ${idx})" class="delete-btn"">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>
                </div>` : '';

            const buttonHTML = col.buttonUrl ? `
                <div style="text-align: center;">
                    <a href="${col.buttonUrl}" data-button="${idx + 1}" style="font-family: sans-serif, bold; background-color: #ffffff; color: #005DE8; padding: 4px 16px; text-decoration: none; border-radius: 4px; border: 1px solid #005DE8; display: inline-block; margin-top: 10px;">
                        ${col.buttonText}
                    </a>
                </div>` : '';

            return `
                <td width="33%" style="padding: 10px; vertical-align: top;">
                    ${imageHTML}
                    <h2 contenteditable="true" style="font-family: Georgia, bold; font-size: 20px; color: #240F6E; text-align: ${data.textalignment};">${col.h2Text}</h2>
                    <p contenteditable="true" style="font-family: sans-serif; color: #383838; font-size: 16px; line-height: 1.4; text-align: ${data.textalignment};">${col.pText}</p>
                    ${buttonHTML}
                </td>
            `;
        }).join('');

        componentHTML = `
            <div id="component-${data.id}" class="component">
                <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                                <tr>${columnsHTML}</tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div id="components-preview">
                <!-- Up button -->
                <div class="up-btn-container">
                    <button onclick="moveComponent('${data.id}', 'up')" class="move-btn up-btn">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>  
                <div>
                <!-- Down button -->
                    <button onclick="moveComponent('${data.id}', 'down')" class="move-btn down-btn">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                    </button>
                <!-- Delete button -->
                    <button onclick="deleteComponent('${data.id}')" class="delete-btn">
                    <i class="fas fa-times-circle"></i>
                    </button>
                    <button onclick="applyBold('${data.id}')" class="bold-btn">
                    <i class="fas fa-bold"></i>
                    </button>
                    <button onclick="applyLink('${data.id}')" class="link-btn">
                    <i class="fas fa-link"></i>
                    </button>
                    <button onclick="applyBullet('${data.id}')" class="bullet-btn">
                    <i class="fas fa-list-ul"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'left')"class="left-btn">
                    <i class="fas fa-align-left"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'center')"class="center-btn">
                    <i class="fas fa-align-center"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'right')"class="right-btn">
                    <i class="fas fa-align-right"></i>
                    </button>
                    <button onclick="embedVideo()" class="embed-video-btn">
                    <i class="fas fa-video"></i>
                    </button>
                    <button onclick="embedImage('${data.id}')" class="embed-image-btn">
                    <i class="fas fa-image"></i>
                    </button>
            </div>
            </div>
            </div>
        `;
    } else if (data.type === 'TwoColumn') {
        let columnsHTML = data.columns.map((col, idx) => {
            const imgHeight = col.imgStyle === 'square' ? '250px' : '330px';
            const imgWidth = col.imgStyle === 'square' ? '250px' : '100%';
            const imageHTML = col.imgUrl ? `
                <div id="image-${data.id}-${idx}" style="position: relative; text-align: center; width: 100%;">
                    <div style="display: inline-block; height: ${imgHeight}; width: ${imgWidth}; background-image: url('${col.imgUrl}'); background-size: cover; background-position: center; border-radius: 10px;">
                        <button onclick="deleteImage('${data.id}', ${idx})" class="delete-btn"">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>
                </div>` : '';

            const buttonHTML = col.buttonUrl ? `
                <div style="text-align: center;">
                    <a href="${col.buttonUrl}" data-button="${idx + 1}" style="font-family: sans-serif, bold; background-color: #ffffff; color: #005DE8; padding: 4px 16px; text-decoration: none; border-radius: 4px; border: 1px solid #005DE8; display: inline-block; margin-top: 10px;">
                        ${col.buttonText}
                    </a>
                </div>` : '';

            return `
                <td width="50%" style="padding: 10px; vertical-align: top;">
                    ${imageHTML}
                    <h2 contenteditable="true" style="font-family: Georgia, bold; font-size: 20px; color: #240F6E; text-align: ${data.textalignment};">${col.h2Text}</h2>
                    <p contenteditable="true" style="font-family: sans-serif; color: #383838; font-size: 16px; line-height: 1.4; text-align: ${data.textalignment};">${col.pText}</p>
                    ${buttonHTML}
                </td>
            `;
        }).join('');

        componentHTML = `
            <div id="component-${data.id}" class="component">
                <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                                <tr>${columnsHTML}</tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div id="components-preview">
                <!-- Up button -->
                <div class="up-btn-container">
                    <button onclick="moveComponent('${data.id}', 'up')" class="move-btn up-btn">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>  
                <div>
                <!-- Down button -->
                    <button onclick="moveComponent('${data.id}', 'down')" class="move-btn down-btn">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                    </button>
                <!-- Delete button -->
                    <button onclick="deleteComponent('${data.id}')" class="delete-btn">
                    <i class="fas fa-times-circle"></i>
                    </button>
                    <button onclick="applyBold('${data.id}')" class="bold-btn">
                    <i class="fas fa-bold"></i>
                    </button>
                    <button onclick="applyLink('${data.id}')" class="link-btn">
                    <i class="fas fa-link"></i>
                    </button>
                    <button onclick="applyBullet('${data.id}')" class="bullet-btn">
                    <i class="fas fa-list-ul"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'left')"class="left-btn">
                    <i class="fas fa-align-left"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'center')"class="center-btn">
                    <i class="fas fa-align-center"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'right')"class="right-btn">
                    <i class="fas fa-align-right"></i>
                    </button>
                    <button onclick="embedVideo()" class="embed-video-btn">
                    <i class="fas fa-video"></i>
                    </button>
                    <button onclick="embedImage('componentId')" class="embed-image-btn">
                    <i class="fas fa-image"></i>
                    </button>
            </div>
            </div>
            </div>
        `;
    } else if (data.type === 'OneColumn') {
            const col = data.columns[0]; // Since it's one column, directly access the first index
            const imgHeight = col.imgStyle === 'square' ? '250px' : '330px';
            const imgWidth = col.imgStyle === 'square' ? '250px' : '100%';
            const imageHTML = col.imgUrl ? `
                <div id="image-${data.id}-0" style="position: relative; text-align: center; width: 100%;">
                    <div style="display: inline-block; height: ${imgHeight}; width: ${imgWidth}; background-image: url('${col.imgUrl}'); background-size: cover; background-position: center; border-radius: 10px;">
                        <button onclick="deleteImage('${data.id}', 0)" class="delete-btn">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>
                </div>` : '';
            const buttonHTML = col.buttonUrl ? `<div style="text-align: center;">
                <a href="${col.buttonUrl}" data-button="1" style="font-family: sans-serif, bold; background-color: #ffffff; color: #005DE8; padding: 4px 16px; text-decoration: none; border-radius: 4px; border: 1px solid #005DE8; display: inline-block; margin-top: 10px;">
                    ${col.buttonText}
                </a>
            </div>` : '';
        
            componentHTML = `
                <div id="component-${data.id}" class="component">
                    <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                        <tr>
                            <td style="padding: 40px; text-align: center;">
                                ${imageHTML}
                                <h2 contenteditable="true" style="font-family: Georgia, bold; font-size: 20px; color: #240F6E; text-align: ${data.textalignment};">${col.h2Text}</h2>
                                <p contenteditable="true" style="font-family: sans-serif; color: #383838; font-size: 16px; line-height: 1.4; text-align: ${data.textalignment};">${col.pText}</p>
                                ${buttonHTML}
                            </td>
                        </tr>
                    </table>
                    <div id="components-preview">
                <!-- Up button -->
                <div class="up-btn-container">
                    <button onclick="moveComponent('${data.id}', 'up')" class="move-btn up-btn">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>  
                <div>
                <!-- Down button -->
                    <button onclick="moveComponent('${data.id}', 'down')" class="move-btn down-btn">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                    </button>
                <!-- Delete button -->
                    <button onclick="deleteComponent('${data.id}')" class="delete-btn">
                    <i class="fas fa-times-circle"></i>
                    </button>
                    <button onclick="applyBold('${data.id}')" class="bold-btn">
                    <i class="fas fa-bold"></i>
                    </button>
                    <button onclick="applyLink('${data.id}')" class="link-btn">
                    <i class="fas fa-link"></i>
                    </button>
                    <button onclick="applyBullet('${data.id}')" class="bullet-btn">
                    <i class="fas fa-list-ul"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'left')"class="left-btn">
                    <i class="fas fa-align-left"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'center')"class="center-btn">
                    <i class="fas fa-align-center"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'right')"class="right-btn">
                    <i class="fas fa-align-right"></i>
                    </button>
                    <button onclick="embedVideo()" class="embed-video-btn">
                    <i class="fas fa-video"></i>
                    </button>
                    <button onclick="embedImage('componentId')" class="embed-image-btn">
                    <i class="fas fa-image"></i>
                    </button>
            </div>
            </div>
            </div>
            `;
    } else if (data.type === 'Colour') {
        componentHTML = `
            <div id="component-${data.id}" class="component">
                <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                    <tr>
                        <td style="background-image: url('${data.backgroundUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%;">    
                            <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                                <tr>
                                    <td width="100%" style="padding: 40px;">
                                    <h2 contenteditable="true"  style="font-family: Georgia, serif; font-size: 20px; color: #240F6E; text-align: ${data.textalignment};">${data.h2Text}</h2>
                                    <p contenteditable="true" style="font-family: sans-serif; color: #383838; font-size: 16px; line-height: 1.4; text-align: ${data.textalignment};">${data.pText}</p>                                    
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div id="components-preview">
                <!-- Up button -->
                <div class="up-btn-container">
                    <button onclick="moveComponent('${data.id}', 'up')" class="move-btn up-btn">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>  
                <div>
                <!-- Down button -->
                    <button onclick="moveComponent('${data.id}', 'down')" class="move-btn down-btn">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                    </button>
                <!-- Delete button -->
                    <button onclick="deleteComponent('${data.id}')" class="delete-btn">
                    <i class="fas fa-times-circle"></i>
                    </button>
                    <button onclick="applyBold('${data.id}')" class="bold-btn">
                    <i class="fas fa-bold"></i>
                    </button>
                    <button onclick="applyLink('${data.id}')" class="link-btn">
                    <i class="fas fa-link"></i>
                    </button>
                    <button onclick="applyBullet('${data.id}')" class="bullet-btn">
                    <i class="fas fa-list-ul"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'left')"class="left-btn">
                    <i class="fas fa-align-left"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'center')"class="center-btn">
                    <i class="fas fa-align-center"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'right')"class="right-btn">
                    <i class="fas fa-align-right"></i>
                    </button>
                    <button onclick="embedVideo()" class="embed-video-btn">
                    <i class="fas fa-video"></i>
                    </button>
                    <button onclick="embedImage('componentId')" class="embed-image-btn">
                    <i class="fas fa-image"></i>
                    </button>
            </div>
            </div>
            </div>
        `;
    }   else if (data.type === 'Footer') {
        componentHTML = `
            <div id="component-${data.id}" class="component">
                <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                    <tr>
                        <td style="background-image: url('https://i.imgur.com/Dowt56S.png'); background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%;">    
                            <table width="100%" cellspacing="20px" cellpadding="40px" style="border-collapse: collapse;">
                                <tr>
                                    <td width="100%" style="padding: 40px;">
                                    <p contenteditable="true" style="font-family: sans-serif; color: #FFFFFF; font-size: 16px; line-height: 1.4; text-align: ${data.textalignment};">${data.pText}</p>                                    
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <div id="components-preview">
                <!-- Up button -->
                <div class="up-btn-container">
                    <button onclick="moveComponent('${data.id}', 'up')" class="move-btn up-btn">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>  
                <div>
                <!-- Down button -->
                    <button onclick="moveComponent('${data.id}', 'down')" class="move-btn down-btn">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                    </button>
                <!-- Delete button -->
                    <button onclick="deleteComponent('${data.id}')" class="delete-btn">
                    <i class="fas fa-times-circle"></i>
                    </button>
                    <button onclick="applyBold('${data.id}')" class="bold-btn">
                    <i class="fas fa-bold"></i>
                    </button>
                    <button onclick="applyLink('${data.id}')" class="link-btn">
                    <i class="fas fa-link"></i>
                    </button>
                    <button onclick="applyBullet('${data.id}')" class="bullet-btn">
                    <i class="fas fa-list-ul"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'left')"class="left-btn">
                    <i class="fas fa-align-left"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'center')"class="center-btn">
                    <i class="fas fa-align-center"></i>
                    </button>
                    <button onclick="setTextAlignment('${data.id}', 'right')"class="right-btn">
                    <i class="fas fa-align-right"></i>
                    </button>
            </div>
            </div>
            </div>
        `;
    }
    previewArea.innerHTML += componentHTML;
});

// Example of how the delete button might be set up
function deleteImage(componentId, columnIndex) {
    console.log(`Deleting image from component: ${componentId}, Column: ${columnIndex}`); // Log to ensure indices are correct
    socket.emit('delete image', { componentId, columnIndex });
}


function updateComponentRemoveImage(componentId, columnIndex) {
    // Assuming you store your components in an array or similar
    const component = components.find(c => c.id === componentId); // Find the component by ID
    if (component && component.columns && columnIndex < component.columns.length) {
        component.columns[columnIndex].imgUrl = ""; // Remove the image URL
        component.columns[columnIndex].imgStyle = ""; // Clear the image style if necessary
    }
}


socket.on('update component', (data) => {
    const component = document.getElementById(`component-${data.componentId}`);
    if (component) {
        const imageDiv = component.querySelector(`#image-${data.componentId}-${data.columnIndex}`);
        if (imageDiv) {
            imageDiv.style.display = 'none'; // Or remove the element
            console.log(`Image at column ${data.columnIndex} hidden.`);
        } else {
            console.log(`Failed to find image at column ${data.columnIndex} to hide.`);
        }
    }
});


function deleteComponent(id) {
    socket.emit('delete component', id);
}


socket.on('component deleted', id => {
    const element = document.getElementById(`component-${id}`);
    if (element) {
        element.parentNode.removeChild(element);
    }
});



function toggleHeaderInputs() {
    var inputsContainer = document.getElementById('HeaderInputs');
    var toggleIcon = document.getElementById('toggleIcon');
    
    if (inputsContainer.style.display === 'none') {
        inputsContainer.style.display = 'block';
    } else {
        inputsContainer.style.display = 'none';
    }
}

function toggleColourInputs() {
    var inputsContainer = document.getElementById('ColourInputs');
    var toggleIcon = document.getElementById('toggleIcon');
    
    if (inputsContainer.style.display === 'none') {
        inputsContainer.style.display = 'block';
    } else {
        inputsContainer.style.display = 'none';
    }
}

function toggleFooterInputs() {
    var inputsContainer = document.getElementById('FooterInputs');
    var toggleIcon = document.getElementById('toggleIcon');
    
    if (inputsContainer.style.display === 'none') {
        inputsContainer.style.display = 'block';
    } else {
        inputsContainer.style.display = 'none';
    }
}

function toggleThreeColumnInputs() {
    var inputsContainer = document.getElementById('threeColumnInputs');
    var toggleIcon = document.getElementById('toggleIcon');
    
    if (inputsContainer.style.display === 'none') {
        inputsContainer.style.display = 'block';
    } else {
        inputsContainer.style.display = 'none';
    }
}

function toggleOneColumnInputs() {
    var inputsContainer = document.getElementById('OneColumnInputs');
    var toggleIcon = document.getElementById('toggleOneIcon');
    
    if (inputsContainer.style.display === 'none') {
        inputsContainer.style.display = 'block';
    } else {
        inputsContainer.style.display = 'none';
    }
}

function toggleTwoColumnInputs() {
    var inputsContainer = document.getElementById('twoColumnInputs');
    var toggleIcon = document.getElementById('toggleIcon');
    
    if (inputsContainer.style.display === 'none') {
        inputsContainer.style.display = 'block';
    } else {
        inputsContainer.style.display = 'none';
    }
}

function copyHtml() {
    const previewArea = document.getElementById('components-preview');
    // Clone the preview area to exclude its content
    const clonePreviewArea = previewArea.cloneNode(true);
    // Remove the move button containers from the cloned elements
    clonePreviewArea.querySelectorAll('.up-btn-container, .down-btn-container').forEach(element => {
        element.parentNode.removeChild(element);
    });
    // Remove the delete button and contenteditable attribute from the cloned elements
    clonePreviewArea.querySelectorAll('.delete-btn, .delete-embed-btn, .edit-embed-btn').forEach(deleteButton => {
        deleteButton.parentNode.removeChild(deleteButton);
    });
    clonePreviewArea.querySelectorAll('[contenteditable="true"]').forEach(contentEditable => {
        contentEditable.removeAttribute('contenteditable');
    });
    // Remove the components-preview container and its content
    clonePreviewArea.querySelectorAll('#components-preview').forEach(element => {
        element.parentNode.removeChild(element);
    });
    // Get the HTML content of the cloned preview area
    const htmlContent = clonePreviewArea.innerHTML;
    const copyButton = document.getElementById('copyHtmlButton');
    navigator.clipboard.writeText(htmlContent).then(function() {
        // Change button text to "Copied!"
        copyButton.textContent = 'Copied!';
        
        // Set a timeout to revert the button text back to "Copy HTML Code"
        setTimeout(() => {
            copyButton.textContent = 'Copy HTML Code';
        }, 2000); // 2 seconds delay
    }, function(err) {
        // If there's an error, log it
        console.error('Could not copy text: ', err);
    });
}




function moveComponent(componentId, direction) {
    const component = document.getElementById(`component-${componentId}`);
    console.log(`Component to move: ${componentId}, Direction: ${direction}`);

    if (!component) {
        console.error(`Component with ID ${componentId} not found.`);
        return;
    }

    const parent = component.parentNode;
    const index = Array.from(parent.children).indexOf(component);
    console.log('Current Position:', index);

    const numChildren = parent.children.length;
    let targetIndex;

    if (direction === 'up') {
        targetIndex = Math.max(index - 1, 0); // Move up
    } else {
        targetIndex = Math.min(index + 1, numChildren - 1); // Move down
    }

    if (index === targetIndex) {
        console.warn(`Cannot move component ${componentId} ${direction}: it is already at the boundary.`);
        return;
    }

    // Determine the reference node for insertion
    const referenceNode = parent.children[targetIndex + (direction === 'up' ? 0 : 1)];
    parent.insertBefore(component, referenceNode);

    // Apply move and fade animation to the component
    component.classList.add('move-and-fade');

    // Remove the animation class after the animation completes
    setTimeout(() => {
        component.classList.remove('move-and-fade');
    }, 500); // Duration of the animation in milliseconds

    console.log(`Moved component ${componentId} ${direction}.`);
}

document.getElementById('saveButton').addEventListener('click', function() {
    var modal = document.getElementById('saveModal');
    modal.style.display = "block";
});

document.getElementById('saveModalClose').addEventListener('click', function() {
    document.getElementById('saveModal').style.display = "none";
});

document.getElementById('confirmSaveButton').addEventListener('click', function() {
    saveComponents();
    var modal = document.getElementById('saveModal');
    modal.style.display = "none";
});

function saveComponents() {
    const filename = document.getElementById('filenameInput').value.trim();
    const content = document.getElementById('components-preview').innerHTML;
    if (!filename) {
        alert("Please enter a filename.");
        return;
    }

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename, content })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => console.error('Error saving components:', error));
}



document.getElementById('loadButton').addEventListener('click', function() {
    var modal = document.getElementById('loadModal');
    modal.style.display = "block";
    listSavedFiles(); // Populate the select dropdown
});

document.getElementById('loadModalClose').addEventListener('click', function() {
    document.getElementById('loadModal').style.display = "none";
});

document.getElementById('confirmLoadButton').addEventListener('click', function() {
    loadComponent();
    var modal = document.getElementById('loadModal');
    modal.style.display = "none";
});

function listSavedFiles() {
    fetch('/list-saves')
    .then(response => response.json())
    .then(files => {
        const select = document.getElementById('file-select');
        select.innerHTML = ''; // Clear previous options
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error listing files:', error));
}

function loadComponent() {
    const filename = document.getElementById('file-select').value;
    if (!filename) {
        alert("Please select a file to load.");
        return;
    }
    fetch(`/load?filename=${filename}`)
    .then(response => response.text())
    .then(htmlContent => {
        document.getElementById('components-preview').innerHTML = htmlContent;
    })
    .catch(error => console.error('Error loading components:', error));
}

window.onclick = function(event) {
    var saveModal = document.getElementById('saveModal');
    var loadModal = document.getElementById('loadModal');
    if (event.target === saveModal) {
        saveModal.style.display = "none";
    } else if (event.target === loadModal) {
        loadModal.style.display = "none";
    }
}

function changeFont(componentId) {
    const newFont = prompt("Enter font family:");
    if (newFont) {
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontFamily = newFont;
            range.surroundContents(span);
        }
    }
}

function changeFontColor(componentId) {
    const newColor = prompt("Enter font color (hex or name):");
    if (newColor) {
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.color = newColor;
            range.surroundContents(span);
        }
    }
}

function changeFontSize(componentId) {
    const newSize = prompt("Enter font size:");
    if (newSize) {
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = newSize;
            range.surroundContents(span);
        }
    }
}

function applyBold(componentId) {
    document.execCommand('bold', false, null);
}

function applyLink(componentId) {
    var url = prompt("Enter the URL:");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}


function applyBullet(componentId) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return; // No selection

    const range = selection.getRangeAt(0);
    const containerNode = range.commonAncestorContainer;

    // Function to check if the node or its parent has a 'custom-bullet' class
    function isBulletNode(node) {
        return node.classList && node.classList.contains('custom-bullet') ||
               (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('custom-bullet'));
    }

    // If the selection is within a bullet, remove the bullet formatting
    if (isBulletNode(containerNode)) {
        const bulletNode = containerNode.classList.contains('custom-bullet') ? containerNode : containerNode.parentNode;
        const docFrag = document.createDocumentFragment();
        while (bulletNode.firstChild) {
            const child = bulletNode.firstChild;
            if (child.nodeType === 3) { // Node.TEXT_NODE
                // Remove bullet character if it's the first text node
                child.textContent = child.textContent.replace(/^•\s*/, '');
            }
            docFrag.appendChild(child);
        }
        bulletNode.parentNode.replaceChild(docFrag, bulletNode);
        return;
    }

    // Apply bullet formatting
    const selectedText = range.extractContents();
    const span = document.createElement('span');
    span.classList.add('custom-bullet');
    span.textContent = '• '; // Add bullet character
    span.appendChild(selectedText);
    range.insertNode(span);

    // Clean up selection
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
}




function setTextAlignment(componentId, alignment) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    let alignContainer = document.createElement('span'); // Use 'span' to inline-style text

    alignContainer.appendChild(selectedText);
    alignContainer.style.display = 'block'; // Make span behave like a block to allow alignments
    alignContainer.style.textAlign = alignment;
    
    range.insertNode(alignContainer);

    // Clean up the selection
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(alignContainer);
    selection.addRange(newRange);
}

function embedVideo() {
    var embedCode = prompt("Paste the full HTML embed code for the video:");
    if (!embedCode) {
        alert("No embed code provided!");
        return;
    }

    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = embedCode.trim(); // Trim the string to remove any extra whitespace

    // We need to handle both the possibility of iframes and script-based embeddings
    const container = document.createElement('div');
    container.contentEditable = "false"; // Make the container non-editable
    container.appendChild(tempDiv);

    const selection = window.getSelection();
    if (!selection.rangeCount) return; // Exit if no text is selected

    const range = selection.getRangeAt(0);

    // Check if the selection is within a contenteditable container
    if (!range.commonAncestorContainer.isContentEditable) {
        alert("Please select a valid editable area.");
        return;
    }

    range.deleteContents(); // Clear the selected content
    range.insertNode(container); // Insert the embed container at the selection point

    // Clear existing selections and select the new container for possible adjustments
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(container);
    selection.addRange(newRange);
}

function embedVideo() {
    const embedCode = prompt("Paste your embed code here:");
    if (!embedCode) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const embedContainer = createVideoContainer(embedCode);

    range.insertNode(embedContainer);
    selection.removeAllRanges();
}

function createVideoContainer(embedCode) {
    const container = document.createElement('div');
    container.setAttribute('rel', 'embed-container'); // Mark it as a generic embed container
    container.className = 'video-embed'; // Adding a class for easier CSS styling if needed
    container.innerHTML = embedCode; // Directly setting innerHTML to the embed code
    container.style.position = 'relative';
    container.style.textAlign = 'center';

    addVideoControls(container);
    return container;
}

function addVideoControls(container) {
    const editBtn = document.createElement('button');
    editBtn.setAttribute('contenteditable', 'false');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = 'edit-embed-btn';
    editBtn.onclick = function () {
        editEmbed(container, false);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('contenteditable', 'false');
    deleteBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
    deleteBtn.className = 'delete-embed-btn';
    deleteBtn.onclick = function () {
        container.remove();
    };

    container.appendChild(editBtn);
    container.appendChild(deleteBtn);
}

function embedImage() {
    var imageUrl = prompt("Enter the image URL:");
    if (!imageUrl) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const imageContainer = createImageContainer(imageUrl);

    range.insertNode(imageContainer);
    selection.removeAllRanges();
}

function createImageContainer(imageUrl) {
    const container = document.createElement('div');
    container.setAttribute('rel', 'embed-container');  // Mark it as an embed container
    container.setAttribute('data-is-image', 'true');  // Specify it's an image for edit context
    container.style.position = 'relative';
    container.style.textAlign = 'center';

    const image = document.createElement('img');
    image.src = imageUrl;
    image.style.width = "100%";
    image.style.height = "auto";
    image.style.borderRadius = "10px";
    container.appendChild(image);

    addImageControls(container);
    return container;
}

function addImageControls(container) {
    const editBtn = document.createElement('button');
    editBtn.setAttribute('contenteditable', 'false');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = 'edit-embed-btn';
    editBtn.addEventListener('click', function () {
        editEmbed(container, true);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('contenteditable', 'false');
    deleteBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
    deleteBtn.className = 'delete-embed-btn';
    deleteBtn.addEventListener('click', function () {
        container.remove();
    });

    container.appendChild(editBtn);
    container.appendChild(deleteBtn);
}

function editEmbed(container, isImage) {
    currentEditingContainer = container;
    const modal = document.getElementById('editEmbedModal');
    const urlInput = document.getElementById('embedUrl');
    const imageSizeFields = document.getElementById('imageSizeFields');

    if (isImage) {
        const img = container.querySelector('img');
        urlInput.value = img.src;
        document.getElementById('embedWidth').value = parseFloat(img.style.width) || 100;
        document.getElementById('embedHeight').value = parseFloat(img.style.height) || 'auto';
        imageSizeFields.style.display = 'block';
    } else {
        // Attempt to find the first element that might contain HTML content
        const possibleEmbed = container.querySelector('iframe, embed, object') || container;
        if (possibleEmbed) {
            urlInput.value = possibleEmbed.outerHTML || 'Error: No embed code found'; // Provide error message if not found
        } else {
            urlInput.value = 'Error: No embed code found'; // Fallback error message
        }
        imageSizeFields.style.display = 'none';
    }

    modal.style.display = 'block';
}


document.getElementById('editEmbedModalClose').onclick = function () {
    document.getElementById('editEmbedModal').style.display = "none";
}

function saveEmbedChanges() {
    const urlInput = document.getElementById('embedUrl');
    const widthInput = document.getElementById('embedWidth').value;
    const heightInput = document.getElementById('embedHeight').value;
    const isImage = document.getElementById('imageSizeFields').style.display !== 'none';

    if (isImage && currentEditingContainer) {
        const img = currentEditingContainer.querySelector('img');
        img.src = urlInput.value;
        img.style.width = widthInput + '%';
        img.style.height = heightInput + '%';
    }

    document.getElementById('editEmbedModal').style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    const componentsArea = document.getElementById('components-preview');
    componentsArea.addEventListener('click', function(event) {
        if (event.target.closest('.edit-embed-btn')) {
            const container = event.target.closest('div[rel="embed-container"]');
            const isImage = container.hasAttribute('data-is-image');
            editEmbed(container, isImage);
        }
        if (event.target.closest('.delete-embed-btn')) {
            const container = event.target.closest('div[rel="embed-container"]');
            container.remove();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    loadImageLibrary();
});

function toggleImageLibrary() {
    const library = document.getElementById('ImageLibrary');
    library.style.display = library.style.display === 'none' ? 'block' : 'none';
    if (library.style.display === 'block') {
        loadImageLibrary(); // Reload images each time the library is opened
    }
}

function uploadImage() {
    const formData = new FormData();
    const imageInput = document.getElementById('imageUploadInput');
    if (imageInput.files.length === 0) {
        console.log('No file selected');
        return;
    }
    formData.append('image', imageInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.url) {
            alert('Image uploaded successfully.');
            loadImageLibrary(); // Refresh the image library
        } else {
            throw new Error('URL not found in response');
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
    });
}

function triggerUpload() {
    document.getElementById('imageUploadInput').click(); // Assuming you have an input element with this id
}

function getBaseUrl() {
    // This will dynamically fetch the current protocol and hostname from the window location.
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
}

function loadImageLibrary() {
    const baseUrl = getBaseUrl(); // Get the dynamically determined base URL
    fetch(`${baseUrl}/images`)
    .then(response => response.json())
    .then(images => {
        const previewArea = document.getElementById('imagePreviewArea');
        previewArea.innerHTML = ''; // Clear existing previews
        images.forEach(image => {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'image-container';
            const completeImageUrl = `${baseUrl}${image.url}`;
            imgDiv.innerHTML = `
                <img src="${completeImageUrl}">
                <i class="fas fa-copy copy-icon" onclick="copyImageUrlToClipboard('${completeImageUrl}')"></i>
            `;
            previewArea.appendChild(imgDiv);
        });
    })
    .catch(error => console.error('Failed to load images:', error));
}



function copyImageUrlToClipboard(url) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        alert('Clipboard not supported or page needs to be served over HTTPS');
        return;
    }
    navigator.clipboard.writeText(url).then(() => {
        alert('Image URL copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL');
    });
}

// Assuming you have a download button with id "downloadButton"
const downloadButton = document.getElementById('downloadButton');

// Add event listener to the download button
downloadButton.addEventListener('click', async () => {
    await downloadPackagedHtml();
});

async function downloadPackagedHtml() {
    const previewArea = document.getElementById('components-preview');
    const clonePreviewArea = previewArea.cloneNode(true);

    // Remove unnecessary elements
    clonePreviewArea.querySelectorAll('.up-btn-container, .down-btn-container, .delete-btn, .delete-embed-btn, .edit-embed-btn').forEach(element => {
        element.parentNode.removeChild(element);
    });
    clonePreviewArea.querySelectorAll('[contenteditable="true"]').forEach(contentEditable => {
        contentEditable.removeAttribute('contenteditable');
    });

    // This line might be problematic as it removes the cloned preview area itself if it has the ID 'components-preview'
    // Adjust if necessary, depending on the structure of your HTML
    clonePreviewArea.querySelectorAll('#components-preview').forEach(element => {
        element.parentNode.removeChild(element);
    });

    // Collect image URLs from HTML content, including background images
    const imageUrls = Array.from(clonePreviewArea.querySelectorAll('img')).map(img => img.src);
    const backgroundUrls = extractBackgroundImageUrlFromInlineStyle(clonePreviewArea.innerHTML);

    // Combine image URLs and background image URLs
    const allUrls = [...imageUrls, ...backgroundUrls];

    try {
        // Download images and store them in a temporary directory
        const imageFiles = await Promise.all(allUrls.map(downloadImage));

        // Filter out any failed downloads (null values)
        const successfulImageFiles = imageFiles.filter(file => file !== null);
        const successfulImageUrls = successfulImageFiles.map(file => `images/${file.name}`);

        // Replace image URLs in HTML content with local file paths
        const updatedHtmlContent = replaceImageUrls(clonePreviewArea.innerHTML, allUrls, successfulImageUrls);

        // Create a zip file containing index.html and images
        const zip = new JSZip();
        zip.file('index.html', updatedHtmlContent);
        
        // Create a subfolder for images
        const imgFolder = zip.folder('images');
        successfulImageFiles.forEach(file => {
            imgFolder.file(file.name, file);
        });

        // Trigger download of the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerDownload(zipBlob);
    } catch (error) {
        console.error('Failed to package HTML:', error);
    }
}

function extractBackgroundImageUrlFromInlineStyle(htmlContent) {
    const urls = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const elementsWithStyle = doc.querySelectorAll('[style]');

    elementsWithStyle.forEach(element => {
        const style = element.getAttribute('style');
        const matches = style.match(/background-image:\s*url\(['"]?([^'"\)]+?)['"]?\)/);
        if (matches && matches.length > 1) {
            urls.push(matches[1]);
        }
    });

    return urls;
}



function triggerDownload(blob) {
    const zipUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = 'packaged-html.zip';
    link.click();
}


async function downloadImage(imageUrl) {
    console.log(`Attempting to fetch image from: ${imageUrl}`);
    try {
        // Check if the URL is a regular image URL
        if (imageUrl.startsWith('data:image')) {
            // If it's a data URL (base64 encoded), convert it to a Blob directly
            const blob = await fetch(imageUrl).then(response => response.blob());
            const extension = imageUrl.split(';')[0].split('/')[1];
            const filename = `image-${Date.now()}.${extension}`;
            console.log(`Downloaded image ${filename} with size ${blob.size}`);
            return new File([blob], filename, { type: blob.type });
        } else {
            // If it's a regular URL, fetch the image as usual
            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error(`Failed to fetch image: ${response.statusText}`);
                return null; // Return null to handle this gracefully later
            }
            const blob = await response.blob();
            const filename = imageUrl.split('/').pop();
            console.log(`Downloaded image ${filename} with size ${blob.size}`);
            return new File([blob], filename, { type: blob.type });
        }
    } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error);
        return null; // Return null to handle this gracefully later
    }
}


function replaceImageUrls(htmlContent, oldUrls, newUrls) {
    let updatedHtmlContent = htmlContent;

    // Replace regular image URLs
    oldUrls.forEach((oldUrl, index) => {
        console.log(`Replacing ${oldUrl} with ${newUrls[index]}`);
        const imgSrcRegex = new RegExp(escapeRegExp(oldUrl), 'g');
        updatedHtmlContent = updatedHtmlContent.replace(imgSrcRegex, newUrls[index]);
    });

    // Replace background image URLs in inline style attributes
    oldUrls.forEach((oldUrl, index) => {
        console.log(`Replacing background image ${oldUrl} with ${newUrls[index]}`);
        const bgImageInlineRegex = new RegExp(`background-image:\\s*url\\(['"]?${escapeRegExp(oldUrl)}['"]?\\)`, 'g');
        updatedHtmlContent = updatedHtmlContent.replace(bgImageInlineRegex, `background-image: url('${newUrls[index]}')`);
    });

    console.log("Updated HTML Content: ", updatedHtmlContent);
    return updatedHtmlContent;
}



function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
