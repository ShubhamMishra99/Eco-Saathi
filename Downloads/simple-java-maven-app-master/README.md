Important Note - Windows users
Please use 'bat' instead 'sh' command !! 

# Jenkins Maven Project Setup

## **Objective**  
Set up a Jenkins pipeline to build, test, and deliver a Maven-based Java project.

## **Tasks**  
1. **Create a GitHub repository** for the Java project and push the code.  
2. **Configure Jenkins** to install the required tools:
   - **Maven** - for building and testing the Java project.
   - **JDK** - for compiling Java code.
   - **Git** (optional) - for cloning the repository.
3. **Create a Jenkins Pipeline Job** to automate the process.  
4. **Define a `Jenkinsfile`** that includes the following stages:  
   - **Build** the project:

     sh 'mvn -B -DskipTests clean package'

     This will compile the project and package it into a `.jar` file.
     
   - **Test** the project using Maven:

     sh 'mvn test'

     This will run unit tests and generate the test results.

   - **Deliver** the project using a custom script:

     sh './scripts/deliver.sh'

     This is where you can define the delivery steps (e.g., deploying the project, uploading artifacts, etc.).

5. **Execute the pipeline** in Jenkins and ensure all stages run successfully.  
6. **Push the `Jenkinsfile`** to the repository.

## **Evaluation Criteria**  
- Correct pipeline syntax and structure.  
- Proper tool configuration in Jenkins (Maven, JDK, etc.).  
- Successful execution of all stages.  
- Implementation of the delivery process as needed (custom script for delivery).

Complete the setup and run the pipeline in Jenkins. Good luck!
