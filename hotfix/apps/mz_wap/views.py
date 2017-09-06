# -*- coding: utf-8 -*-
import json
import logging
import datetime
import requests

from django.template import loader, RequestContext
from django.core.cache import cache
from django.conf import settings
from django.db.models.aggregates import Sum
from django.http.response import Http404, JsonResponse, HttpResponse
from django.core.urlresolvers import reverse
from django.shortcuts import render, get_object_or_404, redirect
from django.template.loader import render_to_string
from django.views.decorators.http import require_safe, require_GET, require_POST
from django.contrib.auth.decorators import login_required

from core.common.utils import validators
from mz_common.decorators import student_required
from mz_course.models import Course, CareerCourse, Class, ShowStage, StudentProjectImage
from mz_lps4.class_dict import NORMAL_CLASS_DICT
from mz_user.models import UserProfile
from mz_usercenter.student.interface_order import get_user_orders, is_pay_user
from mz_wap.functions import set_callback_url, judge_none, list_judge_none, calc_course_video_length, \
    get_current_url
import db.api.course.career_course_intro
import db.api.course.career_course_pay
import db.api.course.course_stage
import db.api.course.course
import db.api.course.lesson
import db.api.course.career
import db.api.course.career_course
import db.api.teacher.employ_teacher
import db.api.user.user
import db.api.article.article
import db.api.common.new_discuss_post
import db.api.common.seo
import db.api.course.tag
import db.api.course.page_name_seo
import db.api.course.catagory
import db.api.course.keyword
import db.api.search.fulltext_search
import db.api.wiki.wiki
import db.api.common.homepage
from db.api.common.app import app_user_class_type
from mz_common.functions import safe_int
from mz_wap.functions import safe_api_result

from utils.tool import get_param_by_request
from mz_common.captcha_functions import verify_captcha_code
from mz_common.functions import paginater
from utils.logger import logger as log
from core.common.http.response import success_json, failed_json
from mz_homepage.search import search_api as new_search_api

logger = logging.getLogger('mz_wap.views')

GOLD_TEACHER = {20365: 'mz_wap/teacherIntroduceAndroid.html',
                3287: 'mz_wap/teacherIntroduceUi.html',
                3472: 'mz_wap/teacherIntroducePython.html',
                4130: 'mz_wap/teacherIntroduceIos.html',
                # 40986: 'mz_wap/teacherIntroduceIos.html',
                48129: 'mz_wap/teacherIntroducePhp.html',
                4: 'mz_wap/teacherIntroduceLinux.html',
                136574: 'mz_wap/teacherIntroduceQrs.html',
                36413: 'mz_wap/teacherIntroduceTe.html',
                684: 'mz_wap/teacherIntroduceAndroid2.html'}


@require_safe
def index_front(request):
    template = "mz_wap/index.html"
    banner_lst = db.api.common.homepage.get_wap_banner()
    if banner_lst.is_error():
        wap_banners = []
    else:
        wap_banners = banner_lst.result()
    # 精品课程(免费好课)
    hot_courses = db.api.common.homepage.get_hot_course_list(_enable_cache=True)
    if hot_courses.is_error():
        hot_course_data_list = []
    else:
        hot_course_data_list = hot_courses.result()[:4]

    # wiki（干货分享）
    wiki = db.api.common.homepage.get_home_page_wiki(_enable_cache=True)
    if wiki.is_error():
        wikis = []
    else:
        wikis = wiki.result()[1]
    data = {
        'wap_banners': wap_banners,
        'hot_course_data_list': hot_course_data_list,
        'wikis': wikis
    }

    return render(request, template, data)


def course(request):
    pass

@require_safe
def python_px(request):
    # 游客读取首页缓存
    # openid 第三方（QQ,微信）
    # verify_email 验证邮箱
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        html = cache.get('wap_new_python_html')
        if html:
            return HttpResponse(html)

    t = loader.get_template('mz_wap/new_wap/python.html')
    html = t.render(RequestContext(request, {}))
    # 游客保存首页缓存
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        cache.set('wap_new_python_html', html, 5 * 60)
    print 'finish'
    return HttpResponse(html)

@require_safe
def web_px(request):
    # 游客读取首页缓存
    # openid 第三方（QQ,微信）
    # verify_email 验证邮箱
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        html = cache.get('wap_new_web_html')
        if html:
            return HttpResponse(html)
    t = loader.get_template('mz_wap/new_wap/web.html')
    html = t.render(RequestContext(request, {}))
    # 游客保存首页缓存
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        cache.set('wap_new_web_html', html, 5 * 60)

    return HttpResponse(html)

@require_safe
def ui_px(request):
    # 游客读取首页缓存
    # openid 第三方（QQ,微信）
    # verify_email 验证邮箱
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        html = cache.get('wap_new_ui_html')
        if html:
            return HttpResponse(html)
    t = loader.get_template('mz_wap/new_wap/ui.html')
    html = t.render(RequestContext(request, {}))
    # 游客保存首页缓存
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        cache.set('wap_new_ui_html', html, 5 * 60)

    return HttpResponse(html)

@require_safe
def op_px(request):
    # 游客读取首页缓存
    # openid 第三方（QQ,微信）
    # verify_email 验证邮箱
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        html = cache.get('wap_new_op_html')
        if html:
            return HttpResponse(html)
    t = loader.get_template('mz_wap/new_wap/op.html')
    html = t.render(RequestContext(request, {}))
    # 游客保存首页缓存
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        cache.set('wap_new_op_html', html, 5 * 60)

    return HttpResponse(html)

