/*! LPS4.0 2016-09-02
*/
function removeDate(){$("input[type=reset]").trigger("click"),$(".feedbackcaptcha").empty(),captcha(".feedbackcaptcha",""),$("#hideen_image_url").val(""),$("#feedbakBox .showFileName").html(""),$(".file>span").html("上传图片")}function feedback_submit(){var e={feedback_type:$("#feedback_type option:selected").val(),feedback_content:$("#feedback_content").val(),contact:$("#telphone").val(),image_url:$("#hideen_image_url").val(),current_url:window.location.href};$.ajax({type:"post",url:"/common/feedback/save/",dataType:"json",data:e,success:function(){$("#feedbakBox").modal("hide"),$("#feedbakBoxSuccess").modal("show"),setTimeout(function(){$("#feedbakBoxSuccess").modal("hide")},2e3)}})}$(function(){function e(){$("#feedbakBox .subminBtn").addClass("disable").attr("disabled","disabled")}function t(){$("#feedbakBox .subminBtn").removeClass("disable").removeAttr("disabled")}$("#feedback_content,#telphone").keyup(function(e){e.stopPropagation()}),$("#feedbakBox").on("hidden.bs.modal",function(){removeDate()}),$("#feedbackfade").click(function(){$("#feedbakBox").modal("show")}),$("#feedbakBox .zy_close").click(function(){$(this).parents("#feedbakBox").modal("hide")}),$("#feedbakBox input[type=tel],#feedbakBox textarea").keyup(function(){t(),$(this).siblings("em").hide()}),$("#feedbakBox input[type=file],#feedbackBox #telphone,#feedbakBox textarea").blur(function(){""==$("#feedbakBox input[type=file]").val()&&""==$("#feedbakBox #telphone").val()&&""==$("#feedbakBox textarea").val()&&e()}),$("#feedback_type").blur(function(){""==!$("#feedback_type").val()&&(t(),$(this).siblings("em").hide())}),$(".feedbackcaptcha").on("mousedown",$(".gt_slider_knob"),function(){$(".feedbackcaptcha").parent().siblings("em").hide(),t()});var i,s,a;$("#feedbakBox .subminBtn").click(function(){i=$("#feedbakBox textarea").val(),s=$("#feedbakBox #telphone").val();var t=/^0?1[3|4|5|7|8][0-9]\d{8}$/;return""==$("#feedback_type").val()?($("#selectError").show(),e(),void 0):""==i?($("#feedbakBox #textareaError").show(),e(),void 0):t.test(s)===!1||""==s?($("#feedbakBox #telError").show(),e(),void 0):$(".feedbackcaptcha .gt_ajax_tip").hasClass("success")?(feedback_submit(),console.log($("#feedback_type").val()),void 0):($(".feedbackcaptcha").parent().siblings("em").show(),e(),void 0)}),$("#feedbakBox textarea").keyup(function(){a=$("#feedbakBox textarea").val().length,$("#feedbakBox .textareaBox span em").html(200-a),$(this).parent().siblings("em").hide()});var o=$(".fileerrorTip"),n=o.html();$("#feedbackupload").fileupload({url:"/common/feedback/image_upload/",dataType:"json",autoUpload:!0,add:function(i,s){var a=[],l=/^(png|jpg|jpeg)$/i,r=s.originalFiles[0].size/1024;Ntype=s.originalFiles[0].name.split("."),Ntype=Ntype[Ntype.length-1],l.test(Ntype)?(o.html("").hide(),$("#feedbakBox .showFileName").html(s.originalFiles[0].name),$(".file>span").html("重新上传"),t()):($("#feedbakBox .showFileName").html(""),o.html("支持图片格式：png、jpg、jpeg").show(),a.push("Not an accepted file type"),e(),setTimeout(function(){o.html(n)},2e3)),parseInt(r)>500&&(o.html("文件超过500KB大小！").show(),a.push("Filesize is too big"),e(),setTimeout(function(){o.html(n)},2e3)),0==a.length&&s.submit()},done:function(e,t){var i=t.result.image_url;$("#hideen_image_url").val(i)}}),captcha(".feedbackcaptcha","")});