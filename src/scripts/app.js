// imports //
import ui from './ui';
import handle from './handle';


// variables //
const cardBtn = document.querySelector('.main-section');
const account = document.querySelector('.account .table');
const active_tables = document.querySelector('.footer .active-tables');
const question_alert_btns = document.querySelector('#question-alert .del-btns');
const body_backdrop = document.querySelector('.backdrop');
const search_input = document.querySelector('#search-input');
const side_menu_button = document.querySelector('.top-btns .btn-table-prices');
const close_side_menu_button = document.querySelector('#side-menu .content .close-menu .close');
const table_prices_items = document.querySelector('#side-menu .menu .menu-content');
const table_prices_reset = document.querySelector('#side-menu .menu .reset-tables');
const table_prices_input = document.querySelector('#side-menu .menu');
const exit_tables_modal_button = document.querySelector('#tdmodal .btn-exit');
const exit_tables_modal = document.querySelector('#tdmodal .box');
let removedAccountName;
let equals = [];
let lastInputEquals;



// LoadEvents
LoadAllEvents();


function LoadAllEvents() {

    // disable page load
    // window.onbeforeunload = function() { return false; };

    // disable right click on page
    // document.addEventListener('contextmenu', (event) => event.preventDefault());

    // page loaded
    document.addEventListener('DOMContentLoaded', onPageLoad);

    // on start button
    cardBtn.addEventListener('click', startTimer);

    // on input event
    cardBtn.addEventListener('input', inputFunc);

    // on remove account
    account.addEventListener('click', removeAccount);

    // cancel operation
    cardBtn.addEventListener('click', cancelFunc);

    // search accounts
    search_input.addEventListener('input', searchAccoutns);

    // table prices side menu
    side_menu_button.addEventListener('click', sideMenu);

    // close table side menu
    close_side_menu_button.addEventListener('click', closeSideMenu);

    // table prices items
    table_prices_items.addEventListener('click', tablePricesFunc);

    // reset tables prices
    table_prices_reset.addEventListener('click', tablePricesReset);

    // table prices input values
    table_prices_input.addEventListener('input', tablePricesInput);

    // exit tables disabled modal
    exit_tables_modal_button.addEventListener('click', exitModalFunc);

    // question buttons event
    question_alert_btns.addEventListener('click', quesButtonsFunc);

}


// functions //

// quesButtonsFunc
function quesButtonsFunc(e) {
    // hide accounts remove alert
    if (e.target.classList.contains('btn')) {
        ui.showRemoveAccAlert('hide');
    }

    // check if yes button clicked
    if (e.target.classList.contains('yes-btn')) {
        // get account text from array
        const arrayItemName = handle.accounts_array()[0].querySelector('.acc-name').textContent;

        // get all account items
        const accountItems = account.querySelectorAll('tbody tr');

        accountItems.forEach(item => {
            // get accounts text from table
            const tableAccountsNames = item.querySelector('.acc-name').textContent;

            // check if table item and array item are the same
            if (arrayItemName == tableAccountsNames) {
                // remove account from table
                item.remove();

                // remove account from Ls
                handle.deleteAccFromLs(tableAccountsNames);
            }

            // remove user from currentArray
            ui.savedUserNames().forEach((item, index) => {
                if (item == arrayItemName) {
                    ui.savedUserNames().splice(index, 1);
                    // save removed username into array
                    ui.savedRemovedUsers().push(item);
                    removedAccountName = ui.savedRemovedUsers().slice(ui.savedRemovedUsers().length - 1);
                }
            })
        })


        const parentCard = cardBtn.querySelectorAll('.card');

        parentCard.forEach(item => {
            // get all user inputs
            const userInputs = item.querySelector('.card-body .content .user .user-input');

            // check if removed username is equal with input value
            if (removedAccountName[0] == userInputs.value) {
                const userCard = userInputs.parentElement.parentElement.parentElement;
                const startBtn = userCard.querySelector('.buttons .btn-start');

                // active start button and remove alert
                ui.showAlert('نام وارد شده قبلا ثبت شده است.', 'danger', '0', 'hidden', 'translateY(-20px)');
                startBtn.removeAttribute('disabled', 'disabled');
            }
        })
    }

}

// sideMenu
function sideMenu() {
    ui.showSideMenu('show');
    body_backdrop.classList.add('show');
    body_backdrop.classList.remove('hidden');
}

// closeSideMenu
function closeSideMenu() {
    ui.showSideMenu('hidden');
    body_backdrop.classList.remove('show');
    body_backdrop.classList.add('hidden');
}

