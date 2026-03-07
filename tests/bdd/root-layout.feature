Feature: RootLayout initialization
  Scenario: Does not render until fonts are loaded
    Given fonts are not loaded
    When RootLayout is rendered
    Then nothing is rendered

  Scenario: Renders content and runs initialization side effects when fonts are loaded
    Given fonts are loaded
    Given theme background color is "#ABCDEF"
    Given theme is dark
    When RootLayout is rendered
    Then SplashScreen.preventAutoHideAsync is called once
    Then SystemUI.setBackgroundColorAsync is called with "#ABCDEF"
    Then StatusBar style is "light"
    Then DrawerNavigator is rendered
    Then DrawerNavigator receives homePageHeaderTitle "Мои дневники"
    Then DrawerNavigator receives settingsPageHeaderTitle "Настройки"
    When I trigger the root SafeAreaView layout
    Then SplashScreen.hideAsync is called once
