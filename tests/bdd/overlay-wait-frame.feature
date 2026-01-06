Feature: waitFrame utility
  Scenario: waitFrame calls requestAnimationFrame once
    Given requestAnimationFrame is mocked for waitFrame
    When waitFrame is invoked
    Then requestAnimationFrame is called exactly once

  Scenario: waitFrame resolves after animation frame callback
    Given requestAnimationFrame is mocked for waitFrame
    When waitFrame promise is created without firing callback
    Then promise resolves only after manually invoking the animation frame callback