// tablePricesFunc
function tablePricesFunc(e) {
    // get buttons
    const applyButton = e.target.classList.contains('btn-apply');
    const editButton = e.target.classList.contains('btn-edit');

    const parent = e.target.parentElement.parentElement;
    if (applyButton) {
        // enable edit button
        e.target.previousElementSibling.removeAttribute('disabled', 'disabled');
        // disable apply button
        e.target.setAttribute('disabled', 'disabled');
        // get input
        const priceInput = parent.querySelector('.form-group .form-control');
        // disable input
        priceInput.setAttribute('disabled', 'disabled');
        // change input background
        priceInput.style.backgroundColor = '#79acea';

        // get input values
        const table_price_1 = document.querySelector('#table-price-1').value;
        const table_price_2 = document.querySelector('#table-price-2').value;
        const table_price_3 = document.querySelector('#table-price-3').value;
        const table_price_4 = document.querySelector('#table-price-4').value;

        // store input values into localstorage
        handle.storeTablePricesIntoLs(parseInt(table_price_1), parseInt(table_price_2),
            parseInt(table_price_3), parseInt(table_price_4));

        // add string after price
        priceInput.value = `${priceInput.value} تومان`;

        let value = parent.querySelector('.form-group .form-control').value;
        let inputValueParts = value.split(' ')[0];
        let mainValue = parseInt(inputValueParts);

        const parentId = e.target.parentElement.parentElement.id;
        if (mainValue == 0) {
            switch (parentId) {
                case 'tablePrice1':
                    document.querySelector('[data-table-number="1"]').classList.add('last');
                    break;
                case 'tablePrice2':
                    document.querySelector('[data-table-number="2"]').classList.add('last');
                    break;
                case 'tablePrice3':
                    document.querySelector('[data-table-number="3"]').classList.add('last');
                    break;
                case 'tablePrice4':
                    document.querySelector('[data-table-number="4"]').classList.add('last');
                    break;
            }
            handle.storeDesabledCardIntoLs(parentId);
            // handle.getCardsFromLs();
        } else {
            switch (parentId) {
                case 'tablePrice1':
                    document.querySelector('[data-table-number="1"]').classList.remove('last');
                    break;
                case 'tablePrice2':
                    document.querySelector('[data-table-number="2"]').classList.remove('last');
                    break;
                case 'tablePrice3':
                    document.querySelector('[data-table-number="3"]').classList.remove('last');
                    break;
                case 'tablePrice4':
                    document.querySelector('[data-table-number="4"]').classList.remove('last');
                    break;
            }
            handle.deleteCardsFromLs(parentId);
        }

    } else if (editButton) {
        // get input
        const priceInput = e.target.nextElementSibling.nextElementSibling.querySelector('input');
        // disable edit button
        e.target.setAttribute('disabled', 'disabled');
        // disable apply button
        e.target.nextElementSibling.removeAttribute('disabled', 'disabled');
        // enable input
        priceInput.removeAttribute('disabled', 'disabled');
        // change input background
        priceInput.style.backgroundColor = '#fff';
        // get input values parts to remove string
        const inputValueParts = priceInput.value.split(' ')[0];

        // convert number part of price to integer
        const in1 = inputValueParts.split(',')[0];
        const in2 = inputValueParts.split(',')[1];
        const main = parseInt(in1 + in2);

        priceInput.value = main;
    }
}

// tablePricesReset
function tablePricesReset(e) {
    ui.getTablePricesFromLs();

    // get inputs
    const inputs = e.target.parentElement.querySelectorAll('.menu-content .tbl-items .form-group .form-control');
    inputs.forEach(item => {
        // disable and change style of input
        item.setAttribute('disabled', 'disabled');
        item.style.backgroundColor = '#79acea';
        // disable apply buttons
        item.parentElement.previousElementSibling.setAttribute('disabled', 'disabled');
        item.parentElement.previousElementSibling.previousElementSibling.removeAttribute('disabled', 'disabled');
    });

}

// tablePricesInput
function tablePricesInput(e) {
    // get buttons
    const btnApply = e.target.parentElement.previousElementSibling;
    const btnEdit = e.target.parentElement.previousElementSibling.previousElementSibling;
    // get input value
    const inputValue = e.target.value;

    // check if input has correct value
    if (/^\d+$/.test(inputValue) && inputValue !== '') {
        btnApply.removeAttribute('disabled', 'disabled');
        btnEdit.setAttribute('disabled', 'disabled');
    } else {
        btnApply.setAttribute('disabled', 'disabled');
    }
}

// page load
function onPageLoad() {
    // change tables modal
    exit_tables_modal.style.display = 'none';
    setTimeout(() => {
        exit_tables_modal.style.display = 'block';
    }, 300);

    // call footer items methods
    handle.getTimes();

    // get and show accounts from LS
    ui.getUserFromLs();

    // set default values for table prices
    handle.tablePricesDefaultValues();

    // get prices into inputs
    ui.getTablePricesFromLs();

    // get cards disabled from Ls
    handle.getCardsFromLs();
}