@require_safe
def pm_px(request):
    # 游客读取首页缓存
    # openid 第三方（QQ,微信）
    # verify_email 验证邮箱
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        html = cache.get('wap_new_pm_html')
        if html:
            return HttpResponse(html)
    t = loader.get_template('mz_wap/new_wap/pm.html')
    html = t.render(RequestContext(request, {}))
    # 游客保存首页缓存
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        cache.set('wap_new_pm_html', html, 5 * 60)

    return HttpResponse(html)

# @require_safe
# def ai_px(request):
#     # 游客读取首页缓存
#     # openid 第三方（QQ,微信）
#     # verify_email 验证邮箱
#     if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
#         html = cache.get('wap_new_ai_html')
#         if html:
#             return HttpResponse(html)
#     t = loader.get_template('mz_wap/new_wap/ai.html')
#     html = t.render(RequestContext(request, {}))
#     # 游客保存首页缓存
#     if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
#         cache.set('wap_new_ai_html', html, 5 * 60)
#
#     return HttpResponse(html)

@require_safe
def ai_px(request):

    # 游客读取首页缓存
    # openid 第三方（QQ,微信）
    # verify_email 验证邮箱
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        html = cache.get('wap_new_ai_html')
        if html:
            return HttpResponse(html)
    t = loader.get_template('mz_wap/new_wap/ai.html')
    html = t.render(RequestContext(request, {}))
    # 游客保存首页缓存
    if request.user.is_anonymous() and not request.GET.get('openid') and not request.GET.get('verify_email'):
        cache.set('wap_new_ai_html', html, 5 * 60)

    return HttpResponse(html)

@require_safe
def career_course_detail(request, course_id):
    #参数是ai 数据库里的ml 代表的是机器学习

    if course_id == 'python':
        return python_px(request)
    elif course_id == 'web':
        return web_px(request)
    elif course_id == 'op':
        return op_px(request)
    elif course_id == 'pm':
        return pm_px(request)
    elif course_id == 'ui':
        return ui_px(request)
    # elif course_id == 'ai':
    #     return ai_px(request)
    elif course_id == 'ai':
        return ai_px(request)
    else:
        template = 'mz_wap/career_course_detail.html'
        cur_careercourse = CareerCourse.objects.filter(short_name=course_id)
        c_course_has_value = False
        if cur_careercourse:
            cur_careercourse_values = cur_careercourse \
                .values('name', 'brief_intro', 'description_px', 'seo_title_px', 'seo_keyword_px', 'seo_description_px',
                        'id_53kf', 'course_color_px', 'image_px', 'image_px_2')[0]
            cur_careercourse = cur_careercourse[0]
            # 判断页面所需careercourse相关字段是否齐全
            c_course_has_value = judge_none(**cur_careercourse_values)
        # 取老师
        class_teachers = Class.objects.xall().filter(career_course__short_name=course_id).values('teachers')
        teachers = UserProfile.objects.filter(id__in=[class_teacher['teachers'] for class_teacher in class_teachers]) \
            .values('id', 'nick_name', 'position', 'description', 'teacher_photo', 'avatar_middle_thumbnall')
        # 确定可展示老师
        show_teachers = []
        list_judge_none(show_teachers, *teachers)

        # 取展示阶段
        showstages = ShowStage.objects.filter(career_course__short_name=course_id).order_by('id')
        showstages_values = showstages.values('name', 'description', 'task_knowledge_test', 'task_list', 'image_url')
        # 确定可展示showstages
        show_s_stages = []
        list_judge_none(show_s_stages, *showstages_values)
        # 取学生作品图片
        studentprojectimage = StudentProjectImage.objects.filter(career_course=cur_careercourse).order_by('id')
        studentprojectimage_values = studentprojectimage.values('image_url')[:3]
        # 确定可展示studentprojectimage
        show_studentprojectimage = []
        list_judge_none(show_studentprojectimage, *studentprojectimage_values)

        if not show_s_stages:
            return redirect(reverse("career_course_video_list", kwargs=dict(course_id=course_id)))

        # 用户登陆的情况下，判断用户是否报名过该职业课程的班级．
        if request.user.is_authenticated():
            pay_flag = 0  # 显示立即报名
            student_register_info = db.api.course.career_course_intro.user_class_type(request.user.id, cur_careercourse.id)
            if student_register_info.is_error():
                log.warn('view: career_course_detail, function: user_class_type, result: fail, '
                         'more_info: user_id-%s career_course_id-%s' % (request.user.id, cur_careercourse.id))
                raise Http404
            student_register_info = student_register_info.result()
            if student_register_info.get('is_normal_class'):
                pay_flag = 1
        result = db.api.course.career_course_intro.get_career_intro(cur_careercourse.id)
        if result.is_error():
            log.warn('get_career_intro is error career_course_id:%s' % cur_careercourse.id)
        duties = result.result().get('duties')
        return render(request, template, locals())


@require_safe
def career_course(request):
    template = 'mz_wap/career_course.html'
    career_courses = CareerCourse.objects.filter(course_scope=None).order_by("-status")
    return render(request, template, locals())


@require_safe
def video_list(request, course_id):
    template = 'mz_wap/career_course_list.html'
    career_course = get_object_or_404(CareerCourse, short_name__iexact=course_id)
    stages = career_course.stage_set.order_by("index")
    total_courses = 0
    need_days = 0
    for stage in stages:
        stage.course_list = Course.objects.filter(stages_m=stage, is_active=True).order_by("index", "id")
        set_callback_url(stage.course_list)
        total_courses += stage.course_list.count()
        need_days += sum(i[0] for i in stage.course_list.values_list('need_days'))
    return render(request, template, locals())


