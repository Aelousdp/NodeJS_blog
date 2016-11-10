<!--title: 学习sklearn之文本特征提取-->
<!--date: 2016-09-28-->
<!--tags: Machine Learning-->
<!--abstract: 上次总结了文本特征的选择，这次来看看提取。-->

%metaEnd%

##学习sklearn之文本特征提取

> 2016.9.27

有关特征的提取，scikit-learn给出了很多方法，具体分成了图片特征提取和文本特征提取。文本特征提取的接口是```sklearn.feature_extraction.text```，那么接下来学习里面封装的函数。

### CountVectorizer 

先看[官方说明](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html#sklearn.feature_extraction.text.CountVectorizer)，发现```CountVectorizer()```的配置参数多的吓人，幸好在[例程页面](http://scikit-learn.org/stable/modules/feature_extraction.html#common-vectorizer-usage)有提到很多的参数的默认设置已经设置的很好了，不需要怎么改动。 

那么就先看例程
	
	from sklearn.feature_extraction.text import CountVectorizer

	vectorizer = CountVectorizer(min_df=1)

	corpus = [
     			'This is the first document.',
	    		'This is the second second document.',
	    		'And the third one.',
    			'Is this the first document?',
			]
	X = vectorizer.fit_transform(corpus)
	feature_name = vectorizer.get_feature_names()

	print feature_name
	print X.toarray()

程序的结果为

	[u'and', u'document', u'first', u'is', u'one', u'second', u'the', u'third', u'this']
	[[0 1 1 1 0 0 1 0 1]
	 [0 1 0 1 0 2 1 0 1]
	 [1 0 0 0 1 0 1 1 0]
	 [0 1 1 1 0 0 1 0 1]]

可见程序将corpus生成了一个字典，如feature_name，而X则是把corpus里面的每一行根据字典生成了词频向量。

如果将其用来作用于汉语语料的时候，需要配置一下```token_pattern```参数，因为默认的```token_pattern```参数会过滤掉只有一个字符长度的词。如下：
	
	vectorizer = CountVectorizer(min_df=1)

	corpus = [
				'I am a boy'，
				u'我 爱 北京 天安门'
			]
	X = vectorizer.fit_transform(corpus)
	feature_name = vectorizer.get_feature_names()

	print feature_name
	
	//结果是：[u'am', u'boy', u'\u5317\u4eac', u'\u5929\u5b89\u95e8']
	//自动将‘I，a，我，爱’这些单个长度的词过滤掉了

在英文中单个长度的词往往属于停用词范围，所以过滤掉属于默认设置，对结果影响不大。可是在中文文本处理中，有一些单个长度的词，比如“爱”，“恨”都有着很明显的感情色彩。如果在做情感分析中，这些信息都十分重要。

为了不过滤单个词可以设置

	vectorizer = CountVectorizer(min_df=1, token_pattern='(?u)\\b\\w+\\b')

上面提取的特征全部都是单个词，同样可以提取连词，如下：

	bigram_vectorizer = CountVectorizer(ngram_range=(1, 2), token_pattern=r'(?u)\b\w+\b', min_df=1)
	analyze = bigram_vectorizer.build_analyzer()
	for f in analyze('我 爱 北京 天安门'):
		print f

	//结果是：	 我
				爱
				北京
				天安门
				我 爱
				爱 北京
				北京 天安门
	
至于还有很多参数的配置，比如去除停用词这些，具体需要就具体看文档配置。

### TfidfTransformer和TfidfVectorizer

具体来说，```TfidfTransformer```的作用已经不是在特征提取了，而是特征加权。
而文本特征权重的计算方法有许多，scikit-learn貌似也只提供了TF-TDF这一种。

关于```TfidfTransformer```给出的例程尤其简单，这里就不进行讲述。

而```TfidfVectorizer```则是```CountVectorizer```和```TfidfTransformer```的结合版本。

一般在文本特征处理过程中，本来正常的流程就是先用```CountVectorizer```来提取特征，然后就用```TfidfTransformer```来计算特征的权重。而```TfidfVectorizer```则是把两者的功能合在一起，连参数也都是两者的参数合在一起，所以可以方便的直接使用```TfidfVectorizer```。但是如果想在```CountVectorizer```来提取特征后想处理特征，比如降维之类的，这样直接使用```TfidfVectorizer```就不行了。关于文本特征的选择处理在博客[学习sklearn之文本特征选择](#)中有说明。

(完)
