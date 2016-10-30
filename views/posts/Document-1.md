<!--title: 第一篇-->
<!--date: 2016-04-26-->
<!--tags: blog， flask-->
<!--abstract: 作为博客的第一篇文章，就总结一下博客的搭建过程,该博客使用python以及flask框架，支持markdown写作...（注：这篇文章已经作废，因为博客系统重新更新，已不再是下面文章所写的方式。）-->


%metaEnd%

##第一篇


>**注**：这篇文章已经作废，因为博客系统重新更新，已不再是下面文章所写的方式。以前用python Flask搭建的博客（源码已删）现在改成NodeJs搭建，[源码在此]()。

###前言

运用flask框架初步搭建了这个博客，以后将会把学习到的知识每隔一段时间总结一下，同时也是监督自己学习的一种手段。


###正文
**作为博客的第一篇文章，就总结一下博客的搭建过程**

####1. flask框架
本来看见github pages支持以[Jekyll](http://jekyll.bootcss.com/)为博客框架的搭建，所以刚开始的时候我也是使用Jekyll为工具。搭建成功后，发现没学到什么，全部后台的配置都是现成的，也不知道怎么去改。在一想想作为学习前端的我为什么不能自己搭建一个呢，正巧赶上学习了几个月的python，所以最后选择了[flask](http://flask.pocoo.org/)框架。

通过看官方的介绍，看不懂的地方对照一下[flask的中文网](http://flask123.sinaapp.com/)。对了，在此还要感谢极客学院关于flask的基础[教学视频](http://www.jikexueyuan.com/course/943.html)。前前后后也没花什么时间，就感觉flask挺好用的。

####2. 前端页面
自己也算自学了前端一定时间了（怎么感觉好像学的都和导师要我干的不相关），这次有点偷懒就直接采用了[bootstrap](http://v3.bootcss.com/)搭建。其实也还好，框架写出来了本来就是给人用的，也算不上偷懒。

####3. 支持markdown
python库多就是好呀，上网搜搜就找到了[Flask-FlatPages](https://pythonhosted.org/Flask-FlatPages/)，这样本来还有点纠结的我一下就开心了。之前看别人好多flask博客都还建立数据库，博客都是在数据库上一篇篇上传的，感觉好麻烦，这方面一点都不如Jekyll了。我就想怎么可能没有解决办法，哈哈。

Flask-FlatPages的官方文档也说得很清晰

	from flask import Flask
	from flask_flatpages import FlatPages
	
	app = Flask(__name__)
	app.config.from_pyfile('mysettings.cfg')
	pages = FlatPages(app)

定义代码很简单吧

###结尾

其实，本博客还有许多地方不够完善，例如代码高亮，评论系统等，我会在后续的日子里逐步改进。改进就是学习嘛，嘿嘿

