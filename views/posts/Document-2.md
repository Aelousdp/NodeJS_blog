<!--title: 如何将github仓库中的项目效果展现在github pages中-->
<!--date: 2016-04-30-->
<!--tags: blog, github-->
<!--abstract: 众所周知github能托管代码，但是代码效果却不能直接展现出来。于是我准备在这个博客的demo中展示我已经完成或者将来将要完成的项目，那么问题来了...-->


%metaEnd%

##如何将github仓库中的项目效果展现在github pages中

###前言
>刚刚做完这个博客的整体框架，然后我想在demo页面中展示我已经完成或者将来将要完成的项目，那么问题来了...。

本来我以为很简单，却发现半天没办法，上网查的说明都很笼统或者零零碎碎，最后花了大半天时间弄明白（目前还不确定是不是一个好的办法 +_+ ），总归也是解决了，现在总结一下。

### 正文

####找到你要展现效果的仓库

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724207.png)

然后点击Settings，在接下来的页面中往下翻，可以看到

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724263.png)

点击Launch automatic page generator,自动生成page页面，往下翻可以看到

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724311.png)

然后点击continue to layouts

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724364.png)

点击publish,就自动发布了。

接着在http://zhangzirui.github.io/learn-from-baidu-ife/就可以访问刚刚发布的页面了。当然zhangzirui和learn-from-baidu-ife要换成你自己的username与仓库名称。网上有的说法是要等十多分钟才能看到，可是我试的时候是立马就能看到了，估计看网速吧，反正出现了404也不要着急，慢慢等着就好。

到了这一步后，我们已经完成了仓库的github pages部署，可是童鞋们可以发现只有这个http://zhangzirui.github.io/learn-from-baidu-ife/页面能看到，而learn-from-baidu-ife仓库下的项目文件还是没办法展现出来，依旧是404。那么我们进行下一步。

####为仓库建立分支

先进入到你定义的存放github仓库的文件中，克隆远程仓库到本地
	
	git clone http://your_url #如下图

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215723962.png)

然后

	cd learn-from-baidu-ife

接着创建并生成分支
	
	git checkout -b gh-pages origin/gh-pages

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724017.png)

然后这个分支里面就存在了http://zhangzirui.github.io/learn-from-baidu-ife/这个页面的样式，咱们这时候需要把它给删除，然后换成自己的。

	git rm -rf .

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724063.png)

删完之后呢，你可以把你这个仓库文件再次下载下来，当然这次就不是分支了，这次下载你需要展示的项目代码，把它放入这个已经被删干净的分支文件夹。（这几步我都是直接在界面上操作的 o(╯□╰)o ）



放进去后呢，接着
	
	git add .
	git commit -m "add files"

然后提交

	git push origin gh-pages

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724153.png)

就OK拉

####查看效果

进入你的github

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215724419.png)

可以看到中间的branches前面变成了2，在第一步刚刚生成pages时，其实这个就变成了2 branches。点击左边的Branch:master,出现下拉列表，就可以选择分支gh-pages。点击之后就可以发现分支文件中就存在了你push上来的项目文件，没push之前这个地方本来存放的是自动生成的页面样式。

其实总体下来，就是在你的仓库中创建一个gh-pages分支，然后把你仓库的文件copy到分支中.

然后就可以看到项目的效果了，我的这个是baidu-ife的小作业
[http://zhangzirui.github.io/learn-from-baidu-ife/spring/task0001/mywork/index.html](http://zhangzirui.github.io/learn-from-baidu-ife/spring/task0001/mywork/index.html)

![](http://cezrh.img47.wal8.com/img47/544629_20160502104557/146215723681.png)

###结尾

怎么样，是不是明白了怎么弄了。

如果本文有错误或者你有更好的办法，你可以在评论或者邮箱(411489774@qq.com)中告诉我。

如果你想转载这篇文章到你博客中，希望你能注明一下此文的博客链接[http://zhangzirui.github.io/pages/Document-1](http://zhangzirui.github.io/pages/Document-1)，谢谢！