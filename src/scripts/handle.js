// imports
import ui from './ui';

// handle class

const handle = (function() {
    // define handle function
    class Handle {
        constructor() {
            this.date = new Date();
            this.isRunning = false;
            this.counter = 0;
            this.counter2 = 0;
            this.interval = [];
            this.basePrice = { table_1: 20000, table_2: 15000, table_3: 10000, table_4: 8000 };
            this.basePriceItem = 0;
            this.accounts_array = [];
            this.question_alert = document.querySelector('#question-alert');
            this.search_input = document.querySelector('#search-input');
            this.list_items_parent = document.querySelector('.account .table tbody');
            this.table_price_1 = document.querySelector('#table-price-1');
            this.table_price_2 = document.querySelector('#table-price-2');
            this.table_price_3 = document.querySelector('#table-price-3');
            this.table_price_4 = document.querySelector('#table-price-4');
        }

        // get time & date on footer
        getTimes() {
            // get current hour
            setInterval(() => {
                // define date object
                const date = new Date();

                // get hour time string
                const currentTime = date.toTimeString();
                const hour = currentTime.split(' ')[0];

                // set hour into element
                ui.setHour(hour);
            }, 1000);

            // get current date
            const currentDate = this.date.toLocaleDateString('fa-IR');
            // set date into element
            ui.setDate(currentDate);
        }

        // timer handle
        startTimer(second, minute, hour) {
            this.isRunning = true;

            // timer prefix
            const timerPrefix = (value) => {
                let val = '' + value;
                if (val <= 9) {
                    return val = '0' + value;
                } else {
                    return val = '' + value;
                }
            }

            if (this.isRunning) {
                // get current time as miliseconds
                let start = new Date();

                this.interval.push(setInterval(function() {
                    // milliseconds elapsed since start
                    let delta = new Date() - start;

                    // calculate times
                    let secondTime = (Math.floor(delta / 1000));
                    let minOutput = (secondTime / 60);
                    let minuteTime = minOutput.toLocaleString().split('.')[0];
                    let hourOutput = (minuteTime / 60);
                    let hourTime = hourOutput.toLocaleString().split('.')[0];

                    // set times into elements
                    second.textContent = timerPrefix(parseInt(secondTime) % 60);
                    minute.textContent = timerPrefix(parseInt(minuteTime) % 60);
                    hour.textContent = timerPrefix(parseInt(hourTime));

                }, 10));

                return this.interval;
            }
        }

        // stop timer
        stopTimer(e) {
            this.isRunning = false;

            // stop timer
            if (!this.isRunning) {
                // get timer Id from data-id
                const body = e.target.parentElement.parentElement;
                const contentElem = body.querySelector('.content');
                const timerId = parseInt(contentElem.getAttribute('data-id'));

                // search into interval array
                this.interval.forEach(id => {
                    if (id == timerId) {
                        let index = this.interval.indexOf(id);
                        if (index > -1) {
                            // clearInterval specific time
                            clearInterval(this.interval[index]);
                            // clear specific id from data-id
                            contentElem.removeAttribute('data-id', timerId);
                            // remove specific id from array
                            this.interval.splice(index, 1);
                        }
                    }
                })
            }
        }

        // calculate cost
        costCalculate(e) {
            // get times elements
            const elemsParent = e.target.parentElement.parentElement;
            const secondTime = elemsParent.querySelector('.item .time-item label.second-elem').textContent;
            const minuteTime = elemsParent.querySelector('.item .time-item label.minute-elem').textContent;
            const hourTime = elemsParent.querySelector('.item .time-item label.hour-elem').textContent;

            // set times into array
            const mainTime = [hourTime, minuteTime, secondTime];

            // get times form array sorted into new object
            let times = {
                mainHour: parseInt(mainTime[0]),
                mainMinute: parseInt(mainTime[1]),
                mainSecond: parseInt(mainTime[2])
            };

            // calculate hour & minute by base price
            const costHur = (Math.floor(times.mainHour) * this.basePriceItem);
            const costMin = (Math.floor(this.basePriceItem / 60) * times.mainMinute);
            const costSec = (Math.floor((this.basePriceItem) / 3600) * times.mainSecond);

            let costInHours = costHur;
            let costInMinutes = costMin;
            let costInSeconds = costSec;

            // concatenate cost items
            let costItem = (costInHours + costInMinutes + costInSeconds);

            // return main cost
            return costItem;
        }

        // set default localstorage table prices
        tablePricesDefaultValues() {
            let array;
            if (localStorage.getItem('Prices') == null) {
                array = [];
                array.push(this.basePrice);
                localStorage.setItem('Prices', JSON.stringify(array));
            }
        }

        // store table prices into local storage
        storeTablePricesIntoLs(tb1, tb2, tb3, tb4) {
            let array;
            if (localStorage.getItem('Prices') == null) {
                array = [];
                array.push({ table_1: tb1, table_2: tb2, table_3: tb3, table_4: tb4 });
                localStorage.setItem('Prices', JSON.stringify(array));
            } else {
                array = [];
                array.push({ table_1: tb1, table_2: tb2, table_3: tb3, table_4: tb4 });
                localStorage.setItem('Prices', JSON.stringify(array));
            }
        }

        // calculate table prices
        tablePrices(e) {
            // get tables by number
            const card = e.target.parentElement.parentElement.parentElement;
            const cardTitle = card.querySelector('.card-header .bottom-text').textContent;

            // set tables prcies
            switch (cardTitle) {
                case 'Table 1':
                    this.basePriceItem = parseInt(this.table_price_1.value);
                    break;
                case 'Table 2':
                    this.basePriceItem = parseInt(this.table_price_2.value);
                    break;
                case 'Table 3':
                    this.basePriceItem = parseInt(this.table_price_3.value);
                    break;
                case 'Table 4':
                    this.basePriceItem = parseInt(this.table_price_4.value);
                    break;
            }
        }

        // store desabled cards into localstorage
        storeDesabledCardIntoLs(cardClass) {
            let array;
            if (localStorage.getItem('Cards') === null) {
                array = [];
                array.push(cardClass);
                localStorage.setItem('Cards', JSON.stringify(array));
            } else {
                array = JSON.parse(localStorage.getItem('Cards'));

                let repeated = array.filter(function(tableId) { return tableId == cardClass }).length;
                if (!repeated) {
                    array.push(cardClass);
                    localStorage.setItem('Cards', JSON.stringify(array));
                } else {
                    ui.showTableDisabledModal('show');
                }
            }
        }

        // get cards from localstorage
        getCardsFromLs() {
            const cardsArray = JSON.parse(localStorage.getItem('Cards'));

            cardsArray.forEach(item => {
                switch (item) {
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
            })
        }

        // store desabled cards into localstorage
        deleteCardsFromLs(card) {
            let array = JSON.parse(localStorage.getItem('Cards'));

            // find user id into Ls to remove
            array.forEach((item, index) => {
                if (card == item) {
                    array.splice(index, 1);
                }
            })

            // set new items into Ls after remove
            localStorage.setItem('Cards', JSON.stringify(array));
        }

        // active tables
        activeTables(state) {
            let activeTbls;
            if (state == 'increase') {
                activeTbls = this.interval.length + 1;
            } else if (state == 'decrease') {
                activeTbls = this.interval.length;
            }
            return activeTbls;
        }

        // add user info into localstorage
        addUserInfoToLs(name, tbNumber, time, cost) {
            let array;

            if (localStorage.getItem('Accounts') == null) {
                array = [];
                // push items into array
                array.push({ name, tbNumber, time, cost });
                // set items into LS for the first time
                localStorage.setItem('Accounts', JSON.stringify(array));
            } else {
                // get key from LS
                array = JSON.parse(localStorage.getItem('Accounts'));
                // push new items into
                array.push({ name, tbNumber, time, cost });
                // set new items into LS
                localStorage.setItem('Accounts', JSON.stringify(array));
            }
        }

        // delete user from LS
        deleteAccFromLs(username) {
            let array = JSON.parse(localStorage.getItem('Accounts'));

            // find user id into Ls to remove
            array.forEach((item, index) => {
                if (username == item.name) {
                    array.splice(index, 1);
                }
            })

            // set new items into Ls after remove
            localStorage.setItem('Accounts', JSON.stringify(array));
        }

        // search accounts
        searchAccountsItems(inputValue) {
            const tableBody = this.list_items_parent;

            // get all list items
            tableBody.querySelectorAll('tr').forEach(item => {
                let listNames = item.querySelector('.acc-name').textContent;

                // search if value found or not found
                if (listNames.indexOf(inputValue) !== -1) {
                    item.style.display = 'table';
                } else {
                    item.style.display = 'none';
                }
            })
        }

        // set account into array
        removeAccountCalculation(listItem) {
            // empty array
            this.accounts_array = [];

            // set account into array
            this.accounts_array.push(listItem);
        }

        // handle the same input values
        handleTheSameInputs(userInput, currentInputItem, filledInputs) {
            // get current input on click
            ui.currentUserNames().forEach(input => {
                if (input.id == userInput.id) {
                    currentInputItem = input;
                }
            })

            // save other inputs except current
            const inputNames = document.querySelectorAll('.main-section .card .user input');
            inputNames.forEach(itm => {
                if (itm.value !== '' && itm.id !== currentInputItem.id) {
                    filledInputs.push(itm);
                }
            })

            // disable button if inputs are the same
            filledInputs.forEach(input => {
                if (input.value === currentInputItem.value) {
                    // disable alert
                    ui.showAlert2('نام وارد شده تکراری می باشد.', 'warning', '0', 'hidden', 'translateY(-20px)');
                    // get the same button
                    // const inputParent = input.parentElement.parentElement.parentElement;
                    // const startBtn = inputParent.querySelector('.buttons .btn-start');
                    // enable start button
                    // startBtn.removeAttribute('disabled', 'disabled');
                    // input.value = '';
                    console.log(input);
                }
            })

            // empty other inputs value
            // filledInputs = [];
        }

        // cancel equals
        cancelEquals(equals, userInput) {
            // get once equal input
            let lastEqualInput = equals.slice(equals.length - 1);

            lastEqualInput.forEach(input => {
                if (userInput.value === input.value) {
                    // get start button
                    const btnParent = input.parentElement.parentElement.parentElement;
                    const startBtn = btnParent.querySelector('.buttons .btn-start');

                    // remove alert and restore button state
                    ui.showAlert2('نام وارد شده تکراری می باشد.', 'warning', '0', 'hidden', 'translateY(-20px)');
                    startBtn.removeAttribute('disabled', 'disabled');
                }
                // empty equals array
                equals = [];
            })
        }

    }

    // instance of class
    const handle = new Handle();

    // return methods
    return {
        getTimes: function() {
            return handle.getTimes();
        },
        stopTimer: function(e) {
            return handle.stopTimer(e);
        },
        startTimer: function(second, minute, hour) {
            return handle.startTimer(second, minute, hour);
        },
        costCalculate: function(e) {
            return handle.costCalculate(e);
        },
        tablePrices: function(e) {
            return handle.tablePrices(e);
        },
        tablePricesDefaultValues: function() {
            return handle.tablePricesDefaultValues();
        },
        storeTablePricesIntoLs: function(tb1, tb2, tb3, tb4) {
            return handle.storeTablePricesIntoLs(tb1, tb2, tb3, tb4);
        },
        getCardsFromLs: function() {
            return handle.getCardsFromLs();
        },
        activeTables: function(state) {
            return handle.activeTables(state);
        },
        addUserInfoToLs: function(name, tbNumber, time, cost) {
            return handle.addUserInfoToLs(name, tbNumber, time, cost);
        },
        storeDesabledCardIntoLs: function(cardClass) {
            return handle.storeDesabledCardIntoLs(cardClass);
        },
        deleteAccFromLs: function(username) {
            return handle.deleteAccFromLs(username);
        },
        deleteCardsFromLs: function(card) {
            return handle.deleteCardsFromLs(card);
        },
        deleteAccFromActiveList: function(username) {
            return handle.deleteAccFromActiveList(username);
        },
        removeAccountCalculation: function(listItem) {
            return handle.removeAccountCalculation(listItem);
        },
        accounts_array: function() {
            return handle.accounts_array;
        },
        basePrice: function() {
            return handle.basePrice;
        },
        basePriceItem: function() {
            return handle.basePriceItem;
        },
        searchAccountsItems: function(inputValue) {
            return handle.searchAccountsItems(inputValue);
        },
        handleTheSameInputs: function(userInput, currentInputItem, filledInputs) {
            return handle.handleTheSameInputs(userInput, currentInputItem, filledInputs);
        },
        cancelEquals: function(equals, userInput) {
            return handle.cancelEquals(equals, userInput);
        }
    }
})()

// exoprt handle
export default handle;