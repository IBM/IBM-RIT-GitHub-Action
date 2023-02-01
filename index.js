import { v4 as uuidv4 } from 'uuid';
const core = require('@actions/core');
const github = require('@actions/github');
const path = require("path");

const os = require('os');
const fs = require('fs');

const main = async () => {
    try {
        /*
         Rational Integration Tester parameters.
         */
        var script = '';
        const productpath = getProductPath();
        const paramfile = core.getInput('parameterFile', { required: false });

        if (paramfile) {
            script = 'cd ' + '"' + productpath + '"' + '\n'
                + './RunTests'
                + ' -parameterFile ' + '"' + paramfile + '"'
        }

        else {
            const projectdir = core.getInput('projectDir', { required: true });
            var projectname = core.getInput('projectName', { required: true });
            const environment = core.getInput('environment', { required: true });
            var tests = core.getInput('tests', { required: true });

            if (!projectname.includes('.ghp')) {
                projectname = projectname + '.ghp';
            }

            script = 'cd ' + '"' + productpath + '"' + '\n'
                + './RunTests'
                + ' -project ' + '"' + projectdir + path.sep + projectname + '"'
                + ' -run ' + '"' + tests + '"'
                + ' -environment ' + environment;
        }

        const junitDir = core.getInput('junitDir', { required: false });

        if (junitDir) {
            script = script.concat(' -junitDir ' + '"' + junitDir + '"');
        }

        let tempDir = os.tmpdir();
        let filePath = path.join(tempDir, uuidv4() + '.ps1');
        await fs.writeFileSync(
            filePath,
            script,
            { encoding: 'utf8' });

        console.log(script);
        console.log('========================== Starting Command Output ===========================');
        var spawn = require("child_process").spawn, child;
        child = spawn("powershell.exe", [filePath]);
        child.stdout.on("data", function (data) {
            console.log(" " + data);
        });
        child.stderr.on("data", function (data) {
            console.log("Errors: " + data);
        });
        child.on("exit", function () {
            console.log("Powershell Script finished");

        });
        await new Promise((resolve) => {
            child.on('close', resolve)
        });
        child.stdin.end();

        console.log("");
    }

    catch (error) {
        core.setFailed(error.message);
    }
}

function getProductPath() {
    var productPathVal = process.env.INTEGRATION_TESTER_HOME;
    var isValid = isValidEnvVar(productPathVal);
    if (isValid) {
        var stats = fs.statSync(productPathVal);
        isValid = stats.isDirectory();
    }

    if (!isValid) {
        throw new Error("Could not find a valid INTEGRATION_TESTER_HOME environment variable pointing to installation directory.");
    }
    return productPathVal;
}

function isValidEnvVar(productPathVal) {
    var valid = true;
    if (productPathVal == null) {
        valid = false;
    }
    else {
        productPathVal = productPathVal.toLowerCase();
        if (productPathVal.includes("*") || productPathVal.includes("?") ||
            productPathVal.startsWith("del ") || productPathVal.startsWith("rm "))
            valid = false;
    }
    return valid;
}

// Call the main function to run the action
main();
