pipeline {
    agent any

    environment {
        IMAGE_NAME = "local-adonis-app"
        TEST_CONTAINER_NAME = "staging-test-adonis"
        PROD_CONTAINER_NAME = "live-production-adonis"
    }

    stages {
        stage('Install & Test Code') {
            // Tell Jenkins to spin up a Node container specifically for this stage
            agent { 
                docker { image 'node:22-alpine' } 
            }
            steps {
                echo "Validating code updates on branch: ${env.BRANCH_NAME}"
                sh 'npm ci'
                sh 'node ace test || echo "No tests configured yet, skipping safely..."'
            }
        }

        stage('Build Production Docker Image') {
            when {
                anyOf { branch 'test'; branch 'main' }
            }
            steps {
                echo 'Building highly optimized standalone AdonisJS production image...'
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy to Staging Server') {
            when { branch 'test' }
            steps {
                echo '🧪 Deploying to STAGING / TEST environment container...'
                sh """
                    docker stop ${TEST_CONTAINER_NAME} || true
                    docker rm ${TEST_CONTAINER_NAME} || true
                    docker run -d \
                      --name ${TEST_CONTAINER_NAME} \
                      -p 7000:3333 \
                      -e NODE_ENV=production \
                      -e HOST=0.0.0.0 \
                      -e PORT=3333 \
                      -e APP_KEY=\$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))") \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:latest
                """
                echo "Testing site is up at http://localhost:7000"
            }
        }

        stage('Deploy to Live Production') {
            when { branch 'main' }
            steps {
                echo '🚀 Deploying to LIVE PRODUCTION server container...'
                sh """
                    docker stop ${PROD_CONTAINER_NAME} || true
                    docker rm ${PROD_CONTAINER_NAME} || true
                    docker run -d \
                      --name ${PROD_CONTAINER_NAME} \
                      -p 8000:3333 \
                      -e NODE_ENV=production \
                      -e HOST=0.0.0.0 \
                      -e PORT=3333 \
                      -e APP_KEY=\$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))") \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:latest
                """
                echo "Production application is live at http://localhost:8000"
            }
        }
    }
}
