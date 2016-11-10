/**
 * Created by Administrator on 2016/9/25 0025.
 */
var express = require('express');
var port = process.env.PORT || 3000;
var markdown = require('markdown').markdown;
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var jade = require('jade');
var app = express();


app.set('views', './views/pages');
app.set('view engine', 'jade');
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
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
        allPosts = posts.sort(postCompare);
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
    })
    .then(function() {
        generateStatic();
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
    var tag = req.params.tag,
        id = req.params.id;

    tag_posts = allPosts.filter(function(item) {
        if(item.tags.indexOf(tag) !== -1) {
            return item
        }
    });

    res.render('index', {
        allTags: allTags,
        posts: tag_posts.slice(6*(parseInt(id)-1),6*parseInt(id)),
        page: id,
        pageURL: "/tags/"+tag+"/",
        length: Math.ceil(tag_posts.length/6)
    })
});

app.get('/demos/demo', function(req, res) {
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

/**
 * 对allPosts里面的文章用时间大小进行排序
 */
function postCompare(value1, value2) {
    var time1 = parseInt(value1.date.split('-').join("")),
        time2 = parseInt(value2.date.split('-').join(""));
    if(time1 < time2){
        return -1;
    }else if(time1 > time2) {
        return 1;
    }else {
        return 0
    }
}





/**
 * 将所有的页面生成静态文件，其中运行完后需要运行gulpFile.js将public文件全部加入生成的static文件夹中
 * （是为了挂在github上）
 */
function generateStatic() {
    var staticUrl = './static/';
    if(!fs.existsSync(staticUrl)) {
        fs.mkdirSync(staticUrl)
    }


    //生成index.htmnl
    var content = jade.renderFile('./views/pages/index.jade',{
        allTags: allTags,
        posts: allPosts.slice(0,6),
        page: 1,
        pageURL: '/pages/',
        length: Math.ceil(allPosts.length/6),
        pretty: true
    });
    fs.writeFileSync(staticUrl + '/index.html', content);


    //生成pages文件和里面的静态文件
    var pagesUrl = staticUrl + 'pages/';
    if(!fs.existsSync(pagesUrl)) {
        fs.mkdirSync(pagesUrl)
    }
    for(var i= 1,len=Math.ceil(allPosts.length/6); i<=len; i++) {
        content = jade.renderFile('./views/pages/index.jade',{
            allTags: allTags,
            posts: allPosts.slice(6*(parseInt(i)-1),6*parseInt(i)),
            page: i,
            pageURL: '/pages/',
            length: Math.ceil(allPosts.length/6),
            pretty: true
        });

        fs.writeFileSync(pagesUrl + i + '.html', content);
    }


    //生成posts文件和里面的静态文件
    var postsUrl = staticUrl + 'posts/';
    if(!fs.existsSync(postsUrl)) {
        fs.mkdirSync(postsUrl);
    }
    allPosts.forEach(function(item) {
        var fileName = "./views/posts/" +item.name,
            htmlContent = null;
        fs.readFileAsync(fileName, 'utf-8')
            .then(function(fileData) {
                htmlContent = markdown.toHTML(fileData).split("%metaEnd%")[1];  //将markdown-meta分割走，获取正文
                content = jade.renderFile('./views/pages/post.jade', {
                    htmlContent: htmlContent,
                    pretty: true
                });
                fs.writeFileSync(postsUrl + item.name + '.html', content);
            })
            .catch(function(err) {
                console.log(err);
            });
    });


    //生成tags文件和里面的静态文件
    var tagsUrl = staticUrl + 'tags/';
    if(!fs.existsSync(tagsUrl)) {
        fs.mkdirSync(tagsUrl);
    }
    allTags.forEach(function(item) {
        var tagsNameUrl = tagsUrl + item;
        tag_posts = allPosts.filter(function(postItem) {
            if(postItem.tags.indexOf(item) !== -1) {
                return postItem
            }
        });

        content = jade.renderFile('./views/pages/index.jade', {
            allTags: allTags,
            posts: tag_posts.slice(0,6),
            page: 1,
            pageURL: "/tags/"+item+"/",
            length: Math.ceil(tag_posts.length/6),
            pretty: true
        });

        fs.writeFileSync(tagsNameUrl + '.html', content);

        if(!fs.existsSync(tagsNameUrl)) {
            fs.mkdirSync(tagsNameUrl);
        }

        for(var i= 1,len=Math.ceil(tag_posts.length/6); i<=len; i++) {
            content = jade.renderFile('./views/pages/index.jade', {
                allTags: allTags,
                posts: tag_posts.slice(6*(parseInt(i)-1),6*parseInt(i)),
                page: i,
                pageURL: "/tags/"+item+"/",
                length: Math.ceil(tag_posts.length/6),
                pretty: true
            });

            fs.writeFileSync(tagsNameUrl + "/" + i + ".html", content);
        }
    });


    //生成demo文件和里面的静态文件
    var demoUrl = staticUrl + 'demos/';
    if(!fs.existsSync(demoUrl)) {
        fs.mkdirSync(demoUrl);
    }
    content = jade.renderFile('./views/pages/demo.jade',{pretty: true});
    fs.writeFileSync(demoUrl + "demo.html", content);

    console.log("generate static files");
}

