Feature: Login to Admin UI tool
  As a valid user
  In order to access the Admin UI tool
  I need to login with valid credentials

  Scenario: Access Admin UI tool via login page with the right credentials
    When I access Psyduck UI
    Given I enter "logintest" as the username
    Then I should be redirected to the dashboard page

  Scenario: Access Admin UI tool via login page with the wrong credentials
    When I access Psyduck UI
    Given I enter "wronglogin" as the username
    Then I should not be able to login