@require_safe
def career_course_syllabus(request, course_id):
    """
    @brife 职业课程大纲页
    """
    template = 'mz_wap/career_course_list2.html'

    career_course = db.api.course.career_course_intro.get_career_course_info(course_id)

    if career_course.is_error():
        log.warn('view:career_course_syllabus, func:get_career_course_info, '
                 'result:fail, info:course_short_name-%s' % course_id)
        raise Http404
    career_course = career_course.result()

    stages = db.api.course.course_stage.get_course_stage_by_career_course_id_non_3(career_course.get('id'))

    if stages.is_error():
        log.warn('view:career_course_syllabus, func:get_course_stage_by_career_course_id, '
                 'result:fail, info:career_course_id-%s' % career_course.get('id'))
        raise Http404
    stages = stages.result()

    total_courses = 0
    need_days = 0
    for stage in stages:
        course_list = db.api.course.course.get_course_by_stage_id(stage.get('id'))
        if course_list.is_error():
            log.warn('view:career_course_syllabus, func:get_course_by_stage_id, '
                     'result:fail, info:stage_id-%s' % stage.get('id'))
            raise Http404
        course_list = course_list.result()
        stage['course_list'] = course_list
        total_courses += len(course_list)
        need_days += sum(course.get('need_days', 0) for course in course_list)
    return render(request, template, dict(career_course=career_course,
                                          total_courses=total_courses,
                                          need_days=need_days,
                                          stages=stages))


@require_safe
def course_detail(request, course_id):
    """
    @brief 小课程页面的view函数
    :param request:
    :param course_id:
    :return:
    """
    template = 'mz_wap/small_course_detail.html'

    course_id = safe_int(course_id, 0)
    if course_id == 0:
        raise Http404

    # 获取课程信息
    course = db.api.course.course.get_id_course(course_id)
    if course.is_error():
        log.warn('view:course_detail, func:get_id_course, result:fail, more_info:course_id-%s' % course_id)
        raise Http404
    course = course.result()
    if course:
        course = course[0]
    else:  # this should NOT happen
        raise Http404

    # 更新课程点击次数
    result = db.api.course.course.update_course_click_count(course_id)
    if result.is_error():
        log.info('update_course_click_count fail. More info: course_id: %s' % course_id)

    # 获取老师信息
    teacher = db.api.user.user.get_teacher_info(course_id)
    if teacher.is_error():
        log.warn('view:course_detail, func:get_teacher_info, result:fail, '
                 'more_info:course_id-%s' % course_id)
        raise Http404
    teacher = teacher.result()

    # 获取课程列表
    lessons = db.api.course.lesson.get_lesson_list_by_course_id(course_id)
    if lessons.is_error():
        log.warn('view:course_detail, func:get_lesson_list_by_course_id, result:fail, '
                 'more_info:course_id-%s' % course_id)
        raise Http404
    lessons = lessons.result()

    # 获取职业课程推荐
    career_course = db.api.course.career_course.get_career_course_by_course_id_through_careerobjrelation(course_id)
    if career_course.is_error():
        log.warn('view:course_detail, func:get_career_course_by_course_id_through_careerobjrelation, result:fail, '
                 'more_info:course_id-%s' % course_id)
        raise Http404
    career_course = career_course.result()

    if career_course:
        career_course = career_course[0]

        # 获取相关课程推荐
        course_list = db.api.course.course.get_course_by_career_course_id(career_course.get('id'))
        if course_list.is_error():
            log.warn('view:course_detail, func:get_course_by_career_course_id, result:fail, '
                     'more_info:course_id-%s' % career_course.get('id'))
        else:
            course_list = course_list.result()
            course_list = filter(lambda x: int(x['id']) != int(course_id), course_list)[:10]  # 过滤当前的course
    else:
        career_course = []
        course_list = []

    # 计算章节学习时长
    course_video_length = calc_course_video_length(lessons)

    articles = db.api.article.article.get_article_with_course(course_id=course_id)
    if articles.is_error():
        log.warn('view:course_detail, func:get_article_with_course, result:fail, '
                 'more_info:course_id-%s' % course_id)
    articles = articles.result()

    for article in articles:  # 将分组聚合的tag信息拆分
        if article['tag']:
            article['tag'] = dict(list(item.split('_') for item in article['tag'].split(','))[:3])

    # 获取SEO信息
    seo = db.api.common.seo.get_seo_by_obj_id(course_id, 'COURSE')
    if seo.is_error():
        log.warn('view:course_detail, func:get_seo_by_obj_id, result:fail, '
                 'more_info:course_id-%s' % course_id)
    else:
        seo = seo.result()

    wiki_item_list = db.api.wiki.wiki.get_wiki_by_lps_course_id(course_id)
    if wiki_item_list.is_error():
        log.info('get_wiki_by_lps_course_id fail. More info: course_id: %s' % course_id)
        wiki_item_list = []
    else:
        wiki_item_list = wiki_item_list.result()

    # 获取相关文章推荐, 暂不需要
    return render(request, template, dict(course=course,
                                          lessons=lessons,
                                          teacher=teacher,
                                          career_course=career_course,
                                          course_list=course_list,
                                          course_video_length=course_video_length,
                                          seo=seo, wiki_item_list=wiki_item_list))


