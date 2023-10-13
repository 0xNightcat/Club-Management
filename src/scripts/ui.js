// imports
import handle from './handle';

// ui class

const ui = (function() {
    // define ui class
    class Ui {
        constructor() {
            this.footer_hour = document.querySelector('.footer .hour');
            this.footer_date = document.querySelector('.footer .date');
            this.active_table = document.querySelector('.footer .footer-item .active-tables');
            this.side_menu = document.querySelector('#side-menu .content');
            this.account_table = document.querySelector('.account .table tbody');
            this.alert_message = document.querySelector('#alert');
            this.alert_message_2 = document.querySelector('#alert_2');
            this.alert_message_3 = document.querySelector('#alert_3');
            this.table_price_1 = document.querySelector('#table-price-1');
            this.table_price_2 = document.querySelector('#table-price-2');
            this.table_price_3 = document.querySelector('#table-price-3');
            this.table_price_4 = document.querySelector('#table-price-4');
            this.question_alert = document.querySelector('#question-alert');
            this.body_backdrop = document.querySelector('.backdrop');
            this.savedUserNames = [];
            this.currentUserNames = [];
            this.savedRemovedUsers = [];
            this.sameUserNames = [];
            this.tablePricesArray = [];
            this.tablesInterval = [];
        }

        // set time on footer
        setHour(hour) {
            // set hour into element
            this.footer_hour.textContent = hour;
        }

        // set date on footer
        setDate(date) {
            // set date into element
            this.footer_date.textContent = date;
        }

        // change start state
        startState(e) {
            e.target.textContent = 'Stop';
            e.target.classList.add('btn-danger');
            e.target.classList.remove('btn-success');
        }

        // change stop state
        stopState(e) {
            e.target.textContent = 'Start';
            e.target.classList.remove('btn-info');
            e.target.classList.add('btn-success');
        }

        // change apply state
        applyState(e) {
            e.target.textContent = 'Apply';
            e.target.classList.remove('btn-danger');
            e.target.classList.add('btn-info');
        }

        // reset all items
        resetAllItems(e) {
            // reset time items to default
            const body = e.target.parentElement.previousElementSibling;
            const timeLables = body.querySelectorAll('.item .time-item label');
            const costLable = body.querySelector('.item .cost-item .main-cost');
            const userInput = body.querySelector('.item .user-input');

            // clear times content
            timeLables.forEach(label => {
                label.textContent = '00';
            });

            // clear cost content
            costLable.textContent = '0';

            // clear input content
            userInput.value = '';
        }

        // set cost into element
        costShow(e) {
            // get and convert cost to localstring
            const cost = handle.costCalculate(e).toLocaleString();

            // set cost into element
            return cost;
        }

        // side menu prices
        showSideMenu(state) {
            if (state == 'show') {
                this.side_menu.classList.add('show');
                this.side_menu.classList.remove('hidden');
            } else if (state == 'hidden') {
                this.side_menu.classList.add('hidden');
                this.side_menu.classList.remove('show');
            }
        }

        // active tables show
        showActiveTables(state) {
            this.active_tables = handle.activeTables(state);
            // set active tables into active element
            this.active_table.innerHTML = this.active_tables;
        }

        // show remove account alert
        showRemoveAccAlert(state) {
            if (state == 'show') {
                // show question alert
                this.question_alert.classList.add('show');
                this.question_alert.classList.remove('hidden');

                // change page color state
                this.body_backdrop.classList.add('show');
                this.body_backdrop.classList.remove('hidden');
            } else if (state == 'hide') {
                // hide question alert
                this.question_alert.classList.remove('show');
                this.question_alert.classList.add('hidden');

                // change page color state
                this.body_backdrop.classList.remove('show');
                this.body_backdrop.classList.add('hidden');
            }
        }

        // disable user
        userState(state, attr) {
            if (state == 'disable') {
                attr.setAttribute('disabled', 'disabled');
            } else if (state == 'enable') {
                attr.removeAttribute('disabled', 'disabled');
            }
        }

        // add user into account
        addUser(name, tbNumber, cost, time) {
            // create account info
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td class="acc-name">${name}</td>
            <td class="acc-tb-num">${tbNumber}</td>
            <td class="acc-time">${time}</td>
            <td class="acc-cost">${cost} تومان</td>
            <td class="delete"><a href="#!" class="delete-acc">&times;</a></td>
            `

            // append tr into table body
            this.account_table.appendChild(tr);

            // save usernames into array
            this.savedUserNames.push(name);
        }

        // get user info from localstorage
        getUserFromLs() {
            let array;
            if (localStorage.getItem('Accounts') == null) {
                array = [];
                localStorage.setItem('Accounts', JSON.stringify(array));
            }
            // get accounts from LS
            const userInfo = JSON.parse(localStorage.getItem('Accounts'));

            userInfo.forEach(account => {
                // create account info
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td class="acc-name">${account.name}</td>
                <td class="acc-tb-num">${account.tbNumber}</td>
                <td class="acc-time">${account.time}</td>
                <td class="acc-cost">${account.cost} تومان</td>
                <td class="delete"><a href="#!" class="delete-acc">&times;</a></td>
                `

                // append tr into table body
                this.account_table.appendChild(tr);

                this.savedUserNames.push(account.name);
            });
        }

        // get table prices from localstorage
        getTablePricesFromLs() {
            // get prices parsed items
            let userInfo = JSON.parse(localStorage.getItem('Prices'));

            userInfo.forEach(item => {
                this.tablePricesArray.push({
                    table1: item.table_1,
                    table2: item.table_2,
                    table3: item.table_3,
                    table4: item.table_4
                });
                this.table_price_1.value = (`${item.table_1} تومان`);
                this.table_price_2.value = (`${item.table_2} تومان`);
                this.table_price_3.value = (`${item.table_3} تومان`);
                this.table_price_4.value = (`${item.table_4} تومان`);
            })
        }

        // show username alert for saved users
        showAlert(text, color, opac, visi, trans) {
            this.alert_message.textContent = text;
            this.alert_message.className = `alert alert-${color} text-center`;
            this.alert_message.style.opacity = `${opac}`;
            this.alert_message.style.visibility = `${visi}`;
            this.alert_message.style.transform = `${trans}`;
        }

        // show username alert for active users
        showAlert2(text, color, opac, visi, trans) {
            this.alert_message_2.textContent = text;
            this.alert_message_2.className = `alert alert-${color} text-center`;
            this.alert_message_2.style.opacity = `${opac}`;
            this.alert_message_2.style.visibility = `${visi}`;
            this.alert_message_2.style.transform = `${trans}`;
        }

        // show username alert for space line
        showAlert3(text, color, opac, visi, trans) {
            this.alert_message_3.textContent = text;
            this.alert_message_3.className = `alert alert-${color} text-center`;
            this.alert_message_3.style.opacity = `${opac}`;
            this.alert_message_3.style.visibility = `${visi}`;
            this.alert_message_3.style.transform = `${trans}`;
        }

        // show table disabled modal
        showTableDisabledModal(state) {
            if (state == 'show') {
                document.querySelector('#tdmodal .box').classList.add('show');
                document.querySelector('#tdmodal .box').classList.remove('hide');
                this.side_menu.classList.add('freez');
            } else if (state == 'hide') {
                document.querySelector('#tdmodal .box').classList.add('hide');
                document.querySelector('#tdmodal .box').classList.remove('show');
                this.side_menu.classList.remove('freez');
            }
        }

        // change user text content
        userTextContent(state, name, input) {
            if (state == 'name') {
                name.textContent = 'اسامی:';
                input.style.border = '1px solid #882dff70';
            } else if (state == 'loser') {
                name.textContent = 'نام بازنده:';
                input.style.border = '1px solid #c7300e';
            }
        }

        // disable edit in active table
        disableEditInActiveTable(state, id, elementId) {
            // get tables prices items
            const tablePrice_1 = this.table_price_1.parentElement.previousElementSibling.previousElementSibling;
            const tablePrice_2 = this.table_price_2.parentElement.previousElementSibling.previousElementSibling;
            const tablePrice_3 = this.table_price_3.parentElement.previousElementSibling.previousElementSibling;
            const tablePrice_4 = this.table_price_4.parentElement.previousElementSibling.previousElementSibling;

            // check if table is disabled
            if (state == 'disable') {
                this.tablesInterval.push(setInterval(() => {
                    switch (id) {
                        case '1':
                            tablePrice_1.setAttribute('disabled', 'disabled');
                            break;
                        case '2':
                            tablePrice_2.setAttribute('disabled', 'disabled');
                            break;
                        case '3':
                            tablePrice_3.setAttribute('disabled', 'disabled');
                            break;
                        case '4':
                            tablePrice_4.setAttribute('disabled', 'disabled');
                            break;
                    }
                }, 150));
                return this.tablesInterval;
                // check if table is enabled
            } else if (state == 'enable') {
                switch (id) {
                    case '1':
                        tablePrice_1.removeAttribute('disabled', 'disabled');
                        break;
                    case '2':
                        tablePrice_2.removeAttribute('disabled', 'disabled');
                        break;
                    case '3':
                        tablePrice_3.removeAttribute('disabled', 'disabled');
                        break;
                    case '4':
                        tablePrice_4.removeAttribute('disabled', 'disabled');
                        break;
                }
                // check if item is the same as tables attribute id
                this.tablesInterval.forEach((item, index) => {
                    if (item == elementId) {
                        clearInterval(item);
                        this.tablesInterval.splice(index, 1);
                    }
                })
            }
        }

    }

    // instance ui class
    const ui = new Ui();

    // return ui methods
    return {
        setHour: function(hour) {
            return ui.setHour(hour);
        },
        setDate: function(date) {
            return ui.setDate(date);
        },
        startState: function(e) {
            return ui.startState(e);
        },
        stopState: function(e) {
            return ui.stopState(e);
        },
        applyState: function(e) {
            return ui.applyState(e);
        },
        resetState: function(e) {
            return ui.resetState(e);
        },
        resetAllItems: function(e) {
            return ui.resetAllItems(e);
        },
        costShow: function(e) {
            return ui.costShow(e);
        },
        showSideMenu: function(state) {
            return ui.showSideMenu(state);
        },
        showActiveTables: function(state) {
            return ui.showActiveTables(state);
        },
        showRemoveAccAlert: function(state) {
            return ui.showRemoveAccAlert(state);
        },
        userState: function(state, attr) {
            return ui.userState(state, attr);
        },
        addUser: function(name, tbNumber, cost, time) {
            return ui.addUser(name, tbNumber, cost, time);
        },
        getUserFromLs: function() {
            return ui.getUserFromLs();
        },
        showTableDisabledModal: function(state) {
            return ui.showTableDisabledModal(state);
        },
        getTablePricesFromLs: function() {
            return ui.getTablePricesFromLs();
        },
        savedUserNames: function() {
            return ui.savedUserNames;
        },
        currentUserNames: function() {
            return ui.currentUserNames;
        },
        savedRemovedUsers: function() {
            return ui.savedRemovedUsers;
        },
        sameUserNames: function() {
            return ui.sameUserNames;
        },
        showAlert: function(text, color, opac, visi, trans) {
            return ui.showAlert(text, color, opac, visi, trans);
        },
        showAlert2: function(text, color, opac, visi, trans) {
            return ui.showAlert2(text, color, opac, visi, trans);
        },
        showAlert3: function(text, color, opac, visi, trans) {
            return ui.showAlert3(text, color, opac, visi, trans);
        },
        userTextContent: function(state, name, input) {
            return ui.userTextContent(state, name, input);
        },
        disableEditInActiveTable: function(state, id, elementId) {
            return ui.disableEditInActiveTable(state, id, elementId);
        },
    }
})()

// exoprt ui
export default ui;