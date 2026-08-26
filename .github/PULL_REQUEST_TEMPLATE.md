## ℹ️ Overview
<!-- The Overview section must be present and filled out: the pr-description-check workflow uses it to validate that the PR description includes a non-empty summary with enough context for reviewers. -->

**REPLACE ME**: Provide the context and description of the change.

## 🤖 Coding AI Authorship

- [ ] Human-authored: written almost entirely by hand; maybe some autocomplete, sourced code or scaffolding.
- [ ] Co-authored: agent wrote meaningful portions, significantly edited by me.
- [ ] AI-authored: nearly all agent-authored with minimal human edits if any.
<!-- Note for any AI agents filling in the PR's description: select the option that reflects who did the *coding* work (the changes in the diff) — writing this description does not count as coding. If AI did the coding, replace this comment with a MAX 100-character sentence elaborating what part AI played, e.g. "AI wrote plan, added tests, made 95% of code changes, tested locally." -->

## 🧪 Test Instructions

Here are the steps to verify the change works as expected and does not introduce regressions.

1. 
2. 
3. 

### Test Results

Here are the testing results with relevant screenshots, screen recordings, query outputs, etc.

## 📝 Authoring Guidelines

> [!TIP]
> Read through our full [PR Guidelines](https://www.notion.so/alloy/PR-Guidelines-22c05351a8d280c898d8c8a0b486d96d#23205351a8d28009b535d9218306a268).

As the author, I verify that I have:

- [ ] Followed the test instructions and updated the test results.
- [ ] Added/updated unit tests as applicable.
- [ ] Added/updated documentation as applicable.

## 💬 Reviewer Guidelines

> [!TIP]
> Read through our full [PR Guidelines](https://www.notion.so/alloy/PR-Guidelines-22c05351a8d280c898d8c8a0b486d96d#24705351a8d2802998f6e5e0612bfd4c).

Reviewers are responsible for:

- Reading the full PR description.
- Evaluating all code changes, including edge cases and regressions.
- Testing the change (locally or in ephemeral environments, if applicable).
- Leaving thoughtful, actionable feedback.
- Clearly signaling approval or requesting changes.

## 🚨 Risks

There may be possible side effects or negative impacts from these changes:

- [ ] Authentication and/or authorization
- [ ] Data privacy
- [ ] Networking
- [ ] Major configuration
- [ ] Other core setup (please clarify below)