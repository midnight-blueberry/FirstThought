Feature: DiaryList FlatList rendering

Scenario: DiaryList renders FlatList props and item layout
Given theme is configured for DiaryList
Given DiaryList data contains one diary with id "d1" icon "book" title "My diary"
Given DiaryList style has marginTop 99
Given onScroll handler is provided
When DiaryList is rendered
Then FlatList receives the diary data
Then FlatList content container paddingLeft is 10
Then FlatList content container paddingRight is 6
Then FlatList scrollEventThrottle is 16
Then FlatList style includes marginTop 99
Then FlatList keyExtractor returns "d1" for the first item
When FlatList renderItem is rendered for the first item
Then item container style has flexDirection "row" and alignItems "center"
Then item container style has padding 20 and backgroundColor "#FAFAFA" and borderRadius 8 and borderColor "#AABBCC" and borderWidth 4 and marginBottom 12
Then Ionicons is rendered with name "book" size 14 color "#111111"
Then AppText is rendered with color "basic" marginLeft 16 and text "My diary"
