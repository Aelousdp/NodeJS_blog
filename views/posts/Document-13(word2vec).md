<!--title: 学习sklearn之文本特征选择-->
<!--date: 2016-09-26-->
<!--tags: Machine Learning-->
<!--abstract: 如题-->


%metaEnd%

##学习sklearn之文本特征选择


首先，不管什么工具，就单单来看文本特征选择的过程

###特征选择

1. 以正面情感语料为例，生成类似如下格式：

		pos_data:
		{
			'word1': word1_num,
			'word2': word2_num,
			 ...
			'wordn': wordn_num
		}

	其中word是提取出来的特征，它可以是单个词，也可以是按照某种规则生成的。而num则是word出现的次数。

2. 接着选择特征提取方法（词频，信息增益，CHI，互信息等）对上面的每一个特征进行计算，生成如下：

		pos_data:
		{
			'word1': word1_feature_value,
			'word2': word2_feature_value,
			 ...
			'wordn': wordn_feature_value
		}
	
	其中feature_value是计算出来的每个特征的对应值

3. 自己定特征数目m```(m<n)```，按照上一步算出来的feature_value来进行大小排序，筛选出前m个特征，如下：

		best_pos_data:
		{
			'word1': word1_feature_value,
			'word2': word2_feature_value,
			 ...
			'wordm': wordn_feature_value
		}
	
	**注：** 这个```word_feature_value```之后就没有什么意义了，它只是用来进行大小排序选取特征而已。有用的只有那些被选出来的特征，即```word```。
	
搞清楚了特征选择是想干嘛后，接着就开始看sklean工具
	
###sklearn.feature_selection 

首先可以看[官方说明](http://scikit-learn.org/stable/modules/feature_selection.html#feature-selection)，里面提供特征选择的方法很多，可是在我所需要面对的文本处理问题中，信息增益，互信息，期望交叉熵这些特征选择方法好像都没有提供，只在Univariate feature selection（ 单变量特征选择 ）中提供了一个```chi2```的方法。

其他的特征选择由于水平有限就不在这误人子弟了，只看Univariate feature selection的例程，如下：

	from sklearn.datasets import load_iris
	from sklearn.feature_selection import SelectKBest
	from sklearn.feature_selection import chi2

	iris = load_iris()	
	X, y = iris.data, iris.target
	X.shape		#（150 4）
	X_new = SelectKBest(chi2, k=2).fit_transform(X, y)
	X_new.shape		#(150, 2)

关于```iris```已经在之前的[学习sklearn之朴素贝叶斯](#)中已经很明确的提过了，这里就不再理会。

上面的例程重点是在```SelectKBest(chi2, k=2)```中，在[说明](http://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectKBest.html#sklearn.feature_selection.SelectKBest)中很清楚的写了，```SelectKBest()```接收两个参数，第一个参数是计算特征的分数的方法，第二个参数则是保留几个特征值。

最后选择出来的特征就可以进行特征权值计算了。

（完）


	