def handle_search(keywords):
    """
    @brief 处理搜索
    :param keywords:
    :return:
    @note WAP首页搜索采用PC端的搜索服务实现. 该函数已弃用
    """
    keywords = keywords.strip(' ').split(' ')[:3]  # 只取输入的前三个关键字
    keywords = [keyword.lower() for keyword in keywords]
    all_keywords = db.api.course.keyword.get_keyword()
    all_keywords = safe_api_result(all_keywords, log,
                                   'view:course_list_all, func:get_keyword, result:fail'
                                   'more_info:page_name=4')

    if not all_keywords:  # this should NOT happen
        raise Http404

    for item in all_keywords:
        item['keywords'] = item.get('keywords', '').strip(',').split(',')

    def search_keyword(seq):
        lower_seq = [v.lower() for v in seq]
        for k in keywords:
            for a_k in lower_seq:
                if k in a_k:
                    return True
        return False

    filter_keywords = filter(lambda x: search_keyword(x.get('keywords', [])), all_keywords)
    course_id_list = set(item.get('obj_id', 0) for item in filter_keywords)

    if course_id_list:
        course_id_list.add(0)  # 调整课程id列表的内容，当课程只有一个时，如(5,) sql语句执行　select in 时会报错，调整为(5, 0)
        course_list = db.api.course.course.get_course_course(tuple(course_id_list))
        course_list = safe_api_result(course_list, log,
                                      'view:course_list_all, func:get_course_course, result:fail'
                                      'more_info:course_id_list=%s' % str(course_id_list),
                                      if_raise=False)
    else:
        course_list = []

    return course_list


def search_api(keyword, page_size, page):
    """
    @brief 调用搜索接口来
    :param keyword:
    :param page_size:
    :param page:
    :return:
    """
    search_url = settings.SEARCH_API_URL
    ori_keyword = keyword[:settings.SEARCH_KEYWORD_LENGTH].replace('u0023', '#').replace('u0022', '?')
    course_list, has_next = [], False

    try:
        url = '{0}?app={1}&keyword={2}&page_size={3}&page={4}'.format(search_url, 'course', ori_keyword,
                                                                      page_size, page)
        result = requests.get(url)
        search_result = json.loads(result.text)
    except Exception as e:
        log.error('request search api failed:{0}'
                  'request_url:{1}'.format(e, url))
        pass

    if result.status_code in [500, 400]:
        log.warn('view:search_api, func:url, result:fail, more_info:{0}'.format(search_result['msg']))

    if result.status_code == 200:
        # add more info
        course_list = search_result.get('result', {}).get('items', [])

        # 获取老师昵称
        course_id_list = ['course_%s' % item.get('id', 0) for item in course_list]
        result = db.api.search.fulltext_search.get_course_career_names(course_id_list)
        result = safe_api_result(result, log,
                                 'view:search_api, func:get_course_career_names, result:fail'
                                 'more_info:course_id_list=%s' % str(course_id_list),
                                 if_raise=False)
        result = [item for item in result] if result else []  # result 是个生成器, 只能循环一次

        def get_teacher_name(course_id):
            for info in result:
                if info.get('key', '').encode('utf-8').lower() == 'course_%s' % course_id:
                    return info.get('tea_ni_name', '')
            return ''

        for course in course_list:  # 去除红色字体高亮并处理teacher的nick_name
            course['name'] = course.get('name', '').replace('<em>', '').replace('</em>', '')
            course['nick_name'] = get_teacher_name(safe_int(course.get('id', 0)))  # 获取老师昵称
        total = search_result.get('result', {}).get('total', 0)
        if len(course_list) == page_size and (page + 1) * page_size < total:  # has next page
            has_next = True
        else:
            has_next = False

    return course_list, has_next


