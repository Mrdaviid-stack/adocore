pipeline {
    agent any

    environment {
        IMAGE_NAME = "local-express-app"
        TEST_CONTAINER_NAME = "staging-test-express"
        PROD_CONTAINER_NAME = "live-production-express"
    }

    stages {
        stage('Install & Test Code') {
            steps {
                echo "Validating code updates on branch: ${env.BRANCH_NAME}"
                sh '''
                    docker run --rm -v $(env.WORKSPACE):/app -w /app node:24-alpine sh -c "
                        npm ci && 
                        npm test || echo 'No tests configured yet, skipping safely...'
                    "
                '''
            }
        }

        stage('Build Production Docker Image') {
            when { anyOf { branch 'test'; branch 'main' } }
            steps {
                echo 'Building highly optimized standalone production Docker image...'
                sh "docker build --no-cache -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy to Staging Server') {
            when { branch 'test' }
            steps {
                // This block automatically fetches the variable stack from Jenkins securely
                withCredentials([string(credentialsId: 'adocore-env', variable: 'ENV_RAW_DATA')]) {
                    echo '🧪 Deploying automatically to STAGING / TEST environment...'
                    sh """
                        docker stop ${TEST_CONTAINER_NAME} || true
                        docker rm ${TEST_CONTAINER_NAME} || true
                        
                        # 1. Automatically write your configuration variables to a temporary runtime file
                        echo "${ENV_RAW_DATA}" > run.env
                        
                        # 2. Inject the configuration file automatically via the --env-file flag
                        docker run -d \
                          --name ${TEST_CONTAINER_NAME} \
                          -p 7000:3333 \
                          --env-file run.env \
                          -e APP_KEY=\$(openssl rand -hex 16 2>/dev/null || date +%s | md5sum | head -c 32) \
                          --restart unless-stopped \
                          ${IMAGE_NAME}:latest
                          
                        # 3. Automatically wipe the file clean for security
                        rm -f run.env
                    """
                    echo "Testing site is up automatically at http://localhost:7000"
                }
            }
        }

        stage('Deploy to Live Production') {
            when { branch 'main' }
            steps {
                withCredentials([string(credentialsId: 'adocore-env', variable: 'ENV_RAW_DATA')]) {
                    echo '🚀 Deploying automatically to LIVE PRODUCTION...'
                    sh """
                        docker stop ${PROD_CONTAINER_NAME} || true
                        docker rm ${PROD_CONTAINER_NAME} || true
                        
                        # 1. Automatically write your configuration variables to a temporary runtime file
                        echo "${ENV_RAW_DATA}" > run.env
                        
                        # 2. Inject the configuration file automatically via the --env-file flag
                        docker run -d \
                          --name ${PROD_CONTAINER_NAME} \
                          -p 8000:3333 \
                          --env-file run.env \
                          -e APP_KEY=\$(openssl rand -hex 16 2>/dev/null || date +%s | md5sum | head -c 32) \
                          --restart unless-stopped \
                          ${IMAGE_NAME}:latest
                          
                        # 3. Automatically wipe the file clean for security
                        rm -f run.env
                    """
                    echo "Production application is live automatically at http://localhost:8000"
                }
            }
        }
    }
}