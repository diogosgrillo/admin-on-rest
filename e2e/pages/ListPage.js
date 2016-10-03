const webdriver = require('selenium-webdriver');

const by = webdriver.By;
const until = webdriver.until;

module.exports = (entity) => (driver) => ({
    elements: {
        addFilterButton: by.css('.add-filter'),
        appLoader: by.css('app-loader'),
        displayedRecords: by.css('.displayed-records'),
        filter: name => by.css(`.filter-field[data-source='${name}']`),
        filterMenuItem: source => by.css(`.new-filter-item[data-key="${source}"]`),
        hideFilterButton: source => by.css(`.filter-field[data-source="${source}"] .hide-filter`),
        nextPage: by.css('.next-page'),
        pageNumber: n => by.css(`.page-number[data-page='${n}']`),
        previousPage: by.css('.previous-page'),
        recordRows: by.css('.datagrid-body tr'),
    },

    waitUntilVisible() {
        return driver.wait(until.elementLocated(this.elements.recordRows));
    },

    waitEndOfLoading() {
        // @FIXME: find a less empiric method
        return driver.sleep(1000);
    },

    navigate() {
        driver.navigate().to(`http://localhost:8081/#/${entity}`);
        return this.waitUntilVisible();
    },

    nextPage() {
        driver.findElement(this.elements.nextPage).click();
        return this.waitEndOfLoading();
    },

    previousPage() {
        driver.findElement(this.elements.previousPage).click();
        return this.waitEndOfLoading();
    },

    goToPage(n) {
        driver.findElement(this.elements.pageNumber(n)).click();
        return this.waitEndOfLoading();
    },

    filter(name, value) {
        const filterField = driver.findElement(this.elements.filter(name));
        filterField.findElement(by.css('input')).sendKeys(value);
        return driver.sleep(3000); // wait for debounce and reload
    },

    showFilter(name) {
        const addFilterButton = driver.findElement(this.elements.addFilterButton);
        addFilterButton.click();
        driver.wait(until.elementLocated(this.elements.filterMenuItem(name)));
        return driver.findElement(this.elements.filterMenuItem(name)).click();
    },

    hideFilter(name) {
        const hideFilterButton = driver.findElement(this.elements.hideFilterButton(name));
        return hideFilterButton.click();
    },

    close() {
        driver.quit();
    },
});