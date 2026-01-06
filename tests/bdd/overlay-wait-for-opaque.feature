Feature: Wait for overlay to become opaque
  Scenario: resolves immediately when overlay is already opaque
    Given overlay is already opaque
    When waiting for overlay to become opaque
    Then waitForOpaque resolves without waiting for frames

  Scenario: resolves after multiple frames when overlay becomes opaque later
    Given overlay becomes opaque after several checks
    When waiting for overlay to become opaque
    Then waitForOpaque resolves after multiple animation frames

  Scenario: resolves after timeout when overlay never becomes opaque
    Given overlay never becomes opaque
    When waiting for overlay to become opaque
    Then waitForOpaque resolves after overlay opaque timeout