// searchAccoutns
function searchAccoutns(e) {
    // get value of input
    const searchInputValue = e.target.value;

    // search and find accounts
    handle.searchAccountsItems(searchInputValue);
}

// inputFunc
function inputFunc(e) {
    const inputElem = e.target.parentElement.parentElement;
    const inputElemButton = e.target.parentElement.parentElement.parentElement;

    let inputValue = inputElem.querySelector('.item .user-input').value;
    let inputValueElem = inputElem.querySelector('.item .user-input');
    const startBtn = inputElemButton.querySelector('.card-body .buttons .btn-start');

    let inputsArr = [];
    let inputsExceptCurrent = [];
    let excepts = [];

    const inputNames = document.querySelectorAll('.main-section .card .user input');

    // get all filled inputs
    inputNames.forEach(item => {
        if (item.value !== '') {
            inputsArr.push(item);
        }
    })

    const currentElem = inputsArr.indexOf(inputValueElem);
    const currentElement = inputsArr[currentElem];

    // get all inputs except current input
    inputsArr.forEach((item, index) => {
        if (index !== currentElem) {
            inputsExceptCurrent.push(item);
        }
    })

    inputsExceptCurrent.forEach(item => {
        excepts.push(item.value);
    })

    if (inputValue !== '' && excepts.indexOf(inputValue) !== -1) {
        // set equals inputs into array
        equals.push(currentElement);

        // show alert and disable button
        ui.showAlert2('نام وارد شده تکراری می باشد.', 'warning', '1', 'visible', 'translateY(0)');
        const btnParent = currentElement.parentElement.parentElement.parentElement;
        const startBtn = btnParent.querySelector('.buttons .btn-start');

        setTimeout(() => {
            startBtn.setAttribute('disabled', 'disabled');
        }, 200);
    } else if (inputValue !== '') {
        const firstValue = document.querySelector('#input-name');

        lastInputEquals = equals.slice(equals.length - 1);
        lastInputEquals.forEach(input => {
            if (firstValue.innerHTML === input.value) {
                const btnParent = input.parentElement.parentElement.parentElement;
                const startBtn = btnParent.querySelector('.buttons .btn-start');

                startBtn.removeAttribute('disabled', 'disabled');
                ui.showAlert2('نام وارد شده تکراری می باشد.', 'warning', '0', 'hidden', 'translateY(-20px)');

                setTimeout(() => {
                    lastInputEquals = [];
                }, 200);
            }
        })

        lastInputEquals.forEach(item => {
            // set default state when equal input changed
            if (currentElement.id == item.id) {
                ui.showAlert2('نام وارد شده تکراری می باشد.', 'warning', '0', 'hidden', 'translateY(-20px)');
            }

            if (item.value == '') {
                ui.showAlert2('نام وارد شده تکراری می باشد.', 'warning', '0', 'hidden', 'translateY(-20px)');
            }
        })
    }

    // pattern for not use space first
    if (/\s/.test(inputValue)) {
        inputValue = '';
        ui.showAlert3('در نام فاصله (space) مجاز نمی باشد.', 'info', '1', 'visible', 'translateY(0)');
    } else {
        ui.showAlert3('در نام فاصله (space) مجاز نمی باشد.', 'info', '0', 'hidden', 'translateY(-20px)');
    }

    // check and show alert for saved users
    if (ui.savedUserNames().indexOf(inputValue) !== -1) {
        ui.showAlert('نام وارد شده قبلا ثبت شده است.', 'danger', '1', 'visible', 'translateY(0)');
    } else {
        ui.showAlert('نام وارد شده قبلا ثبت شده است.', 'danger', '0', 'hidden', 'translateY(-20px)');
    }

    // check if input is empty or not
    if (inputValue !== '' && ui.savedUserNames().indexOf(inputValue) == -1) {
        startBtn.removeAttribute('disabled', 'disabled');
    } else {
        startBtn.setAttribute('disabled', 'disabled');
    }
}

