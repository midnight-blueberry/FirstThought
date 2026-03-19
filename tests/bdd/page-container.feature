Feature: PageContainer
  Scenario: PageContainer uses theme background color and default flex
    Given PageContainer is rendered without custom style
    Then the container background color equals "#123456"
    Then the container flex equals 1
    Then the rendered markup contains "Child"

  Scenario: PageContainer merges custom style and allows overriding background
    Given PageContainer is rendered with style background "#ABCDEF" and padding 10
    Then the container background color equals "#ABCDEF"
    Then the container padding equals 10
    Then the container flex equals 1
