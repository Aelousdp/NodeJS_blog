<!--title: 学习sklearn之朴素贝叶斯-->
<!--date: 2016-09-22-->
<!--tags: Machine Learning-->
<!--abstract: 学习了大半年的自然语言处理了，自己也陆陆续续的实现了一些机器学习算法，还有分词算法。一开始的时候还很开心，到后来发现，算法越学越复杂，自己实现的越来越困难，愁人的是程序的效果往往还不如开源包自带的效果好。 心态从一开始决定所有效果实现都用自己编的的程序来跑，到现在想了想还是太傻太天真。开源库这种东西，真是需要学习的。-->


%metaEnd%


##学习sklearn之朴素贝叶斯

>学习了大半年的自然语言处理了，自己也陆陆续续的实现了一些机器学习算法，还有分词算法。一开始的时候还很开心，到后来发现，算法越学越复杂，自己实现的越来越困难，愁人的是程序的效果往往还不如开源包自带的效果好。 心态从一开始决定所有效果实现都用自己编的的程序来跑，到现在想了想还是太傻太天真。开源库这种东西，真是需要学习的。


通过scikit-learn官网[API说明](http://scikit-learn.org/stable/modules/naive_bayes.html#gaussian-naive-bayes)可以看到，sklearn将贝叶斯的三个常用模型都封装好了，分别是：高斯贝叶斯（Gaussian Naive Bayes）、多项式贝叶斯（Multinomial Naive Bayes）、伯努利贝叶斯（Bernoulli Naive Bayes）。接着就可以学习它所给出的例程了。

###高斯贝叶斯

高斯贝叶斯一般适用于样本分布符合或者类似高斯分布的时候使用

首先直接看例程

	from sklearn import datasets
	iris = datasets.load_iris()
	from sklearn.naive_bayes import GaussianNB
	gnb = GaussianNB()
	y_pred = gnb.fit(iris.data, iris.target).predict(iris.data)
	print("Number of mislabeled points out of a total %d points : %d" % (iris.data.shape[0],(iris.target != y_pred).sum()))

首先是从数据集里面加载了iris，通过查看```load_iris()```函数说明和iris.csv文件，可以知道iris的具体结构。

iris.csv文件有5列，前4列是数据，后一列是分类的标签（共分为3类分别是0，1，2）。数据共有150行（除去头行）。所以读入的数据就是就150个样本，每个样本是4维数据。因此```iris.data```就是一个150X4的数据集，```iris.target```则是150个样本的分类。

所以上面的例程就应该是利用```iris.data```来训练后，然后又用```iris.data```来测试了一下。

可以看一下```iris.data```和```iris.target```的数据格式，如下。只要满足这种数据格式，我们就可以使用这个高斯贝叶斯预测了。
	
	iris.data
	[[ 5.1  3.5  1.4  0.2]
 	 [ 4.9  3.   1.4  0.2]
 	 [ 4.7  3.2  1.3  0.2]
			......
	 [ 6.5  3.   5.2  2. ]
 	 [ 6.2  3.4  5.4  2.3]
	 [ 5.9  3.   5.1  1.8]]

	iris.target
	[0 0 0 ... 1 1 1 ... 2 2 2]

###多项式贝叶斯

多项式贝叶斯一般适用于样本分布符合或者类似多项式分布的时候使用。而我所需要做的自然语言处理就可以使用它了，这一点[官方的介绍](http://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html#sklearn.naive_bayes.MultinomialNB)说的也很明白。

	sklearn.naive_bayes.MultinomialNB(alpha=1.0, fit_prior=True, class_prior=None)

其中```alpha```默认为1，也就是为了概率不为0所以在计算概率时候的加1平滑。当然也可以设置为其他的加法平滑。这个地方应该就是只能设置0或0以上的数字了，而不支持其他的平滑方法。

然后```fit_prior```表示是否设置先验概率分布，不设置的话就是默认为均匀概率分布。设置的话，就是用```class_prior```设置。

然后上例程
	
	import numpy as np
	X = np.random.randint(5, size=(6, 100))
	y = np.array([1, 2, 3, 4, 5, 6])
	from sklearn.naive_bayes import MultinomialNB
	clf = MultinomialNB()
	clf.fit(X, y)
	#MultinomialNB(alpha=1.0, class_prior=None, fit_prior=True)
	print(clf.predict(X[2:3])) 	#返回[3]

其实这个例程也写得不能再简单了，```MultinomialNB```下明明还有那么多方法，都没有体现。我也就挑几个能估计用的着的看看：

1. partial_fit(X,y[,classes,sample_weight]) 这个是接着往分类器里面添加训练的数据。然后里面的classes是第一次使用的时候写的，必须给出所有的分类的标签。
	
	比如

		X = np.random.randint(5, size=(6, 100))
		clf = MultinomialNB()
		clf.partial_fit(X[0:4], [1,2,3,4], [1,2,3,4,5,6])
		clf.partial_fit(X[4:6], [5,6])
		MultinomialNB(alpha=1.0, class_prior=None, fit_prior=True)
		print(clf.predict(X[4])) #返回[5]

2. ```predict```和```predict_proba```和```predict_log_proba```

	其中```predict(X)```返回的是X所属的标签，也就是它所在的分类，按照上面的程序跑，返回的就是[1,2,3,4,5,6]

	而```predict_proba(X)```返回的是概率矩阵，按照上面的程序跑，返回的就是一个6X6的概率矩阵，如下。其中每一行表示这一行分别属于每一个分类的概率。```predict_log_proba```同理。

		[[  1.00000000e+00   3.77364413e-32   5.42786977e-36   1.27573446e-36    1.09505176e-44   3.44600876e-37]
		 [  7.10789524e-31   1.00000000e+00   2.36744637e-30   3.75965666e-39    2.08287851e-33   1.12070267e-44]
		 [  4.66785947e-33   4.37601738e-28   1.00000000e+00   3.10923179e-39    1.88317948e-35   3.79484891e-40]
		 [  8.51196240e-35   1.81654017e-39   1.00137233e-40   1.00000000e+00    9.16105845e-38   8.20956030e-38]
		 [  7.01037769e-40   8.69748797e-32   9.16372802e-35   1.22680390e-37    1.00000000e+00   2.84794014e-34]
		 [  1.46623239e-34   1.35536535e-43   2.33153995e-40   1.27341511e-37    1.27833967e-38   1.00000000e+00]]

###伯努利贝叶斯

伯努利贝叶斯和多项式贝叶斯其实很类似，他们的不同之处用文本分类问题很好说明：多项是贝叶斯是以单词为颗粒度来进行文本分类，而伯努利贝叶斯是以文本为颗粒度来进行文本分类。

这一点斯坦福NLP作业上说的很明白，这个是关于[多项式贝叶斯](http://nlp.stanford.edu/IR-book/html/htmledition/naive-bayes-text-classification-1.html)，而这个是关于[伯努利贝叶斯](http://nlp.stanford.edu/IR-book/html/htmledition/the-bernoulli-model-1.html)。
同样是这个题目：

<p style="TEXT-ALIGN: center" contentEditable=true><img src="http://cezrh.img48.wal8.com/img48/544629_20160502104557/147454324766.png" /><br /></p>

在多项式贝叶斯中，是以词频为计数：

	P(c)= c类别下单词总数/整个训练样本的单词总数
	
	P(t|c)=(c类别下单词t在各个文档中出现过的次数之和+1)/(c类别下单词总数+|V|)

	#其中 +1 是属于加法平滑，也就是拉普拉斯平滑，|V|是所有不同的词的个数

所以在上表yes分类，Chinese的个数是5个，所以
	
	P(t=Chinese|c) = （Chinese的个数+1）/（yes类别下所有词的个数 + 6）

在伯努利贝叶斯中，是以文本为单位，以0，1为特征计数，不考虑词频：

	P(c)= c类别下文件总数/整个训练样本的文件总数
	P(t|c)=(c类别下单词t的文件数+1)/(c类别下单词总数+2)

对于特征Chinese，上表yes分类中文档一中有Chinese，所以记为1。同理，文档二文档三都记为1，所以

	P(t=Chinese|c) = （3+1）/（3+2）

好了，接着回到sklearn：

	sklearn.naive_bayes.BernoulliNB(alpha=1.0, binarize=0.0, fit_prior=True, class_prior=None)

和多项式贝叶斯对比，多了一个```binarize```阈值的设定，其余感觉都很相似，就连例程也都一样，这里就不再赘述了。
