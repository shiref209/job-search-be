"# job-search-api" 
This particular app describes searching for a job that is relevant to their domain or area of interest.

**Features of Job Search App:**
- *Filter option to get the required job.*
- *Handles the user’s data.*
- *Handles the company’s data.*
- *Handles the Job Applications*

**Auth APIs:**
1. Sign Up
2. Sign In
3. Forget password

**User APIs:**
1. update account
2. Delete account
3. Get user account data
4. Get profile data for another user
5. Get all accounts associated to a specific recovery Email

**Company APIs:**
1. Add company
2. Update company data
3. Delete company data
4. Get company data
5. Search for a company with a name.
6. Get all applications for specific Jobs

**Jobs APIs:**
1. Add Job
2. Update Job
3. Delete Job
4. Get all Jobs with their company’s information.
5. Get all Jobs for a specific company.
6. Get all Jobs that match the following filters:
    - allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
    - one or more of them should applied
7. Apply to Job
    - This API will add a new document in the application Collections with the new data

**POSTMAN API Documentation**
please refer to the documentation at : 
https://documenter.getpostman.com/view/29680409/2sA2r54kcg
