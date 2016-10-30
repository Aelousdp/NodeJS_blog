/**
 * Created by Administrator on 2016/9/25 0025.
 */
var express = require('express');
var port = process.env.PORT || 3000;
var markdown = require('markdown').markdown;
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var app = express();


app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

console.log("Web servers started on port" + port);


var allPosts = [],
    tag_posts = [],
    allTags = [];
var filesData = getAllFiles('./views/posts');   //获取posts文件夹下所有的md文件路径

//取出posts下面所有的markdown文件，将其生成HTML内容，并提取出其中的meta信息
Promise
    .map(filesData, function(filePath) {
        var fileName = filePath.split("\\").slice(-1);

        return fs.readFileAsync(filePath, 'utf-8')
            .then(function(fileData) {
                return markdown.toHTML(fileData);
            })
            .then(function(htmlContent) {
                return getMarkDownMeta(htmlContent, fileName);
            })
            .catch(function(err) {
                console.log(err);
            })
    })
    .then(function(posts) {
        allPosts = posts;
        return allPosts.map(function(item) {
            return item.tags
        })
    })
    .then(function(tags) {
        return tags.reduce(function(prev, cur) {
            return prev.concat(cur);
        })
    })
    .then(function(tags) {
        allTags = uniqArray(tags);
    });






app.get('/', function(req, res) {

    res.render('index',{
        allTags: allTags,
        posts: allPosts.slice(0,6),
        page: 1,
        pageURL: "/pages/",
        length: Math.ceil(allPosts.length/6)
    })
});

app.get('/pages/:id', function(req, res) {

    var id = req.params.id;

    res.render('index', {
        allTags: allTags,
        posts: allPosts.slice(6*(parseInt(id)-1),6*parseInt(id)),
        page: id,
        pageURL: "/pages/",
        length: Math.ceil(allPosts.length/6)
    })
});

app.get("/posts/:title", function(req, res) {

    var fileName = "./views/posts/" + req.params.title,
        htmlContent = null;


    fs.readFileAsync(fileName, 'utf-8')
        .then(function(fileData) {
            htmlContent = markdown.toHTML(fileData).split("%metaEnd%")[1];  //将markdown-meta分割走，获取正文
            res.render('post', {
                htmlContent: htmlContent
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});




app.get("/tags/:tag", function(req, res) {
    var tag = req.params.tag;

    tag_posts = allPosts.filter(function(item) {

        if(item.tags.indexOf(tag) !== -1) {
            return item
        }
    });

    res.render('index', {
        allTags: allTags,
        posts: tag_posts.slice(0,6),
        page: 1,
        pageURL: "/tags/"+tag+"/",
        length: Math.ceil(tag_posts.length/6)
    })
});

app.get("/tags/:tag/:id", function(req, res) {
    //var tag = req.params.tag,
    var id = req.params.id;
    //
    //var tag_posts = allPosts.filter(function(item) {
    //    if(tag in item.tags) {
    //        return item;
    //    }
    //});

    res.render('index', {
        allTags: allTags,
        posts: tag_posts.slice(6*(parseInt(id)-1),6*parseInt(id)),
        page: id,
        pageURL: "/tags/"+tag+"/",
        length: Math.ceil(tag_posts.length/6)
    })
});

app.get('/demo', function(req, res) {
   res.render('demo');
});





/**
 * 获取root目录下所有的文件地址
 * @param root
 * @returns  [array]
 */
function getAllFiles(root) {
    var files = fs.readdirSync(root);

    files = files.map(function(file) {
        return root + '\\' + file
    });

    return files
}

/**
 * 提取Markdown文件中的meta
 *
 * 设定Markdown中meta写法：
 * <!--title: XXXXXX-->
 * <!--time: XXXXXX-->
 * <!--tags: XXXXXX-->等等
 * 以%metaEnd%为结束
 * @param htmlContent
 * @returns [object]
 */
function getMarkDownMeta(htmlContent, fileName) {
    var post = {
            name: fileName,
            title: null,
            date: null,
            tags: null,
            abstract: null
        },
        pattern = /&lt;!--.+--&gt/g,
        matches = null;

    matches = htmlContent.match(pattern);
    matches.forEach(function(item) {
        var postMeta = item.split("--")[1].split(":");
        switch (postMeta[0]) {
            case 'title':
                post.title = postMeta[1].trim();
                break;
            case 'date':
                post.date = postMeta[1].trim();
                break;
            case 'tags':
                post.tags = postMeta[1].trim();
                //有时间，可以改改这个正则
                if(/[,，]+\s+/g.test(post.tags)) {
                    post.tags = post.tags.replace(/[,，]+\s+/g, " ");
                    post.tags = post.tags.split(" ");
                }else {
                    post.tags = [post.tags];
                }
                break;
            case 'abstract':
                post.abstract = postMeta[1].trim();
                break;
            default:
                break;
        }
    });

    return post;
}

/**
 * 数组去重
 * @param arr
 * @returns arr
 */
function uniqArray(arr) {
    var i,
        j;
    for(i=0; i<arr.length; i++) {
        for(j=i+1; j<arr.length; j++) {
            if(arr[i] === arr[j]) {
                arr.splice(j,1);
                j--;
            }
        }
    }


    return arr;
}


