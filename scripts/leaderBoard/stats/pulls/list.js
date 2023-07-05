const API = require("../../../api/github.js");

class List {
    constructor() {
        this.list = [];
    }

    async fetch() {
        const { data, error } = await API.pulls.list();

        if (error) {
            this.list = [];
            return [];
        }

        this.list = data;

        return this.#filterValidData().#mapNeededData().list;
    }

    #mapNeededData() {
        this.list = this.list.map(pull => {
            return {
                id: pull.id,
                user: pull.user,
                title: pull.title,
                body: pull.body,
                state: pull.state,
                assignee: pull.assignee,
                assignees: pull.assignees,
                requested_reviewers: pull.requested_reviewers,

                merged_at: pull.merged_at,
                created_at: pull.created_at,
                updated_at: pull.updated_at,
                closed_at: pull.closed_at,

                html_url: pull.html_url,
                issue_url: pull.issue_url,
            };
        });
        return this;
    }

    #filterValidData() {
        function filters(pull) {
            const noDraft = pull.draft === false;
            const filterUserOnly = pull.user.type === "User";

            return noDraft && filterUserOnly;
        }

        // User only
        this.list = this.list.filter(pull => filters(pull));

        return this;
    }
}

module.exports = List;

