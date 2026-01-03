Feature: Save indicator

  Scenario: showFor schedules fade out and resolves after duration
    Given the save indicator provider is rendered
    When showFor is called with 1000 milliseconds
    Then a fade-out timer is scheduled for 1000 milliseconds
    Then the returned promise resolves after 1000 milliseconds elapse

  Scenario: save indicator component is visible only while showing
    Given the save indicator provider is rendered
    Then the save indicator icon is not rendered
    When showFor is called with 1000 milliseconds to display the icon
    Then the save indicator icon is rendered
    When 1000 milliseconds elapse
    Then the save indicator icon is not rendered anymore

  Scenario: showFor2s schedules fade out for 2000 milliseconds
    Given the save indicator provider is rendered
    When showFor2s is called
    Then a fade-out timer is scheduled for 2000 milliseconds
    Then the returned promise resolves after 2000 milliseconds elapse

  Scenario: subsequent showFor reschedules fade out without extra fade-in
    Given the save indicator provider is rendered
    When showFor is called with 1000 milliseconds
    When showFor is called again with 2000 milliseconds before the first timeout
    Then the first promise resolves immediately
    Then the fade-out timer is rescheduled for 2000 milliseconds
    Then the fade-in animation is triggered only once

  Scenario: hide resolves promise and clears timers
    Given the save indicator provider is rendered
    When showFor is called with 1500 milliseconds
    When hide is called
    Then the current promise resolves immediately
    Then no fade-out timers remain active

  Scenario: showFor during active fade-out stops animation and reschedules hold
    Given the save indicator provider is rendered
    Given fade-out completion is handled manually
    When showFor is called with 1000 milliseconds
    When the fade-out timer elapses while the fade-out animation keeps running
    When showFor is called again with 2000 milliseconds during fade-out
    Then the in-flight fade-out animation is stopped and opacity resets to 1
    Then a single fade-out timer is active for 2000 milliseconds
    Then no additional fade-in animation is triggered
