/*! LPS4.0 2016-12-19
*/
function createUE(e){return UE.getEditor(e,{toolbars:[["simpleupload"]],autoClearinitialContent:!0,autoFloatEnabled:!1,wordCount:!1,elementPathEnabled:!1,initialFrameHeight:200,initialFrameWidth:1028,initialContent:"请输入你的问题",autoClearEmptyNode:!0,enableContextMenu:!1,wordCount:!1,autoHeightEnabled:!1,initialStyle:"p{color: #7a7a7a;font-size: 14px;line-height:1em;font-family: Microsoft Yahei;}img{max-width:100%;}"})}var ue=createUE("bdeditor");ue.ready(function(){ue.setContent('<p style="color: #7a7a7a;font-size: 14px;font-family: "Microsoft Yahei";">请输入你的问题</p>')}),ue.addListener("focus",function(){"请输入你的问题"==ue.getContentTxt()&&ue.setContent("")}),$(".submit-problem").on("click",function(){var e=ue.getContent();""==e||"请输入你的问题"==ue.getContentTxt()?layer.alert("内容不能为空",{skin:"layui-layer-molv",closeBtn:0}):$.ajax({url:"/lps4/coach/"+$(".detailes-container").attr("data-coach-id")+"/",type:"POST",data:{content:e},success:function(e){e.success?window.location.reload():layer.alert(e.message,{skin:"layui-layer-molv",closeBtn:0})}})});