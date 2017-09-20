pipeline {
  agent any
  environment {
    shouldDeploy = false
  }
  stages {
    stage('Init') {
      steps {
        echo 'Init'
      }
    }
    stage('Build') {
      steps {
        echo 'Compile'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Test": {
            echo 'Unit Tests'
            //sh 'echo \'initializing...\'; exit 245' 
          },
          "Story Tests": {
            echo 'Test all required stories and scenarios'
            script {
              //echo "Oh no there was an error!"
              //currentBuild.result = 'FAILURE'

              //echo "Whoops we encountered an issue..."
              //currentBuild.result = 'UNSTABLE'

              echo "All Story tests passed!"
            }
          }
        )
      }
    }
    stage('Promotion') {
      when {
        expression {
          script {
            echo "Deploy status: [${shouldDeploy}]"
            //echo "Deploy Decision: [${requestDeploymentDecision()}]"
            echo "shouldDeploy = requestDeploymentDecision()"
            shouldDeploy = input(
              id: 'DeployToProd',
              message: 'Deploy this to production?',
              ok: 'Vote',
              parameters: [
                [
                  $class: 'BooleanParameterDefinition',
                  defaultValue: true,
                  description: 'Please make your selection below:',
                  name: 'Cast my vote in favor of pushing to prod'
                ]
              ]
            )
          }
          return (shouldDeploy)
        }
      }
      steps {
        script {
          echo "Build Result : [${currentBuild.result.toString()}]"

          // If no result has been set, the build has passed all previous Tests/Build steps.
          if ( (null != currentBuild.result) && ('SUCCESS' != currentBuild.result) ) {
	    echo "The build status is something other than Success. Deployment to production Vetoed!"
          } else {
            // On success ask if we should deploy to production..
            shouldDeploy = requestDeploymentDecision(120, "Production")
            echo 'Did we perform the check?'
	  }
        }
      }
    }
    stage('Deploy') {
      when {
        expression {
          true == shouldDeploy
        }
      }
      steps {
        script {
          if (shouldDeploy) {
            echo 'Deploy'
          }
        }
      }
    }
    stage('Test Deployment') {
      when {
        expression {
          true == shouldDeploy
        }
      }
      steps {
        parallel(
          "Test Deployment": {
            echo 'Test deployed configuration'
      
          },
          "Rerun Story Tests": {
            echo 'Test all default stories and scenarios'
      
          }
        )
      }
    }
  }
}

// Place the entire deployment decision logic in this function.
boolean requestDeploymentDecision(Integer secondsToTimeout, String environmentType) {
  def userInput = true
  def didTimeout = false
  def user = "None"
  try {
    timeout(time: secondsToTimeout, unit: 'SECONDS') { // change to a convenient timeout for you
      userInput = input(
        id: 'DeployToEnv',
        message: "Deploy this to ${environmentType}?",
        ok: 'Vote',
        parameters: [
          [
            $class: 'BooleanParameterDefinition',
            defaultValue: true,
            description: 'Please make your selection below:',
            name: "Cast my vote in favor of pushing to ${environmentType}"
          ]
        ]
      )
    }
  } catch(err) { // timeout reached or input false
    echo "Errors: [${err}]"
    user = err.getCauses()[0].getUser()
    if('SYSTEM' == user.toString()) { // SYSTEM means timeout.
      didTimeout = true
    } else {
      userInput = false
      echo "Aborted by: [${user}]"
    }
  }

  if (!userInput) {
    echo "The user decided to abort deployment..."
    currentBuild.result = 'ABORTED'
    //throw new Exception("Aborted by [${user}]")
  } else if (didTimeout) {
    echo "A user was undecided about a [${environmentType}] deployment."
    //currentBuild.result = 'NOT_BUILT'
    //throw new Exception("No Deployment Vote")
  } else if (userInput) {
    // If user input was a positive vote.
    return (true)
  } else {
    echo "The decision reached, was not expected."
    currentBuild.result = 'UNSTABLE'
    throw new Exception("Unexpected voting conditions")
  }

  return (false)
}
