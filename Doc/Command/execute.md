on the PLAN folder create a .md file for the planning the task or request of the user, use the branch name user provided as the plan name and add the word -PLAN at the end. Example design-change-footer-PLAN.md 
ask user to review and approve the plan
once approved proceed create github branch with the branch name user provided
implement the changes in the branch
test the changes make sure there are no errors
if there are errors, fix them and test again
if there are no errors, ask the user to review the changes
if the user is happy with the changes, ask the user to approve the changes
if the user is not happy with the changes, ask the user to make the changes again
if the user is happy with the changes, push the changes to the branch
update the CHANGELOG.md file with the changes
ask the user if he wants to merge it with the main branch now or later
if the user wants to merge it now, merge it with the main branch
if the user wants to merge it later, ask the user to merge it later