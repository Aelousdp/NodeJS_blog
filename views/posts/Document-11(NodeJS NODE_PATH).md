<!--title: 解决NodeJS中Cannot find module的问题-->
<!--date: 2016-09-18-->
<!--tags: NodeJS-->
<!--abstract: 最近开始学习NodeJS，在最最基本的require('module')的时候就遇到了问题，本来以为上网一查就可以分分钟解决，没想到花了自己一上午的时间。其实过程很简单，自己总结一下。-->

%metaEnd%

##解决NodeJS中Cannot find module的问题


最近开始学习NodeJS，在最最基本的require('module')的时候就遇到了问题，本来以为上网一查就可以分分钟解决，没想到花了自己一上午的时间。其实过程很简单，自己总结一下。

###npm全局安装地址
我是在`require('cheerio')`的时候系统报的错，由于安装的时候是全局安装，所以上网知道了怎么查全局安装的地址,在cmd里面敲下面的代码就可以了。
	
	npm root -g
	// 显示的是 C:\Users\Administrator\AppData\Roaming\npm

然后是查一查require搜索模块时的搜索路径（在node环境下）

![](http://cezrh.img48.wal8.com/img48/544629_20160502104557/147402798177.png)

发现require查询模块路径和npm全局安装地址不一样，这个就是Cannot find module的原因。

###解决办法
最开始的时候，我以为按照`global.module.paths`给出的路径里面的地址，我照着建一个一样地址文件夹，然后把模块安装到里面就可以了，结果发现没啥用，原因我也不知道。

最后还是上网找到了其他的办法，就是设置NODE_PATH环境变量，值设置为npm全局安装地址。

**注意**：不是在环境变量path里面编辑哦，是自己新建一个NODE_PATH环境变量。然后记住：注销或重启后生效。（我就是在这个坑里面躺了好久，以为设置环境变量不起作用）

###更改npm全局安装地址

如果想改变自己的npm全局安装地址的话，可以去你自己nodejs文件夹下面的\node_modules\npm里面找到npmrc文件，更改里面的prefix,比如：
	
	prefix=E:\xxx\xxx 	//路径地址不需要加引号


(完)