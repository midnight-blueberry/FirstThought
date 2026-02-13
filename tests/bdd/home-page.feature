Feature: Home page diaries

Scenario: HomePage passes props to DiaryList and IconButton
Given initial diaries are empty
When HomePage is rendered
Then DiaryList receives 0 items
Then DiaryList receives the header shadow handler as onScroll
Then IconButton receives icon "add"
Then IconButton receives color "onAccent"
Then IconButton receives size 18
Then IconButton style has backgroundColor "#AABBCC" and width 40 and height 40 and borderRadius 20

Scenario: HomePage addDiary prepends a generated diary
Given initial diaries contain 2 items
Given Date.now is 111
Given Math.random is 0.41
When HomePage is rendered
When the add diary button is pressed
Then setDiaries is called with a new diary id "111" icon "document" title "Diary 3" prepended to the existing diaries
