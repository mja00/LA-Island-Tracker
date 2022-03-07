let completedIslands = JSON.parse(localStorage.getItem('completedIslands'));
if (completedIslands === null) {
    completedIslands = [];
}

let interestedIslands = JSON.parse(localStorage.getItem('interestedIslands'));
if (interestedIslands === null) {
    interestedIslands = [];
}
let questCompleted = JSON.parse(localStorage.getItem('questCompleted'));
if (questCompleted === null) {
    questCompleted = [];
}
let mokokoCompleted = JSON.parse(localStorage.getItem('mokokoCompleted'));
if (mokokoCompleted === null) {
    mokokoCompleted = [];
}
let tokenCompleted = JSON.parse(localStorage.getItem('tokenCompleted'));
if (tokenCompleted === null) {
    tokenCompleted = [];
}


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

function makeLinksWhite(links) {
    links.forEach(function (link) {
        makeLinkWhite(link);
    });
}

function resetLinks(links) {
    links.forEach(function (link) {
        resetLink(link);
    });
}

function getNeededElements(islandId) {
    let islandCard = $(`#island-card-${islandId}`);
    let mokokoLink = $(`#mokoko-link-${islandId}`);
    let questLink = $(`#island-quests-link-${islandId}`);
    let tokenLink = $(`#token-link-${islandId}`);
    let completedButton = $(`#complete-button-${islandId}`);
    let interestedButton = $(`#interested-button-${islandId}`);

    return [islandCard, mokokoLink, questLink, completedButton, interestedButton, tokenLink];
}

/* Island completion functions */

function makeIslandCardCompleted(islandId) {
    const [islandCard, mokokoLink, questLink, triggeredButton, interestedButton, tokenLink] = getNeededElements(islandId);
    completedIslands.push(islandId);
    activateCompletedButton(triggeredButton);
    makeLinksWhite([mokokoLink, questLink, tokenLink]);
    // Hide the interested button
    interestedButton.hide();
    islandCard.removeClass('border-danger');
    islandCard.addClass('text-white bg-success border-success');
    if (interestedIslands.includes(islandId)) {
        islandCard.removeClass('text-white bg-warning border-warning');
        interestedIslands = removeFromList(interestedIslands, islandId);
        localStorage.setItem('interestedIslands', JSON.stringify(interestedIslands));
        resetInterestedButton(interestedButton, true);
    }
    // Save the completed islands
    localStorage.setItem('completedIslands', JSON.stringify(completedIslands));
}

function makeIslandCardIncomplete(islandId) {
    const [islandCard, mokokoLink, questLink, triggeredButton, interestedButton, tokenLink] = getNeededElements(islandId);
    completedIslands = removeFromList(completedIslands, islandId);
    resetCompletedButton(triggeredButton);
    resetLinks([mokokoLink, questLink, tokenLink]);
    islandCard.removeClass('text-white bg-success border-success');
    islandCard.addClass('border-danger');
    // Make sure the interested button is visible
    $(`#interested-button-${islandId}`).show();
    // Save the completed islands
    localStorage.setItem('completedIslands', JSON.stringify(completedIslands));
}

function completeIsland(islandId) {
    // Check if it's already in the list
    if (!completedIslands.includes(islandId)) {
        makeIslandCardCompleted(islandId);
    } else {
        makeIslandCardIncomplete(islandId);
    }
}

/* Island interest functions */

function makeIslandCardInterested(islandId) {
    const [islandCard, mokokoLink, questLink, triggeredButton, interestedButton, tokenLink] = getNeededElements(islandId);
    interestedIslands.push(islandId);
    activateInterestedButton(interestedButton);
    makeLinksWhite([mokokoLink, questLink, tokenLink]);
    islandCard.removeClass('border-danger');
    islandCard.addClass('text-white bg-warning border-warning');
    // Save the interested islands
    localStorage.setItem('interestedIslands', JSON.stringify(interestedIslands));
}

function makeIslandCardUninterested(islandId) {
    const [islandCard, mokokoLink, questLink, triggeredButton, interestedButton, tokenLink] = getNeededElements(islandId);
    interestedIslands = removeFromList(interestedIslands, islandId);
    resetInterestedButton(interestedButton, false);
    resetLinks([mokokoLink, questLink, tokenLink]);
    islandCard.removeClass('text-white bg-warning border-warning');
    islandCard.addClass('border-danger');
    // Save the interested islands
    localStorage.setItem('interestedIslands', JSON.stringify(interestedIslands));
}

