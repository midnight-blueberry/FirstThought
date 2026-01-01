Feature: Sticky registerPress handles missing measurement

  Scenario: registerPress leaves selection idle without measurement
    Given a sticky tree is rendered with a scroll ref
    When the sticky selection context is obtained
    When registerPress is invoked without measureInWindow
    Then the sticky selection state remains null and status is idle

  Scenario: registerPress waits for measureInWindow before resolving
    Given a sticky tree is rendered with a scroll ref
    When the sticky selection context is obtained
    When registerPress waits for measureInWindow after a delayed measurement
    Then the sticky selection state is updated and status is idle
