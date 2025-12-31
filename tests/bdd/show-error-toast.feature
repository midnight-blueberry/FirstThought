Feature: Show error toast

  Scenario: Android displays toast
    Given the platform is "android"
    When showErrorToast is called with "Oops"
    Then ToastAndroid.show is called with the message and short duration
    Then Alert.alert is not called

  Scenario: iOS displays alert
    Given the platform is "ios"
    When showErrorToast is called with "Something went wrong"
    Then Alert.alert is called with the message
    Then ToastAndroid.show is not called