def handle_course_list(category='all', tag='all', sort_by='0', page=1, page_size=10, keyword=''):
    """
    @brief 处理WAP课程列表的数据
    :param category: 职业方向
    :param tag:　课程分类
    :param sort_by:　排序方式
    :param page_index:　分页序号
    :param keyword:　关键字，暂时未使用
    :return:
    """

    # 取得参数并作必要的类型验证
    try:
        category = str(category)
        tag = str(tag)
        sort_by = str(sort_by)
        page_index = safe_int(page, 1)
        keyword = str(keyword)
    except ValueError:
        log.warn('error input parameters')
        raise Http404

    # 检查category和tag
    tag_name = db.api.course.tag.get_tag_name(tag)
    tag_name = safe_api_result(tag_name, log,
                               'view:handle_course_list, func:get_tag_name, result:fail, more_info:tag-%s' % tag)

    category_name = db.api.course.career.get_career_name(category)
    category_name = safe_api_result(category_name, log,
                                    'view:handle_course_list, func:get_catagory_name, '
                                    'result:fail, more_info:category-%s' % category)

    if tag_name:
        tag_name = tag_name[0]['name']
    if category_name:
        category_name = category_name[0]['name']

    # 取职业方向列表
    categories_list = db.api.course.catagory.get_catagory()
    categories_list = safe_api_result(categories_list, log,
                                      'view:handle_course_list, func:get_catagory, result:fail',
                                      if_raise=False)

    # 取全部课程方向列表
    career_category_dic = dict()
    if categories_list:
        for each_category in categories_list:
            short_name = each_category['short_name']
            name = each_category['name']
            tag_list = db.api.course.tag.get_catagory_tag(short_name)
            tag_list = safe_api_result(tag_list, log,
                                       'view:handle_course_list, func:get_catagory_tag, result:fail'
                                       'more_info:category_name-%s' % short_name)
            career_category_dic[name] = (short_name, tag_list)

    tag_list = db.api.course.tag.get_tag()
    tag_list = safe_api_result(tag_list, log,
                               'view:handle_course_list, func:get_tag, result:fail',
                               if_raise=False)

    # 处理排序相关
    sort_by_dict_chinese = {'0': u'全部', '1': u'最新', '2': u'最热', '3': u'播放最多'}
    sort_by_list_chinese = sorted(sort_by_dict_chinese.iteritems(), key=lambda x: x[0])
    sort_by_dict = {'1': 'date_publish', '2': 'favorite_count', '3': 'click_count'}
    _sort_by = sort_by_dict.get(sort_by, '0')
    sort_by_chinese = sort_by_dict_chinese.get(sort_by, u'')

    # 取课程列表
    if not keyword:  # 无搜索关键字时, 执行课程库逻辑
        if tag != 'all' and category != 'all':  # WAP的交互行为与PC不同，职业方向与课程方向必须同时指定
            course_list = db.api.course.course.get_tag_catagory_course(tag, category)
            course_list = safe_api_result(course_list, log,
                                          'view:handle_course_list, func:get_tag_catagory_course, result:fail'
                                          'more_info:tag-%s&category-%s' % (tag, category))
        elif tag != 'all':  # 如果只有标签,根据标签取课程
            course_list = db.api.course.course.get_tag_course(tag)
            course_list = safe_api_result(course_list, log,
                                          'view:handle_course_list, func:get_tag_course, result:fail'
                                          'more_info:tag-%s' % tag)
        elif category != 'all':  # 如果只有职业分类,根据分类取标签和课程
            course_list = db.api.course.course.get_catagory_course(category)
            course_list = safe_api_result(course_list, log,
                                          'view:handle_course_list, func:get_catagory_course, result:fail'
                                          'more_info:category-%s' % category)
        else:  # 否则，取全部课程
            course_list = db.api.course.course.get_course()
            course_list = safe_api_result(course_list, log,
                                          'view:handle_course_list, func:get_course, result:fail')
        # 课程排序
        if _sort_by != '0':
            course_list = sorted(course_list, key=lambda x: x[_sort_by], reverse=True)

        # 处理分页 此处复用PC端的分页
        page_count_list, page_index, start_index, end_index = paginater(page_index, page_size, len(course_list), 2)
        # 是否有下一页
        has_next = True if end_index < len(course_list) else False
        course_list = course_list[start_index:end_index]

    else:  # 有搜索关键字, 执行搜索逻辑
        course_list, has_next = search_api(keyword, page_size, page - 1)  # 搜索服务的默认页面从0开始, 两种page保持一致
        page_index = page

    # seo
    seo = db.api.course.page_name_seo.get_page_name_seo('4')
    seo = safe_api_result(seo, log,
                          'view:handle_course_list, func:get_page_name_seo, result:fail'
                          'more_info:page_name=4', if_raise=False)
    seo = seo[0] if seo else None

    return dict(category=category, tag=tag, sort_by=sort_by, page_count_list=page_count_list, page_index=page,
                start_index=start_index, end_index=end_index, seo=seo,
                categories_list=categories_list, tag_list=tag_list, course_list=course_list,
                has_next=has_next, career_category_dic=career_category_dic,
                sort_by_list_chinese=sort_by_list_chinese, sort_by_chinese=sort_by_chinese,
                tag_name=tag_name, category_name=category_name, )


# 课程库
@require_safe
def course_list_all(request):
    """
    @brief 全部课程
    :param request:
    :return:
    """
    template = "mz_wap/course_list.html"
    template_chunk = "mz_wap/list_course_chunk.html"

    search = request.GET.get('search', '')
    page = safe_int(request.GET.get('page', 1), 1)
    if search:  # 搜索
        data = handle_course_list(keyword=search, page=page)
        data['search'] = search
    else:
        data = handle_course_list()
    data.update({'nav_name': 'course'})
    if not request.is_ajax():
        data.update({'course_filter': True})
        return render(request, template, data)
    else:
        data.update({'MEDIA_URL': settings.MEDIA_URL,
                     'with_data': True if data.get('course_list') else False})
        html = render_to_string(template_chunk, data)
        data['html'] = html
        return JsonResponse(data)


# 课程库
@require_safe
def course_list(request, category, tag, sort_by, page):
    """
    @brief 采用新交互方式的WAP课程列表
    :param request:
    :param category:
    :param tag:
    :param sort_by:
    :param page:
    :return:
    """

    template = "mz_wap/course_list.html"
    template_chunk = "mz_wap/list_course_chunk.html"

    # 根据前端交互的逻辑，此条件应该不会被触发．
    if category == 'all' and tag == 'all' and sort_by == '0' and page == '1':
        return redirect('course_list_all')

    data = handle_course_list(category, tag, sort_by, page)

    if not request.is_ajax():
        data.update({'course_filter': True})
        return render(request, template, data)
    else:
        data.update({
            'MEDIA_URL': settings.MEDIA_URL,
            'with_data': True if data.get('course_list') else False
        })
        html = render_to_string(template_chunk, data)
        data['html'] = html
        return JsonResponse(data)


def _sort_by(query, method):
    if method == 'hot':
        return _hot(query)
    elif method == 'new':
        return _new(query)
    elif method == 'mostplay':
        return _mostplay(query)
    else:
        return query


def _hot(query):
    return query.order_by("-favorite_count")