function interestedIsland(islandId) {
    const [islandCard, mokokoLink, questLink, triggeredButton, interestedButton] = getNeededElements(islandId);
    // Check if it's already in the list
    if (!interestedIslands.includes(islandId)) {
        makeIslandCardInterested(islandId);
    } else {
        makeIslandCardUninterested(islandId);
    }
}

/* Island quest completion functions */

function strikeQuestText(islandId, striked) {
    let questText = $(`#island-quests-${islandId}`);
    if (striked) {
        questText.addClass('striked');
    } else {
        questText.removeClass('striked');
    }
}

function onQuestCheck(islandId) {
    // Get the checkbox's state
    const checkbox = $(`#quest-checkbox-${islandId}`);
    const isChecked = checkbox.prop('checked');
    // Check if it's already in the list
    if (isChecked && !questCompleted.includes(islandId)) {
        questCompleted.push(islandId);
        // Save the completed quests
        localStorage.setItem('questCompleted', JSON.stringify(questCompleted));
        strikeQuestText(islandId, true);
    } else if (!isChecked && questCompleted.includes(islandId)) {
        questCompleted = removeFromList(questCompleted, islandId);
        // Save the completed quests
        localStorage.setItem('questCompleted', JSON.stringify(questCompleted));
        strikeQuestText(islandId, false);
    }
}

/* Island mokoko completion functions */

function strikeMokokoText(islandId, striked) {
    let mokokoText = $(`#mokoko-${islandId}`);
    if (striked) {
        mokokoText.addClass('striked');
    } else {
        mokokoText.removeClass('striked');
    }
}

function onMokokoCheck(islandId) {
    // Get the checkbox's state
    const checkbox = $(`#mokoko-checkbox-${islandId}`);
    const isChecked = checkbox.prop('checked');
    // Check if it's already in the list
    if (isChecked && !mokokoCompleted.includes(islandId)) {
        mokokoCompleted.push(islandId);
        // Save the completed mokokos
        localStorage.setItem('mokokoCompleted', JSON.stringify(mokokoCompleted));
        strikeMokokoText(islandId, true);
    } else if (!isChecked && mokokoCompleted.includes(islandId)) {
        mokokoCompleted = removeFromList(mokokoCompleted, islandId);
        // Save the completed mokokos
        localStorage.setItem('mokokoCompleted', JSON.stringify(mokokoCompleted));
        strikeMokokoText(islandId, false);
    }
}

/* Island token completion functions */

function strikeTokenText(islandId, striked) {
    let tokenText = $(`#token-${islandId}`);
    if (striked) {
        tokenText.addClass('striked');
    } else {
        tokenText.removeClass('striked');
    }
}

function onTokenCheck(islandId) {
    // Get the checkbox's state
    const checkbox = $(`#token-checkbox-${islandId}`);
    const isChecked = checkbox.prop('checked');
    // Check if it's already in the list
    if (isChecked && !tokenCompleted.includes(islandId)) {
        tokenCompleted.push(islandId);
        // Save the completed tokens
        localStorage.setItem('tokenCompleted', JSON.stringify(tokenCompleted));
        strikeTokenText(islandId, true);
    } else if (!isChecked && tokenCompleted.includes(islandId)) {
        tokenCompleted = removeFromList(tokenCompleted, islandId);
        // Save the completed tokens
        localStorage.setItem('tokenCompleted', JSON.stringify(tokenCompleted));
        strikeTokenText(islandId, false);
    }
}

// On document ready loop get the list of completed islands and mark them as complete
$(document).ready(function () {
    if (completedIslands !== null) {
        completedIslands.forEach(function (islandId) {
            makeIslandCardCompleted(islandId);
        });
    }
    if (interestedIslands !== null) {
        interestedIslands.forEach(function (islandId) {
            makeIslandCardInterested(islandId);
        });
    }

    if (questCompleted !== null) {
        questCompleted.forEach(function (islandId) {
            $(`#quest-checkbox-${islandId}`).prop('checked', true);
            strikeQuestText(islandId, true);
        });
    }

    if (mokokoCompleted !== null) {
        mokokoCompleted.forEach(function (islandId) {
            $(`#mokoko-checkbox-${islandId}`).prop('checked', true);
            strikeMokokoText(islandId, true);
        });
    }

    if (tokenCompleted !== null) {
        tokenCompleted.forEach(function (islandId) {
            $(`#token-checkbox-${islandId}`).prop('checked', true);
            strikeTokenText(islandId, true);
        });
    }
});