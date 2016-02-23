<style>
    html{
        font-size: 12px;
    }
    
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100vh;
    }
    
    main {
        display: flex;
        height: 100%;
    }
    
    .browser__list {
        width: 150px;
        background: #666;
    }
    
    textarea {
        flex: 1;
        background: #333;
        color: white;
        padding: 8px;
    }
    
    .preview {
        flex: 1;
        padding: 8px;
    }
    
    .browser__list__new {
        width: 100%;
        margin: 0;
        height: 2rem;
        background: #01D67D;
        border: 0px;
        color: white;
    }
    .browser__list__new:hover{
        background: #26FDA3;
    }
</style>

<template>
    <main>
        <aside class="browser__list">
            <button class="browser__list__new" @click="addPost">New</button>
            <browser-item v-for="post in posts" :post="post" @click="selectPost(post)" :editing-id="editing.id"></browser-item>
        </aside>
        <textarea v-model="editing.contents" @keyup="updatePost | debounce 500"></textarea>
        <div class="preview" v-html="editing.contents | marked"></div>
    </main>
</template>

<script>
var posts;
var marked = require("marked");
module.exports = {
    http: {
        root: "/api"
    },
    events: {
        "remove-post": function (post) {
            var self = this;
            if (confirm(post.title + "を削除しますか？")) {
                posts.delete({ id: post.id })
                    .then(function (res) {
                        self.fetchPosts();
                    });
            }
        }
    },
    data: function () {
        return {
            msg: 'Replaceing',
            posts: [],
            editing: {
                id: "",
                title: "",
                contents: ""
            }
        }
    },
    methods: {
        addPost: function () {
            var self = this;
            var title = window.prompt("Title:");
            var post = {
                title: title,
                contents: ""
            };
            if (title) {
                posts.save({}, post)
                    .then(function(res){
                        self.editing = res.data;
                        self.fetchPosts();
                    });
            }
        },
        updatePost: function () {
            if (this.editing.id || this.editing.id.length > 0) {
                posts.update({ id: this.editing.id }, this.editing)
                    .then(function(res){
                        console.log("saved");
                    });
            }
        },
        selectPost: function (post) {
            this.editing = post;
        },
        fetchPosts: function () {
            var self = this;
            posts.query({})
                .then(function(res){
                    self.posts = res.data;
                })
        }
    },
    ready: function () {
        posts = this.$resource('posts{/id}');
        this.fetchPosts();
    },
    components: {
        browserItem: require("./browser-item.vue")
    },
    filters: {
        marked: marked
    }
}

</script>