def _new(query):
    return query.order_by("-date_publish")


def _mostplay(query):
    return query.annotate(play_total=Sum('lesson__play_count')).order_by("-play_total")


def _get_title(course_category, career_category):
    title = '公开课 - 麦子学院'
    if course_category != 'all':
        title = course_category + ' - ' + title
    if career_category != 'all':
        title = career_category + ' - ' + title
    return title


def lps_introduce(request):
    template = 'mz_wap/lps_introduce.html'
    if request.method == 'GET':
        return render(request, template, locals())


# 课程详情 - 章节
@require_safe
def lesson_view(request, course_id, lesson_id):
    template = "mz_wap/course_detail.html"

    # 处理参数
    course_id = safe_int(course_id, 0)
    lesson_id = safe_int(lesson_id)
    if course_id == 0 or lesson_id == 0:
        raise Http404

    # 获取课程信息
    course = db.api.course.course.get_id_course(course_id)
    if course.is_error():
        log.warn('view:course_detail, func:get_id_course, result:fail, more_info:course_id-%s' % course_id)
        raise Http404
    course = course.result()[0]

    # 获取章节
    lesson = db.api.course.lesson.get_lesson_by_id(lesson_id)
    if lesson.is_error():
        log.warn('view:lesson_view, func:get_lesson_by_id, result:fail, '
                 'more_info:lesson_id-%s' % lesson_id)
        raise Http404
    lesson = lesson.result()

    # 更新lesson播放次数
    result = db.api.course.lesson.update_lesson_play_count(lesson_id)
    if result.is_error():
        log.warn('view:lesson_view, func:update_lesson_play_count, result:fail, '
                 'more_info:lesson_id-%s' % lesson_id)

    # 课程章节
    lesson_list = db.api.course.lesson.get_lesson_list_by_course_id(course_id)
    if lesson_list.is_error():
        log.warn('view:lesson_view, func:get_lesson_list_by_course_id, result:fail, '
                 'more_info:course_id-%s' % course_id)
        raise Http404
    lesson_list = lesson_list.result()

    # 获取老师信息
    teacher = db.api.user.user.get_teacher_info(course_id)
    if teacher.is_error():
        log.warn('view:lesson_view, func:get_teacher_info, result:fail, '
                 'more_info:course_id-%s' % course_id)
        raise Http404
    teacher = teacher.result()

    # 获取相关的问答
    asks = db.api.common.new_discuss_post.get_all_question_and_answer_of_one_project_id(lesson_id, 5)
    if asks.is_error():
        log.warn('view:lesson_view, func:get_all_question_and_answer_of_one_project_id, result:fail, '
                 'more_info:lesson_id-%s' % lesson_id)
        asks = []
    else:
        asks = asks.result()

    # 获取SEO
    seo = db.api.common.seo.get_seo_by_obj_id(course_id, 'COURSE')
    if seo.is_error():
        log.warn('view:course_detail, func:get_seo_by_obj_id, result:fail, '
                 'more_info:course_id-%s' % course_id)
    else:
        seo = seo.result()

    # 是否支付
    is_paid = False
    if request.user.is_authenticated():

        user_id = request.user.id

        # 获取职业课程信息
        career_course = db.api.course.career_course.get_career_course_by_course_id_through_careerobjrelation(course_id)
        if career_course.is_error():
            log.warn('view:course_detail, func:get_career_course_by_course_id_through_careerobjrelation, result:fail, '
                     'more_info:course_id-%s' % course_id)
            career_course = None
        else:
            career_course = career_course.result()
            career_course = career_course[0] if career_course else None

        if career_course:
            now = datetime.datetime.now()
            career_course_id = career_course.get('id')
            is_paid = db.api.course.career_course.is_career_student_of_these_career_courses(user_id,
                                                                                            now,
                                                                                            career_course_id)
            if is_paid.is_error():
                log.warn('view:lesson_view, func:is_career_student_of_these_career_courses, '
                         'result:fail, more_info:user_id-%s&time-%s&career_course_id-%s' % (course_id, now,
                                                                                            career_course_id))
            else:
                is_paid = is_paid.result()
                is_paid = bool(is_paid)

    wiki_item_list = db.api.wiki.wiki.get_wiki_by_lps_course_id(course_id)
    if wiki_item_list.is_error():
        log.info('get_wiki_by_lps_course_id fail. More info: course_id: %s' % course_id)
        wiki_item_list = []
    else:
        wiki_item_list = wiki_item_list.result()

    data = dict(course=course, lesson=lesson, lesson_list=lesson_list,
                teacher=teacher, asks=asks, seo=seo, is_paid=is_paid,
                wiki_item_list=wiki_item_list)

    return render(request, template, data)


# 老师详情页
@require_safe
def teacher_detail(request, teacher_id):
    gold_teacher = GOLD_TEACHER.get(teacher_id)
    if gold_teacher:
        return teacher_intro(request, teacher_id)
    template = "mz_wap/teacher_detail.html"

    teacher = get_object_or_404(UserProfile, pk=teacher_id)
    if not teacher.is_teacher():
        raise Http404()
    courses = teacher.course_set.all()
    set_callback_url(courses)
    data = {
        'teacher': teacher,
        'courses': courses
    }
    return render(request, template, data)