// startTimer
function startTimer(e) {
    // time elements
    const elemsParent = e.target.parentElement.parentElement;
    const secondTime = elemsParent.querySelector('.item .time-item label.second-elem');
    const minuteTime = elemsParent.querySelector('.item .time-item label.minute-elem');
    const hourTime = elemsParent.querySelector('.item .time-item label.hour-elem');
    const userInput = elemsParent.querySelector('.user-input');
    const userTextContent = elemsParent.querySelector('.user .user-text');

    let tableNumber = elemsParent.parentElement.getAttribute('data-table-number');
    const costAmount = elemsParent.querySelector('.item .main-cost');
    const timeStarted = e.target.parentElement.parentElement;

    const second_elem = timeStarted.querySelector('.content .time .time-item .second-elem').textContent;
    const minute_elem = timeStarted.querySelector('.content .time .time-item .minute-elem').textContent;
    const hour_elem = timeStarted.querySelector('.content .time .time-item .hour-elem').textContent;

    const data_id_card = parseInt(elemsParent.parentElement.getAttribute('data-id'));

    let lastTime = (second_elem + ' : ' + minute_elem + ' : ' + hour_elem);

    // button states
    if (e.target.classList.contains('btn-start')) {
        if (e.target.textContent == 'Start') {
            ui.startState(e);

            // show active tables (increase)
            ui.showActiveTables('increase');

            // set timerId into elements
            const timerId = handle.startTimer(secondTime, minuteTime, hourTime);
            const lastId = timerId.slice(timerId.length - 1);
            const body = e.target.parentElement.parentElement;
            const contentElem = body.querySelector('.content');
            contentElem.setAttribute('data-id', lastId);

            // disable user
            ui.userState('disable', userInput);

            // enable cancel button
            e.target.nextElementSibling.removeAttribute('disabled', 'disabled');

            // store username into array
            // ui.currentUserNames().push(userInput);

            // disable edit button in table active
            let tt = ui.disableEditInActiveTable('disable', tableNumber, data_id_card);

            const idd = tt.slice(tt.length - 1);

            const id = e.target.parentElement.parentElement.parentElement;

            id.setAttribute('data-id', idd);

        } else if (e.target.textContent == 'Stop') {
            ui.applyState(e);

            // change user text state
            ui.userTextContent('loser', userTextContent, userInput);

            // disable user
            ui.userState('enable', userInput);

            // disable button
            e.target.setAttribute('disabled', 'disabled');

            // stop timer
            handle.stopTimer(e);

            // get table prices
            handle.tablePrices(e);

            // calculate cost
            costAmount.textContent = ui.costShow(e);

            // show active tables (decrease)
            ui.showActiveTables('decrease');

            // enable cancel button
            e.target.nextElementSibling.setAttribute('disabled', 'disabled');

            // enable edit button in table active
            ui.disableEditInActiveTable('enable', tableNumber, data_id_card);

        } else if (e.target.textContent == 'Apply') {
            ui.stopState(e);

            // disable button
            e.target.setAttribute('disabled', 'disabled');

            // change user text state
            ui.userTextContent('name', userTextContent, userInput);

            // disable user
            ui.userState('disable', userInput);

            // add user info to accounts
            ui.addUser(userInput.value, tableNumber, costAmount.textContent, lastTime);

            console.log(ui.savedUserNames());

            // add user info to localstorage
            handle.addUserInfoToLs(userInput.value, tableNumber, lastTime, costAmount.textContent);

            // enable clear button
            e.target.nextElementSibling.nextElementSibling.removeAttribute('disabled', 'disabled');
        }
    } else if (e.target.classList.contains('btn-reset')) {
        // disable clear button
        e.target.setAttribute('disabled', 'disabled');

        // change user text state
        ui.userTextContent('name', userTextContent, userInput);

        // reset all items content
        ui.resetAllItems(e);

        // enable user
        ui.userState('enable', userInput);
    }
}

// remvoeAccount
function removeAccount(e) {
    // remove account from list
    if (e.target.classList.contains('delete-acc')) {

        // show accounts remove alert
        ui.showRemoveAccAlert('show');

        // account item
        const listItem = e.target.parentElement.parentElement;

        // set account into array
        handle.removeAccountCalculation(listItem);

    }
}

// cancelFunc
function cancelFunc(e) {
    const userParent = e.target.parentElement.parentElement;
    const userInput = userParent.querySelector('.user-input');
    const tableNumber = userParent.parentElement.getAttribute('data-table-number');
    const tableDataId = parseInt(userParent.parentElement.getAttribute('data-id'));

    if (e.target.classList.contains('btn-cancel')) {
        // delete username from active list
        // handle.deleteAccFromActiveList(userInput.value);

        const startBtn = e.target.previousElementSibling;
        // disable cancel button
        e.target.setAttribute('disabled', 'disabled');

        // change start button state
        startBtn.textContent = 'Start';
        startBtn.classList.remove('btn-danger');
        startBtn.classList.add('btn-success');

        // decrease active tables
        active_tables.innerHTML -= 1;

        // disable start button
        startBtn.setAttribute('disabled', 'disabled');

        // stop timer
        handle.stopTimer(e);

        // reset all items content
        setTimeout(() => {
            ui.resetAllItems(e);
        }, 50);

        // enable user input
        ui.userState('enable', userInput);

        // enable edit button in table active
        ui.disableEditInActiveTable('enable', tableNumber, tableDataId);

        // cancel equals when table canceled
        handle.cancelEquals(equals, userInput);
    }
}

// exitModalFunc
function exitModalFunc() {
    ui.showTableDisabledModal('hide');
}