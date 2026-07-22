pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      parallel {
        stage('Checkout Code') {
          steps {
            git(url: 'https://github.com/Mrdaviid-stack/adocore', branch: 'main')
          }
        }

        stage('build') {
          steps {
            echo 'building app'
          }
        }

      }
    }

  }
}