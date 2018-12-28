import os
import sys
import traceback


# 将爬取的信息写入文件
def write_txt(blogger):
    try:
        if blogger.filter:
            result_header = u"\n\n原创微博内容\n"
        else:
            result_header = u"\n\n微博内容\n"
        result = (u"用户信息\n用户昵称: " + blogger.username +
                  u"\n用户id: " + str(blogger.user_id) +
                  u"\n微博数: " + str(blogger.weibo_num) +
                  u"\n关注数: " + str(blogger.following) +
                  u"\n粉丝数: " + str(blogger.followers) +
                  result_header
                  )
        for i in range(1, blogger.weibo_num2 + 1):
            text = (str(i) + ":" + blogger.weibo_content[i - 1] + "\n" +
                    u"微博位置: " + blogger.weibo_place[i - 1] + "\n" +
                    u"发布时间: " + blogger.publish_time[i - 1] + "\n" +
                    u"点赞数: " + str(blogger.up_num[i - 1]) +
                    u"	 转发数: " + str(blogger.retweet_num[i - 1]) +
                    u"	 评论数: " + str(blogger.comment_num[i - 1]) + "\n" +
                    u"发布工具: " + blogger.publish_tool[i - 1] + "\n\n"
                    )
            result = result + text
        file_dir = os.path.split(os.path.realpath(__file__))[0] + os.sep + "..\weibo"
        print(file_dir)
        if not os.path.isdir(file_dir):
            os.mkdir(file_dir)
        file_path = (file_dir + os.sep + "%d" % blogger.user_id + ".txt")
        f = open(file_path, "wb")
        f.write(result.encode(sys.stdout.encoding))
        f.close()
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()
