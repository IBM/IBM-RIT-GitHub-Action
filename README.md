## Rational Integration Tester GitHub Action
Rational Test provides software testing tools to support a DevOps approach: API testing, functional testing, UI testing, performance testing and service virtualization. It helps you automate and run tests earlier and more frequently to discover errors sooner - when they are less costly to fix.

This action enables the ability to run tests and suites from Rational Integration Tester projects on self hosted runners.

## Usage

### Prerequisites

Configure a self hosted runner on a suitable machine
1. The host machine will need a licensed copy of Rational Integration Tester and the API projects containing the tests you wish to run.
2. [Add a self-hosted runner](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners) at an appropriate level, ensure you have configured network access.
3. If you are using more than one runner [assign it a suitable label](https://docs.github.com/en/actions/hosting-your-own-runners/using-labels-with-self-hosted-runners) and note this for later.

### Setup
In the repository you want to apply the action to
1. Create a folder named ".github/workflows" in the root.
2. Create a .yml file with any name, inside the ".github/workflows" folder based on the following example content:

```yaml
name: Rational Integration Tester

on: workflow_dispatch

jobs:
    API-Action:
        name: Rational Integration Tester
        runs-on: self-hosted
        steps:
         - name: Rational Integration Tester
           uses: IBM/devopsauto-integrtest-actions@main
           with:
            projectDir: <C:\Data\SampleProject>
            projectName: <MyProject>
            environment: <Demo>
            tests: <MyTest>
```

3. Update the parameterized items to refer to your project and tests (see parameter details below).
4. If you have more than one runner configured, then use its label as the argument for **runs-on**.
5. Push your updated yml file to the repository.
6. Go to the Actions section in the repository and select the workflow.
7. Click the Run workflow dropdown and the list of input boxes get displayed.

As an alternative to having all of the API projects pre-configured on the runner machine, users could leverage other actions within the workflow to pull down the latest copies. 

### Required Parameters
- **projectDir** Fully qualified path to the Rational Integration Tester project directory. This value will be ignored if parameterFile field is used.
- **projectName** The name of the API test project. This value will be ignored if parameterFile field is used.
- **environment** The API Test environment to use for this execution. This value will be ignored if parameterFile field is used.
- **tests** Semicolon separated list of tests/suites to run. This value will be ignored if parameterFile field is used.

### Optional Parameters
- **parameterFile** Fully qualified path to a parameter file that contains project, environment, and run arguments for one or more tests.
- **junitDir** Fully qualified path to a folder where the JUnit report will be exported to.

## Troubleshooting
- **No runner available:** Check that the runner still exists in GitHub, if the local agent has not connected to GitHub for a period of 14 days then it will be automatically removed.