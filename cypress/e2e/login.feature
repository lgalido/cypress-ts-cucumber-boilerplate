Feature: Login

  Scenario: Valid user logs in and sees dashboard
    Given I open the login page
    When I sign in as a standard user
    Then I should see the dashboard
