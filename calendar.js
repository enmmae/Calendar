// Month selection
const mth_element = document.querySelector('.calendar .month .mth');
const next_mth_element = document.querySelector('.calendar .month .next-mth');
const prev_mth_element = document.querySelector('.calendar .month .prev-mth');
const next_year_element = document.querySelector('.calendar .month .next-year');
const prev_year_element = document.querySelector('.calendar .month .prev-year');

// Calendar
const number_element = document.querySelector('.calendar .number');
const heading_element = document.querySelector('.calendar .heading');
const list_element = document.querySelector('.calendar .list');
const dots_element = document.querySelector('.calendar .dots');
const week_days_element = document.querySelector('.calendar .week-days');
const days_element = document.querySelector('.calendar .days');

// Constants
const items = ['NAUTI', 'MUISTA', 'MOIKKU'];
const list_lines = 7;
const months = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'];
const week_days = ['MAANANTAI', 'TIISTAI', 'KESKIVIIKKO', 'TORSTAI', 'PERJANTAI', 'LAUANTAI', 'SUNNUNTAI'];
const week_text = 'VKO';

// Date
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

mth_element.textContent = months[month] + ' ' + year;
number_element.textContent = month + 1;
heading_element.textContent = months[month];

populateList();
populateDates();

/*
 * EVENT LISTENERS
 */

next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);
next_year_element.addEventListener('click', goToNextYear);
prev_year_element.addEventListener('click', goToPrevYear);

/*
 * FUNCTIONS
 */

function goToNextMonth (e) {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    populateDates();
}

function goToPrevMonth (e) {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    populateDates();
}

function goToNextYear (e) {
    year++;
    populateDates();
}

function goToPrevYear (e) {
    year--;
    populateDates();
}

function setMonthText (e) {
    mth_element.textContent = months[month] + ' ' + year;
    number_element.textContent = month + 1;
    heading_element.textContent = months[month];
}

// Populate lists with heading and empty lines
function populateList (e) {
    for (let j = 0; j < items.length; j++) {
        const list_item = document.createElement('div');
        list_item.classList.add('heading');
        list_item.textContent = items[j];
        list_element.appendChild(list_item);
        for (let i = 0; i < list_lines; i++) {
            const line_element = document.createElement('div');
            line_element.classList.add('line');
            list_element.appendChild(line_element);
        }
    }
}

// Populate calendar with week day headings, week numbers and boxes for days
function populateDates (e) {
    setMonthText();

    // Empty weekday and days grids
    days_element.querySelectorAll('*').forEach(n => n.remove());
    week_days_element.querySelectorAll('*').forEach(n => n.remove());

    // Add weekday names
    for (let i = 0; i < week_days.length; i++) {
        const weekday_container = document.createElement('div');
        weekday_container.classList.add('weekdaycontainer');
        const week_day_element = document.createElement('div');
        week_day_element.classList.add('week-day');
        week_day_element.textContent = week_days[i];
        weekday_container.appendChild(week_day_element);
        week_days_element.appendChild(weekday_container);
    }

    let firstDay = (new Date(year + '-' + (month+1) + '-' + 1)).getDay() == 0 ? 7 : (new Date(year + '-' + (month+1) + '-' + 1)).getDay();
    let extraDays = 7 - (amountOfDays(month, year) + firstDay-1) % 7;
    
    for (let i = 0; i < firstDay-1 + amountOfDays(month, year) + (extraDays === 7 ? 0 : extraDays); i++) {
        const day_container = document.createElement('div');
        day_container.classList.add('daycontainer');

        // Add weeknumbers to calendar
        if (i % 7 === 0) {
            const week_number_container = document.createElement('div');
            week_number_container.classList.add('weeknumber');
            let startDay = i === 0 ? 1 : i - firstDay + 2;
            week_number_container.textContent = week_text + ' ' + getWeek(new Date(year + '-' + (month+1) + '-' + startDay));
            day_container.appendChild(week_number_container);
        }

        const day_element = document.createElement('div');
        // Add empty days until weekday matches the weekday of the first day of current month and to the end of the month
        if (i < firstDay-1 || i > firstDay-2 + amountOfDays(month, year)) {
            day_element.classList.add('empty');
        }
        // Add actual days
        else {
            day_element.classList.add('day');
            day_element.textContent = i - firstDay + 2;
        }
        day_container.appendChild(day_element);
        days_element.appendChild(day_container);
    }

    populateDots(7 - (amountOfDays(month, year) % 7) === 7 ? 0 : 7 - (amountOfDays(month, year) % 7));
}

function populateDots (empties) {
    // Populate the same amount of dots with numbers as there are days in current month
    dots_element.querySelectorAll('*').forEach(n => n.remove());

    for (let i = 0; i < amountOfDays(month, year) + empties; i++) {
        const dot_element = document.createElement('div');
        dot_element.classList.add('dot');
        if (i < amountOfDays(month, year))
            dot_element.textContent = i+1;
        dots_element.appendChild(dot_element);
    }
}

/*
 * HELPER FUNCTIONS
 */

function amountOfDays (month, year) {
    const isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? true: false;
    const days_amount = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days_amount[month];
}

function getWeek (date) {
    // Set date to be thursday of current week
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    // January 4th is always in first week
    var firstWeekOfYear = new Date(date.getFullYear(), 0, 4);

    // Calculate the week number
    var millisecsInDay = 86400000;
    return 1 + Math.round(((date.getTime() - firstWeekOfYear.getTime()) / millisecsInDay - 3 + (firstWeekOfYear.getDay() + 6) % 7) / 7);
};