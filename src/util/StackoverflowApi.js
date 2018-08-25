export default class StackoverflowApi {

    constructor() {
        this.endpointUrl = 'https://api.stackexchange.com/2.2/questions';
    }

    getQuestionsByPage(page) {
        const url = this.endpointUrl + '?site=stackoverflow&sort=creation&order=desc&pagesize=100&filter=withbody&page=' + page;
        return this.doRequest(url);
    }

    doRequest(url) {
        return fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Unexpected error occurred: ' + response.status + ' ' + response.statusText);
            }
        });
    }
}