# app分享落地页——视频分享
@require_GET
def video_share(request, course_id=0, lesson_id=0):
    if course_id == 0:
        course_lessons = None
        lesson = None
        teacher_info = None
    # 获取该课程下的所有章节
    course_lessons = db.api.get_lesson_list_by_course_id(course_id)
    if course_lessons.is_error():
        logger.warn(
            'get all course lesson by course id failed.'
            'course_id:{0}'.format(course_id)
        )
        course_lessons = {}
    else:
        course_lessons = course_lessons.result()
    # 默认播放该课程的第一个章节视频
    if lesson_id == 0:
        lesson = db.api.get_lesson_by_id(course_lessons[0]['id'])
    else:
        lesson = db.api.get_lesson_by_id(lesson_id)
    if lesson.is_error():
        logger.warn(
            'get one lesson by lesson id failed.'
            'lesson_id:{0}'.format(lesson_id)
        )
        lesson = {}
    else:
        lesson = lesson.result()
    # 获取该课程授课老师的基本信息
    teacher_info = db.api.user.user.get_teacher_info(course_id)
    if teacher_info.is_error():
        logger.warn(
            'get course teacher info by course id failed.'
            'course_id:{0}'.format(course_id)
        )
        teacher_info = {}
    else:
        teacher_info = teacher_info.result()
    data = {
        "course_id": course_id,
        "lessons": lesson,
        "course_lessons": course_lessons,
        "teacher_info": teacher_info
    }

    return render(request, 'appshare/videoshare.html', data)


# app分享落地页——任务完成分享
@require_GET
def task_share(request, career_course_id=0):
    if career_course_id == 0:
        career_course_name = None
        course_stages = None
        course_task = None
    # 获取职业课程名称
    career_course_name = db.api.get_career_course_name_by_id(career_course_id)
    if career_course_name.is_error():
        logger.warn('get career course name  by career course id.'
                    'career_course_id:{0}'.format(career_course_id))
        career_course_name = {}
    else:
        career_course_name = career_course_name.result()
    # 获取课程所有阶段
    course_stages = db.api.get_course_stage_by_career_course_id(career_course_id)
    if course_stages.is_error():
        logger.warn('get career course stages  by career course id.'
                    'career_course_id:{0}'.format(career_course_id))
        course_stages = {}
    else:
        course_stages = course_stages.result()
    # 获取课程所有阶段下的任务列表
    course_task = db.api.get_course_task_by_career_course_id(career_course_id)
    if course_task.is_error():
        logger.warn('get career course task  by career course id.'
                    'career_course_id:{0}'.format(career_course_id))
        course_task = {}
    else:
        course_task = course_task.result()

    data = {
        "careerCourseName": career_course_name,
        "courseStages": course_stages,
        "courseTasks": course_task
    }

    return render(request, 'appshare/taskshare.html', data)


def apply_teacher_show(request):
    '''
    显示教师招募表单页
    :param request:
    :return:
    '''
    return render(request, 'mz_wap/applyteacher.html', {})


def teacher_recruit_show(request):
    '''
    显示教师招募页
    '''
    return render(request, 'mz_wap/teacherRecruit.html', {})


@require_POST
def teacher_recruit_save(request):
    '''
    wap端 教师招募表单信息保存,图片验证码后台验证
    :param request:
    :return: {"status":True/False}
    '''
    if 'captcha_key' in request.POST and 'code' in request.POST:
        hash_key = get_param_by_request(request.POST, 'captcha_key', "", _type=str)
        code = get_param_by_request(request.POST, 'code', "", _type=str)
        try:
            is_verify = verify_captcha_code(request, hash_key, code)
        except Exception as e:
            log.warn('verify_random_code fail: %s, more info hash_key: %s, code: %s' % (str(e), hash_key, code))
            return HttpResponse(json.dumps({"status": False, "msg": "验证码错误"}), content_type="application/json")
        if not is_verify:
            return HttpResponse(json.dumps({"status": False, "msg": "验证码错误"}), content_type="application/json")

        teacher_type = get_param_by_request(request.POST, 'lecturerType', 0, _type=int)
        teacher_catagory = get_param_by_request(request.POST, 'formation', 0, _type=int)
        name = get_param_by_request(request.POST, 'teacherRecruitName', '', _type=str)
        career = get_param_by_request(request.POST, 'teacherRecruitSkill', '', _type=str)
        work_time = get_param_by_request(request.POST, 'workingLife', 0, _type=int)
        resume = get_param_by_request(request.POST, 'teacherRecruitTextArea', '', _type=str)
        mobile = get_param_by_request(request.POST, 'teacherRecruitPhone', '', _type=str)
        qq = get_param_by_request(request.POST, 'teacherRecruitQQ', '', _type=str)
        status = True
        data_dict = dict(teacher_type=teacher_type, teacher_catagory=teacher_catagory,
                         name=name, career=career, work_time=work_time, resume=resume,
                         mobile=mobile, qq=qq)
        save_apply_teacher = db.api.teacher.employ_teacher.insert_employ_teacher(data_dict)
        if save_apply_teacher.is_error():
            log.warn('It has a error when saving the teacher apply info.'
                     'data_dict:{}'.format(data_dict))
            status = False
        return JsonResponse(dict(status=status))

    return HttpResponse(json.dumps({"status": False, "msg": "验证码信息不全"}), content_type="application/json")


# 金牌讲师
@require_safe
def teacher_intro(request, teacher_id):
    page_map = GOLD_TEACHER
    return render(request, page_map[int(teacher_id)])


