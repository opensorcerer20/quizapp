# quizapp

Generic React Native Expo app to ask questions from a given JSON file randomly, then reload and reshuffle once all questions are done

The question file is located at assets/questions.json, with "q" and "a" representing question and answer (respectively)

## Planned future features
- Example of a question with a variable and its resolver
  - e.g. "If John has {apples[0]} and Jane has {apples[1]} and she gives John {apples[2]}, how many does John have?" "Answer: {apples[3]}"
  - resolver `apples()` fills question and answer after it fills in values such as ["2 apples", "1 apple", "1 apple", "3 apples"]
  - enables more variance in questions to prevent rote memorization, e.g. different numbers of apples each time
