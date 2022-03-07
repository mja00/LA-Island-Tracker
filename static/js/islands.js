function removeFromList(list, item) {
    list = list.filter(function (value) {
        return value !== item;
    });
    return list;
}

function resetInterestedButton(button, hidden) {
    button.removeClass('btn-danger');
    button.addClass('btn-warning');
    button.text('Interested');
    if (hidden) {
        button.hide();
    }
}

function activateInterestedButton(button) {
    button.removeClass('btn-warning');
    button.addClass('btn-danger');
    button.text('Not Interested');
    button.show();
}

function resetCompletedButton(button) {
    button.removeClass('btn-danger');
    button.addClass('btn-success');
    button.text('Complete');
}

function activateCompletedButton(button) {
    button.removeClass('btn-success');
    button.addClass('btn-danger');
    button.text('Incomplete');
}

function makeLinkWhite(link) {
    link.addClass('text-white');
}

function resetLink(link) {
    link.removeClass('text-white');
}

function completeIsland(islandId) {
    let triggeredButton = $(`#complete-button-${islandId}`);
    let islandCard = $(`#island-card-${islandId}`);
    let mokokoLink = $(`#mokoko-link-${islandId}`);
    // Store a list of completed islands in the user's session/local storage
    let completedIslands = JSON.parse(localStorage.getItem('completedIslands'));
    if (completedIslands === null) {
        completedIslands = [];
    }
    // We need our interested list too
    let interestedIslands = JSON.parse(localStorage.getItem('interestedIslands'));
    if (interestedIslands === null) {
        interestedIslands = [];
    }
    // Check if it's already in the list
    if (!completedIslands.includes(islandId)) {
        completedIslands.push(islandId);
        activateCompletedButton(triggeredButton);
        makeLinkWhite(mokokoLink);
        // Check if in the interested list
        if (interestedIslands.includes(islandId)) {
            islandCard.removeClass('text-white bg-warning border-warning');
            // Remove from interested list
            interestedIslands = removeFromList(interestedIslands, islandId);
            localStorage.setItem('interestedIslands', JSON.stringify(interestedIslands));
        } else {
            islandCard.removeClass('border-danger');
        }
        // Hide the interested button and set text to interested
        resetInterestedButton($(`#interested-button-${islandId}`), true);
        islandCard.addClass('text-white bg-success border-success');
    } else {
        // Remove it from the list
        completedIslands = removeFromList(completedIslands, islandId);
        resetCompletedButton(triggeredButton);
        resetLink(mokokoLink);
        islandCard.removeClass('text-white bg-success border-success');
        islandCard.addClass('border-danger');
        // Make sure the interested button is visible
        $(`#interested-button-${islandId}`).show();
    }
    // Update the list
    localStorage.setItem('completedIslands', JSON.stringify(completedIslands));
}

function interestedIsland(islandId) {
    let triggeredButton = $(`#interested-button-${islandId}`);
    let islandCard = $(`#island-card-${islandId}`);
    let mokokoLink = $(`#mokoko-link-${islandId}`);
    // Store a list of interested islands in the user's session/local storage
    let interestedIslands = JSON.parse(localStorage.getItem('interestedIslands'));
    if (interestedIslands === null) {
        interestedIslands = [];
    }
    // Check if it's already in the list
    if (!interestedIslands.includes(islandId)) {
        interestedIslands.push(islandId);
        activateInterestedButton(triggeredButton);
        makeLinkWhite(mokokoLink);
        islandCard.removeClass('border-danger');
        islandCard.addClass('text-white bg-warning border-warning');
    } else {
        // Remove it from the list
        interestedIslands = interestedIslands.filter(function (value) {
            return value !== islandId;
        });
        resetInterestedButton(triggeredButton, false);
        resetLink(mokokoLink);
        islandCard.removeClass('text-white bg-warning border-warning');
        islandCard.addClass('border-danger');
    }
    // Update the list
    localStorage.setItem('interestedIslands', JSON.stringify(interestedIslands));
}

// On document ready loop get the list of completed islands and mark them as complete
$(document).ready(function () {
    let completedIslands = JSON.parse(localStorage.getItem('completedIslands'));
    let interestedIslands = JSON.parse(localStorage.getItem('interestedIslands'));
    if (completedIslands !== null) {
        completedIslands.forEach(function (islandId) {
            let islandCard = $(`#island-card-${islandId}`);
            let triggeredButton = $(`#complete-button-${islandId}`);
            let interestedButton = $(`#interested-button-${islandId}`);
            let mokokoLink = $(`#mokoko-link-${islandId}`);
            activateCompletedButton(triggeredButton);
            makeLinkWhite(mokokoLink);
            // Hide the interested button
            interestedButton.hide();
            islandCard.removeClass('border-danger');
            islandCard.addClass('text-white bg-success border-success');
        });
    }
    if (interestedIslands !== null) {
        interestedIslands.forEach(function (islandId) {
            let islandCard = $(`#island-card-${islandId}`);
            let triggeredButton = $(`#interested-button-${islandId}`);
            let mokokoLink = $(`#mokoko-link-${islandId}`);
            activateInterestedButton(triggeredButton);
            makeLinkWhite(mokokoLink);
            islandCard.removeClass('border-danger');
            islandCard.addClass('text-white bg-warning border-warning');
        });
    }
});