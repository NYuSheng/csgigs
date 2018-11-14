module.exports = function () {
    this.When(/^I access Psyduck UI$/, function () {
        helpers.loadPage('localhost:3000/admin-ui/login');
    });

    this.Given(/^I enter "([^"]*)" as the username$/, function (username) {
        return driver.findElement(by.id('username')).sendKeys(username, selenium.Key.ENTER);
    });

    this.Then(/^I should be redirected to the ([^"]*) page$/, function (pageName) {
        return driver.wait(until.elementsLocated(by.css('div.ps')), 50000).then(function () {
            return driver.getCurrentUrl().then(function(currentUrl) {
                expect(currentUrl).to.contain(pageName);
            });
        });
    });

    this.Then(/^I should not be able to login$/, function () {
        return driver.wait(until.elementsLocated(by.css('div.message')), 50000).then(function () {
            return driver.findElement(by.css('div.message')).getText().then(function(errorMessage) {
                expect(errorMessage).to.equal('Login failed');
            });
        });

    });
};