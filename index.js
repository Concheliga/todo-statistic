const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findAllTODOComments(files) {
    let comments = [];

    for (let file of files) {
        let comment = '';

        for (let i = 0; i < file.length - 6; i++) {
            if ((file[i] + file[i + 1] + file[i + 2] + file[i + 3] + file[i + 4] + file[i + 5] + file[i + 6]) === ('/' + '/ TODO')) {
                for (let j = i; j < file.length; j++) {
                    if ((file[j]) === '\r') {
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

function getImportantComments(comments) {
    let importantComments = [];

    for (let comment of comments) {
        if (comment.includes('!')) {
            importantComments.push(comment);
        }
    }

    return importantComments;
}

function getUserComments(comments, userName) {
    let userComments = [];

    for (let comment of comments) {
        let currentUser = '';
        if (comment.includes(';')) {
            for (let i = 8; i < comment.length; i++) {
                if (comment[i] === ';') {
                    break;
                }

                currentUser += comment[i];
            }

            if (currentUser.toLowerCase() === userName.toLowerCase()) {
                userComments.push(comment);
            }
        }
    }

    if (userComments.length === 0) {
        return `0 comments from ${userName}`;
    }

    return userComments;
}

function bubbleSort2Lists(firstList, secondList) {
    for (let j = secondList.length - 1; j > 0; j--) {
        for (let i = 0; i < j; i++) {
            if (secondList[i] < secondList[i + 1]) {
                let firstTemp = secondList[i];
                let secondTemp = firstList[i];
                secondList[i] = secondList[i + 1];
                firstList[i] = firstList[i + 1];
                secondList[i + 1] = firstTemp;
                firstList[i + 1] = secondTemp;
            }
        }
    }

    return firstList;
}

function sortCommentsByImportance(comments) {
    let importanceOfComments = [];

    for (let j = 0; j < comments.length; j++) {
        let counter = 0;

        if (comments[j].includes('!')) {
            for (let i = 0; i < comments[j].length; i++) {
                if (comments[j][i] === '!') {
                    counter += 1;
                }
            }
        }

        importanceOfComments.push(counter);
    }

    return bubbleSort2Lists(comments, importanceOfComments);
}

function sortCommentsByDate(comments) {
    let dateOfComments = [];

    for (let comment of comments) {
        let date = '';

        if (comment.includes(';')) {
            date = comment.slice(comment.indexOf(';') + 1, comment.indexOf(';') + 12);
        }

        dateOfComments.push(date);
    }

    return bubbleSort2Lists(comments, dateOfComments);
}

function sortCommentsByUser(comments){
    let usersOfComments = [];

    for (let comment of comments) {
        let userName = '';

        if (comment.includes(';')) {
            userName = comment.slice(comment[8], comment.indexOf(';')).toLowerCase();
        }

        usersOfComments.push(userName);
    }

    return bubbleSort2Lists(comments, usersOfComments);
}

function printSortedComments(comments, sortingMethod) {
    switch (sortingMethod) {
        case 'importance':
            console.log(sortCommentsByImportance(comments));
            break;
        case 'date':
            console.log(sortCommentsByDate(comments));
            break;
        case 'user':
            console.log(sortCommentsByUser(comments));
            break;
    }
}

function processCommand(command) {
    const comments = findAllTODOComments(getFiles());
    let commandAddition = '';

    if (command.includes('user') || command.includes('sort')) {
        commandAddition = command.slice(6, -1);
        command = command.slice(0, 4);
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
            console.log(getUserComments(comments, commandAddition));
            break;
        case 'sort':
            printSortedComments(comments, commandAddition);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
