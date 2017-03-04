<!--title: 学习和使用git-->
<!--date: 2016-10-30-->
<!--tags: git-->
<!--abstract: 之前上传和克隆代码到github总是使用的github提供给window用户的可视化工具，现在觉得有些不妥。无论怎么样，使用命令行操作才是符合一个努力学习积极向上的准程序员身份，因此git学习流程就开始了。-->

%metaEnd%

##学习和使用git

###前言


之前上传和克隆代码到github总是使用的github提供给window用户的可视化工具，现在觉得有些不妥。无论怎么样，使用命令行操作才是符合一个努力学习积极向上的准程序员身份，因此git学习流程就开始了。

###git基本操作

####1. 首先当然是克隆仓库了

	# 进入所要存放仓库的文件夹，然后...
	git clone 仓库地址

####2. 设置用户名和邮箱

    最好是全局设置，一劳永逸

	# 进入所克隆的仓库文件中，然后...
	git config --global user.name "yourName"
	git config --global user.email "yourEmail"

####3. 理解git的三个区
	
- 工作区
- 暂存区： 起到过渡作用，避免误操作，保护工作区和版本区
- 版本区


        # 查看工作区的状态
        git status

我克隆的是一个新的仓库，里面很干净，什么都没有。这时候向其中添加内容，然后...

    git status

会发现系统提示了主分支（master）里面已经添加了部分文件,**注意**这时候这些文件全部都是存放在工作区中，接下来可以将这些文件从工作区提交到暂存区。

    # 可以单独添加某个文件
    git add app.js

    # 可以全部都提交
    git add .

如果是在工作区修改了之前已提交到暂存区的文件，那么在修改后需要再次执行一次```git add  fileName```，将工作区修改的文件提交到暂存区并覆盖原文件。

最后把暂存区里面的文件提交到版本区。

    # 下面代码中的“update”为注释，下同
    git commit -m "update"

    # 也可以一步到位，直接从工作区到版本区
    git commit -a -m "update"

    # 可以查看所有的版本
    git log

    # 可以为提交的版本打标签，tagNum为标签号
    git tag tagNum
    # 解释： 如果不加tagNum则可以查看已打好的标签


####4. 一些有用的命令

- 对比命令：

		# 工作区与暂存区之间的不同对比
		git diff 

		# 暂存区与版本区之间的不同对比
		git diff --cached(--staged)
		
		# 工作区与版本区之间的不同对比, master为主分支，也可以写其他分支名
		git diff master

- 撤销命令：
	
		# 撤销工作区对暂存区的提交操作，fileName为提交的文件
		git reset HEAD fileName
		# 解释： 当从工作区误提交了文件到暂存区，那么可以用以上命令还原。

		# 撤销工作区的修改，fileName为想还原文件
		git checkout --fileName
		# 解释： 当工作区的修改不满意，想还原为暂存区的文件则用上面命令，如果暂存区没有该文件，那么则还原为版本区的该文件。

		# 撤销上次暂存区到版本区的提交，合并到这次提交
		git commit -m "update" --amend
		# 解释： 撤销上一次的提交，包括它的注释，将它重新和现在暂存区里面的文件一起提交，只保留这一次的注释。

- 删除命令：
	
		# 删除暂存区里的文件
		git rm fileName
		# 解释： 工作区的fileName文件已经被删掉了，那么就可以执行上面命令删除暂存区里面的fileName文件。如果工作区里面的fileName文件没有删掉，那么上述命令会报错。

		git rm -f fileName
		# 解释： 当工作区和暂存区里面都有fileName文件时，上述命令可以一起删除。

		git rm --cached fileName
		# 解释： 当工作区和暂存区里面都有fileName文件时，仅仅只删除暂存区里面的fileName文件

- 恢复命令：

		# 恢复工作区误删的文件
		git checkout 版本号 fileName
		# 解释： 通过git log 可以查看版本记录，有每次操作的版本号，即可以通过上述命令恢复某个版本的文件
		
		git reset --hard 版本号
		# 解释： 工作区恢复到某个版本的状况
		git reset --hard HEAD^
		# 解释： 工作区恢复到上一个版本的状况，HEAD是版本区的头指针
		git reset --hard HEAD~num
		# 解释： 工作区恢复到前num个版本的状况

		# 查看所有的操作
		git reflog
		# 解释： 恢复到前N个版本后，git log 已经看不到最新的版本了，就可以通过上述命令查看到所有的commit_id再恢复到最新的版本

- 设置别名

		# 给命令操作设置别名，其中newName为别名，trueName为真实的命令
		git config --global alias.newName trueName
		# 例 git config --global alias.co checkout
			
####5. 同步到远程仓库

	# 查看远程仓库的名字	
	git remote
	# 默认为origin
	
	# 查看远程仓库的链接
	git remote -v

	# 同步到远程仓库
	git push origin master
	# 解释： 上述代码是将master分支传入远程仓库，也可以同步其他分支，也可以是标签号

####6. 多人协作

多人协作需要项目创始人给与参加开发的权限，但是很容易出现冲突

例： 当别人对远程仓库的某个文件做了修改，而自己不知道，同样对这个文件做了修改并且上同步到远程仓库，这时候同步出错。

那么这时候就可以先从远端仓库同步下来代码

方法一：

	# 不是克隆，是从远端仓库同步下来代码，不与自己工作区代码合并
	git fetch
		
	# 对比不同
	git diff master origin/master

	# 合并
	git merge origin/master
	# 解释： 合并的文件上面会有显示冲突的代码，并不是删除了某个冲突代码，是同时都存在，这时候需要人为考虑怎么处理冲突代码。

方法二： 

	#不管代码冲突是什么，直接同步下来代替自己工作区的代码
	git pull

####7. 开源项目协作

这种情况是获得不到项目的开发权限的，那么只能通过```fork```先将项目代码链接到自己的仓库，然后修改后通过```pull request```，将自己的代码发给有项目开发权限的用户。

####8. 分支操作

分支操作其实一般属于多人协作里面涉及到的内容，但是由于分支操作比较重要，于是单独拿出来说明。
	
	# 查看所有的分支
	git branch

	# 创建分支, newBranch为创建的分支名，下同
	git branch newBranch

	# 切换分支
	git checkout newBranch

	# 创建并切换到新分支
	git checkout -b newBranch

**注**： 在分支中操作不影响其他分支，比如有主分支master，和其他两个分支new1与new2。如果这时候他们都指向最新版本```v2```，此时在new1分支上进行版本操作并提交，那么new1指向版本```v3```，可主分支和new2仍然停留在版本```v2```。

	# 合并分支
	git merge newBranch
	# 解释： 将newBranch这一个分支和主分支合并

	# 查看合并的分支
	git branch --merge
	# 解释： 有可能会出现冲突，需要手动解决合并后文件的冲突

	# 查看没有合并的分支
	git branch --no-merge

	# 删除已经合并后的分支，无法直接删除没有合并的分支
	git branch -d newBranch

	# 强制删除没有合并的分支
	git branch -D newBranch


### 参考链接

	
[http://git.oschina.net/progit/](http://git.oschina.net/progit/)
[http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)


（完）