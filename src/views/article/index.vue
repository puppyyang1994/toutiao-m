<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->
      <!-- 当文章数据请求完成后 再渲染 -->
      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- <follow-user
            class="follow-btn"
            :is-followed="article.is_followed"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed"
          /> -->
          <!-- 如果传给子组件的数据 既要用 又要改 则可以使用v-model语法糖 -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <!-- 把Markdown的样式加载给正文 -->
        <!-- 通过div找到图片DOM -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <!-- 来父组件中监听子组件的自定义事件 -->
        <common-list
          :list="commentList"
          :source="article.art_id"
          @onload-success="totalCommentCount === $event.total_count"
          @reply-click="onReplyClick"
        ></common-list>
        <!-- 注意这里的$event 是子组件传过来的参数 data.data -->
        <!-- /评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            @click="isPostShow = true"
            class="comment-btn"
            type="default"
            round
            size="small"
            >写评论
          </van-button>
          <!-- badge 显示有几条评论 -->
          <!-- 在父组件中使用子组件data中的数据  那个total_count -->
          <!-- 先在父组件中 声明一个数据 帮给badge -->
          <van-icon
            class="comment-icon"
            name="comment-o"
            :badge="totalCommentCount"
          />
          <!-- <van-button class="btn-item" icon="star-o" /> -->
          <!-- 子组件 既要用又要改  所以就是用v-model=article.is_collected -->
          <collect-article
            class="btn-item"
            :article-id="article.art_id"
            v-model="article.is_collected"
          />
          <!-- 点赞文章 -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>

          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹出层 -->

        <van-popup v-model="isPostShow" position="bottom">
          <!-- 因为有可能是评论的id 也有可能是文章的id 所以命名成target 而不是 article-id -->
          <comment-post
            @post-success="onPostSuccess($event)"
            :target="article.art_id"
          />
        </van-popup>
        <!-- /评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="err_status === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      get-container="body"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- <comment-reply :comment="currentComment" @close="isReplyShow = false" /> -->
      <comment-reply :comment="currentComment" v-if="isReplyShow" />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/FollowUser/index.vue'
import CollectArticle from '@/components/CollectArticle/collect-article.vue'
import LikeArticle from '@/components/LikeArticle/like-article.vue'
import CommonList from './components/common-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'

export default {
  // 组件名称
  name: 'ArticleIndex',
  // 局部注册的组件
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommonList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件提供数据  因为组件们几乎都用到了id这个数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  // 通过props获取路由参数
  props: {
    articleId: {
      // 可能是字符串也可能是数字
      // 直接从item列表点进来的是数字
      // 但如果直接复制路径 就是字符串
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      article: {}, //文章详情
      loading: true, //加载中的loading状态
      err_status: 0, //失败404状态码
      followLoading: false,
      totalCommentCount: 0, //在父组件中先声明一个数据 绑给badge
      isPostShow: false, //发布评论的显示状态
      commentList: [], //评论列表
      isReplyShow: false, //控制展示回复弹层的显示状态
      currentComment: {} //点击回复的那个评论项
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created() {
    this.loadArticle()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadArticle() {
      this.loading = true //展示loading加载
      try {
        const { data } = await getArticleById(this.articleId)
        // 模拟失败的效果
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdhvnkifdigjigj')
        // }
        this.article = data.data

        // 请求成功后 初始化图片 点击预览
        // 数据驱动视图 不是立即的
        // console.log(this.$refs['article-content'])
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.err_status = 404
        }
        console.log('获取数据失败', error)
      }
      this.loading = false //无论成功还是失败 都需要关闭loading
    },
    previewImage() {
      // 得到所有的img节点地址
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个img注册点击事件 在处理函数中调用预览图片方法
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置 从0开始
            startPosition: index
          })
        }
      })
    },
    // 子组件传来的数据对象
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
      this.totalCommentCount++ //将评论数加1
    },
    onReplyClick(comment) {
      // 将子组件传递过来的comment对象 给当前comment对象
      console.log(comment)
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
// 引入Markdown样式
@import './raw.githubusercontent.com_sindresorhus_github-markdown-css_main_github-markdown.css';
.article-container {
  /deep/ .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 20px;
      padding: 25px 16px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 9px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 12px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }

    .article-content {
      padding: 35px 16px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 80px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    z-index: 1;
    position: relative;
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/ .van-icon {
      font-size: 61px;
      color: #b4b4b4;
    }
    .text {
      font-size: 15px;
      color: #666666;
      margin: 17px 0 23px;
    }
    .retry-btn {
      width: 140px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #c3c3c3;
      font-size: 15px;
      color: #666666;
    }
  }

  /deep/ .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 2px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      top: 1px;
      color: #777;
      .van-info {
        font-size: 8px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 20px;
      line-height: 20px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
