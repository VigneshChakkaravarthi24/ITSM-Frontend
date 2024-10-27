// Utility to escape special characters for regex
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // Escape special regex characters
}

// Function to clean a string by removing punctuation and extra spaces
function cleanString(text) {
    return text.replace(/[^\w\s]/g, '')  // Remove punctuation
               .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
               .trim();                 // Trim leading and trailing spaces
}

// Function to check if a sentence contains a phrase using word boundary matching
function containsWithRegex(sentence, phrase) {
    const cleanedSentence = cleanString(sentence);
    const cleanedPhrase = cleanString(phrase);
    const pattern = new RegExp('\\b' + escapeRegExp(cleanedPhrase) + '\\b', 'i');  // Word boundary regex
    return pattern.test(cleanedSentence);
}

// Function to split text by words, punctuation, and spaces
function splitByPunctuationAndSpace(text) {
    return text.match(/\w+|[^\w\s]+|\s+/g) || [];  // Split into words, punctuation, spaces
}

// Function to filter elements that are purely text (ignores punctuation and spaces)
function filterTextElements(elements) {
    return elements.filter(elem => /^[a-zA-Z]+$/.test(elem)).length;
}

// Check if the text contains punctuation, spaces, or is empty
function containsPunctuationOrSpaceOrEmpty(text) {
    return /[^\w]/.test(text) || !text;
}

// Main function to get verbatim matches and highlight them with <span> tags
export function getVerbatim(sent1, sent2,userGroup) {
const verbatiFlaggedWords=[]
    const tokens = splitByPunctuationAndSpace(sent2);  // Tokenize the second sentence
    if (tokens.length === 0) 
        {
            return {updatedContent:" ",verbatiFlaggedWords:verbatiFlaggedWords};  // Handle empty sentence
        }
    let result = [];
    let start = 0;

    // Iterate over the tokens in sent2
    while (start < tokens.length) {
        let end = start;

        // Find non-matching tokens in `sent1` from the current position
        while (end < tokens.length) {
            if (!containsWithRegex(sent1, tokens[end])) {
                // Try to match the next segment of tokens
                for (let j = end; j < tokens.length; j++) {
                    let segment = tokens.slice(end, j + 1).join('');
                    if (!containsWithRegex(sent1, segment) && !containsPunctuationOrSpaceOrEmpty(tokens[j])) {
                        if (containsWithRegex(sent1, tokens[j])) {
                            result.push(tokens.slice(end, j).join(''));  // Add non-matching text
                            end = j;
                            break;
                        }
                    }
                    if (j === tokens.length - 1) {
                        result.push(tokens.slice(end, j + 1).join(''));
                         
                        return {updatedContent:result.join(''),verbatiFlaggedWords:verbatiFlaggedWords};  // Handle empty sentence

                    }
                }
            }

            // Handle matching tokens
            if (containsWithRegex(sent1, tokens[end])) {
                for (let i = end; i < tokens.length; i++) {
                    let segment = tokens.slice(end, i + 1).join('');
                    if (containsWithRegex(sent1, segment)) {
                        if (i === tokens.length - 1) {
                            let cleanLength = filterTextElements(tokens.slice(end, i + 1));
                            let tempText = segment;
                            if (cleanLength >= 3) {
                                verbatiFlaggedWords.push(tempText)
                                if(userGroup==='treatment')
                                {
                                    tempText=`<span style="background-color: red; color: white; padding: 2px 4px; border-radius: 2px;" title="Your words match with the question, modify to improve your score.">${tempText}</span>`
                                }
                                else
                                {
                                    tempText=`<span>${tempText}</span>`
                                }
                            }
                            result.push(tempText);
                            return {updatedContent:result.join(''),verbatiFlaggedWords:verbatiFlaggedWords};  // Handle empty sentence

                        }
                    } else {
                        let tempText = tokens.slice(end, i).join('');
                        let cleanLength = filterTextElements(tokens.slice(end, i));
                        if (cleanLength >= 3) {
                            verbatiFlaggedWords.push(tempText)

                            if(userGroup==='treatment')
                                {
                                    tempText=`<span style="background-color: red; color: white; padding: 2px 4px; border-radius: 2px;" title="Your words match with the question, modify to improve your score.">${tempText}</span>`
                                }
                                else
                                {
                                    tempText=`<span>${tempText}</span>`
                                }
                        }
                        result.push(tempText);
                        end = i;
                        break;
                    }
                }
            } else {
                end++;
            }
        }

        start++;
    }
    return {updatedContent:result.join(''),verbatiFlaggedWords:verbatiFlaggedWords};  

}
