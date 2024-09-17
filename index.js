const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findAllTODOComments(files){
    let comments = [];
    
    for (let file of files){
        let comment = '';

        for (let i = 0; i < file.length - 6; i++){
            if ((file[i] + file[i + 1] + file[i + 2] + file[i + 3] + file[i + 4] + file[i + 5] + file[i + 6]) === ('/' + '/ TODO')){
                for (let j = i; j < file.length; j++){
                    if ((file[j]) === '\r'){
                        comments.push(comment);
                        comment = '';
                        break;
                    }

                    comment += file[j];
                }
            }
        }

    }

    return comments;
}

function getImportantComments(comments){
    let importantComments = [];
    for (let comment of comments){
        if (comment.includes('!')){
            importantComments.push(comment);
        }
    }

    return importantComments;
}

function getUserComments(comments, userName){
    let userComments = [];

    for (let comment of comments){
        let currentUser = '';
        if (comment.includes(';')){
            for (let i = 8; i < comment.length; i++){
                if (comment[i] === ';'){
                    break;
                }
    
                currentUser += comment[i];
            }
            
            if (currentUser.toLowerCase() === userName.toLowerCase()){
                userComments.push(comment);
            }
        }  
    }

    return userComments;
}

function processCommand(command) {
    const comments = findAllTODOComments(getFiles());
    let userName = '';

    if (command.includes('user')){
        userName = command.slice(6, -1);
        command = 'user';
    }

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(comments);
            break;
        case 'important':
            console.log(getImportantComments(comments));
            break;
        case 'user':
        console.log(getUserComments(comments, userName))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
