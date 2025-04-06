@Library('jenkins-pod') _

podTemplateLibrary {

    def sha = ''
    stage('Checkout') {
        checkout scm
        sha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    }

    stage('Build') {
        sh """
        docker build . -t my-image:${sha}
        """
    }

    stage('Export') {
        if (env.TAG_NAME) {
            echo "Building tag ${env.TAG_NAME}"
            withCredentials([string(credentialsId: 'npm-package-dist', variable: 'NPM_TOKEN')]) {
                sh """
                docker rm -f temp-container || true
                docker run --name temp-container my-image:${sha} sh -c "npm config set //registry.npmjs.org/:_authToken \$NPM_TOKEN && npm version prerelease --preid=alpha.1 && npm publish --access public"
                docker rm -f temp-container || true
                """
            }
        } else {
            echo "Building branch ${env.BRANCH_NAME}"
        }
    }
}