@login_required
def register_career_course(request, career_course_id):
    """
    @brief wap端的支付页面
    :param request:
    :return:
    """
    # 是否已经支付
    result = db.api.common.app.app_user_class_type(user_id=request.user.id, career_id=career_course_id)
    if result.is_error():
        raise Http404
    class_type = result.result()
    if class_type['is_normal_class']:
        return render(request, 'mz_common/failure.html', {'reason': '你已报名此课程'})
    # 获取课程信息
    result = db.api.course.career_course_pay.get_career_course_detail(career_course_id)
    if result.is_error():
        log.warn('register_career_course: get_career_course_detail: result: fail, more_info: career_course_id: %s'
                 % career_course_id)
        raise Http404
    course_info = result.result()

    # 获取班级信息
    # result = db.api.course.career_course_pay.get_current_class_coding(career_course_id)
    # if result.is_error():
    #     log.warn('register_career_course: get_current_class_coding: result: fail, more_info: career_course_id: %s'
    #              % career_course_id)
    #     raise Http404
    # class_info = result.result()
    try:
        class_id = NORMAL_CLASS_DICT[int(career_course_id)]
    except KeyError:
        raise Http404
    try:
        careercourse_class = Class.objects.xall().get(id=class_id)
    except Class.DoesNotExist:
        raise Http404

    return render(request, 'mz_wap/register_career_course.html', dict(course_info=course_info,
                                                                      class_code=careercourse_class.coding,
                                                                      career_course_id=career_course_id))


# 个人中心
@student_required
def wap_student_center(request):
    user = request.user
    orders = get_user_orders(user.id)
    is_pay = is_pay_user(user.id)
    return render(request, 'mz_wap/personal_center.html', {'orders': orders, 'is_pay': is_pay,
                                                           'avatar': user.avatar_small_thumbnall,
                                                           'nick_name': user.nick_name,
                                                           'real_name': user.real_name if user.real_name else '',
                                                           'mobile': user.mobile,
                                                           'gender': '女' if user.gender == 2 else '男',
                                                           'birthday': user.birthday,
                                                           'qq': user.qq if user.qq else ''})


# 保存个人信息
@student_required
def wap_save_user_info(request):
    nick_name = request.POST.get('nick_name')
    real_name = request.POST.get('real_name')
    user = request.user
    if not nick_name and not real_name:
        return failed_json(u'内容不能为空')
    try:
        if nick_name:
            validators.v_nick(nick_name, min_len=1, max_len=11)
            if UserProfile.objects.filter(nick_name=nick_name).exists():
                raise Exception(u'昵称已存在')
            user.nick_name = nick_name
        if real_name:
            validators.v_len(real_name, min_l=2, max_l=5, name=u'真实姓名')
            user.real_name = real_name
        user.save()
        return success_json()
    except Exception as e:
        return failed_json(e.message)


# 搜索课程
def wap_search_course(request, keyword, page_index):
    data = new_search_api(keyword, page_index, 'course')
    url_prefix = get_current_url(str(request.get_full_path()), "^(.*)-\d+$")
    data['url'] = url_prefix
    return render(request, 'mz_wap/course_skill.html', data)


# 搜索文章
def wap_search_article(request, keyword, page_index):
    data = new_search_api(keyword, page_index, 'article')
    url_prefix = get_current_url(str(request.get_full_path()), "^(.*)-\d+$")
    data['url'] = url_prefix
    return render(request, 'mz_wap/article_result.html', data)


# 搜索wiki
def wap_search_wiki(request, keyword, page_index):
    data = new_search_api(keyword, page_index, 'wiki')
    url_prefix = get_current_url(str(request.get_full_path()), "^(.*)-\d+$")
    data['url'] = url_prefix
    return render(request, 'mz_wap/wiki_result.html', data)


# 搜索分页
def wap_search_page(request):
    keyword = request.POST.get('keyword')
    page_index = request.POST.get('page_index')
    app = request.POST.get('app')
    search_data = new_search_api(keyword, page_index, app)
    data = ""
    is_next = False

    if app == 'course':
        html = """
        <li><a href="/course/%s/">
        <p class="img"><img class="ui-imglazyload" alt="%s" src="%s">
        </p>
            <div class="txt">
                <h3>%s</h3>
                <p>%s</p>
                <dl><dd class="chapter">%s章</dd><dd>%s人正在学习</dd></dl>
            </div>
            </a>
        </li>
        """
        for course in search_data['searchResults']['result']['items']:
            data += html % (course['id'], course['name'], settings.MEDIA_URL + course['image'], course['name'],
                            course['description'], course['chapter_num'], course['click_count'])
    elif app == 'article':
        html = """
        <li><a href="/article/%s/">
        <p class="img"><img class="ui-imglazyload" alt="%s" src="%s">
        </p>
            <div class="txt">
                <h3>%s</h3>
                <p>%s</p>
                <dl>
                    <dd class="time">%s</dd>
                    %s
                </dl>
            </div>
        </a>
        </li>
        """
        for article in search_data['searchResults']['result']['items']:
            tags = ''
            if article.get('tags'):
                for tag in article.get('tags')[:2]:
                    tags += '<dd class="tag">' + tag[1] + '</dd>'
            data += html % (article['id'], article['title'], settings.MEDIA_URL + article['title_image'],
                            article['title'], article['tidy_content'], article['html_publish_date'], tags)
    else:
        data = render(request, 'mz_wap/module/li_search_wiki_item.html',
                      {'searchResults': search_data['searchResults']}).content
    if int(search_data['page_index']) < len(search_data['page_count_list']):
        is_next = True
    return JsonResponse({'data': data, 'is_next': is_next, 'page_index': search_data['page_index']})