define(function (require, exports, module) {
    function Videojs(t) {
        //测试用,不要开
        //init();
        return init()
    }

    var init = function () {
        var zvideoWrap, zvideo, videoWrap, video, controlText, controlBar, videoHeader, Volume, volumeControl,
            volumeHandle, outFull, Ad, fullWidth, fullHeight, volumeDrag,
            inVolumeControl, VolumeControl, _isFull, videoHeaderDom, timeDrag, headTitle1, headTitle2;

        zvideoWrap = $('.zvideo');
        zvideo = zvideoWrap[0];
        videoWrap = $('video');
        video = videoWrap[0];
        controlText = $('.play-control .control-text');
        controlBar = $('.control-bar');
        videoHeader = $('.video-header');
        Volume = $('.volume');
        volumeControl = $('.volume-control');
        volumeHandle = $('.volume-handle');
        outFull = $('.out-full a');
        Ad = $('.ad');
        fullWidth = '1024px';
        fullHeight = '768px';
        headTitle1 = $(".video_part_lists li.liH a").find(".col_l").text();
        headTitle2 = $(".zyleve1 li.liH a").attr("title");


        /**
         * 播放结束begin
         */
        function isEnd() {
            if (video.ended == true) {
                // 触发mouseup事件,结束鼠标拖动事件
                $(document).trigger('mouseup');
                video.currentTime = 0;
                // 如果是全屏,退出全屏
                if (isFullScreen()) {
                    exitFullScreen();
                }
                controlBar.detach();
                $('.videoStopMeg').show();
            }
        }


        /**
         * 播放暂停begin
         */
        function showBigPlayButton() {
            if ($('#ad').val() != 'True' || $('#is_paid').val() == 'True' || video.currentTime == 0) {
                $('.vip').show()
            } else {
                $('.ordinary').show()
            }
        }

        showBigPlayButton();

        // 鼠标点击播放暂停事件
        $('video, .big-play-button, .play-control').on('click', function () {
            startPause();
        });

        Ad.on('click', function (e) {
            e.stopPropagation();
        });

        $('.ad span').on('click', function () {
            $(this).parent().hide();
        });


        // 空格播放暂停事件
        $(document).keyup(function (e) {
            e = e || window.event;
            // 判断是否按的空格键
            var code = e.which || e.keyCode;
            if (code == 32) {
                startPause();
                // 播放到暂停时,用mousemove事件让controlBar显示出来
                // 暂停到播放时,同样用mousemove事件唤醒moveStopEvent里的mousemove
                zvideoWrap.mousemove();
            }
        });

        // 播放暂停函数
        function startPause() {
            if (video.paused) {
                video.play();
                // 隐藏big-play-button
                $('.big-play-button').hide();
                // 如果没有controlBar,加入controlBar
                if ($('.control-bar').length == 0) {
                    zvideoWrap.append(controlBar)
                }

                // 隐藏videoStopMeg
                $(".videoStopMeg").hide();
                controlText.text('Pause').attr('title', 'Pause').removeClass('playing').addClass('paused');

                // 鼠标在zvideo范围move,controlBar出现
                zvideoWrap.mousemove(function () {
                    controlBar.fadeIn(500);
                    if (isFullScreen()) {
                        videoHeader.fadeIn(500)
                    }
                });

                // 播放过程中,鼠标在window范围内静止,controlBar消失
                $(window).moveStopEvent(function () {
                        controlBar.fadeOut(500);
                        if (isFullScreen()) {
                            videoHeader.fadeOut(500)
                        }
                    }
                );

            } else {
                video.pause();
                // 显示广告
                showBigPlayButton();
                controlText.text('Play').attr('title', 'Play').removeClass('paused').addClass('playing');
                Ad.show();
            }
        }

        /**
         * 音量begin
         */
        volumeDrag = false;
        inVolumeControl = false;
        VolumeControl = $('.volume, .volume-control');

        // hover出现音量条
        VolumeControl.mouseenter(function () {
            inVolumeControl = true;
            volumeControl.show()
        });

        // 离开volumeControl本身消失
        VolumeControl.mouseleave(function () {
            inVolumeControl = false;
            if (!volumeDrag) {
                volumeControl.hide()
            }
        });

        // 拖拽音量条
        $('.volume-handle,.volume-level').mousedown(function (e) {
            volumeDrag = true;
            volumeControl.show();
            updateVolume(e.pageY);
        });
        $(document).mouseup(function (e) {
            if (volumeDrag) {
                volumeDrag = false;
                updateVolume(e.pageY);
                if (!inVolumeControl) {
                    volumeControl.hide();
                }
            }
        });
        $(document).mousemove(function (e) {
            if (volumeDrag) {
                updateVolume(e.pageY);
            }
        });

        // 上下键控制音量
        $(document).keyup(function (e) {
            e = e || window.event;
            var code = e.which || e.keyCode;
            if (code == 38) {
                updateVolume(null, 0.1)
            }
        });
        $(document).keyup(function (e) {
            e = e || window.event;
            var code = e.which || e.keyCode;
            if (code == 40) {
                updateVolume(null, -0.1)
            }
        });

        // 更新音量函数
        var updateVolume = function () {
            var y, positionChange, volumeLevel, totalHeight, position;

            y = arguments[0] ? arguments[0] : null;
            positionChange = arguments[1] ? arguments[1] : null;
            volumeLevel = $('.volume-level');
            totalHeight = volumeLevel.height();
            position = video.volume * totalHeight;
            if (y) {
                position = totalHeight - (y - volumeLevel.offset().top);
            } else if (positionChange) {
                position += totalHeight * positionChange
            }
            var percentage = position / totalHeight;

            if (percentage > 1) {
                percentage = 1;
            }
            if (percentage < 0) {
                percentage = 0;
            }

            position = totalHeight * percentage;

            if (video.muted) {
                toggleMute();
            }
            video.volume = percentage;
            volumeHandle.css('height', position + 'px');

        };

        // 静音切换
        $('.volume span').click(function () {
            toggleMute()
        });

        var toggleMute = function () {
            video.muted = !video.muted;
            Volume.toggleClass('mute');
            switch (video.muted) {
                case true:
                    volumeHandle.css('height', '0');
                    break;
                case false:
                    volumeHandle.css('height', $('.volume-level').height() * video.volume);
                    break;
            }

            return false;
        };

        /**
         * 快进快退begin
         */
        $(document).keyup(function (e) {
            e = e || window.event;
            var code = e.which || e.keyCode;
            if (code == 39) {
                setTime(10)
            }
        });

        $(document).keyup(function (e) {
            e = e || window.event;
            var code = e.which || e.keyCode;
            if (code == 37) {
                setTime(-10)
            }
        });

        function setTime(tValue) {
            if (tValue == 0) {
                video.currentTime = tValue;
            }
            else {
                video.currentTime += tValue;
            }
        }

        //// 此举为了阻止浏览器的外层的esc按键,奈何stopDefault不被认为是函数
        ///**
        // * 全局 begin
        // */
        ////阻止浏览器的默认行为
        //function stopDefault (e) {
        //    //阻止默认浏览器动作(W3C)
        //    if (e && e.preventDefault) {
        //        e.preventDefault();
        //    }
        //    //IE中阻止函数器默认动作的方式
        //    else {
        //        window.event.returnValue = false;
        //    }
        //    return false;
        //}
        //stopDefault();
        ///**
        // * 全局 end
        // */


        /**
         * 50/75/100 begin
         */
        $('.view-port a').click(function () {
            // 获取比例
            var _scale, _margin;

            _scale = $(this).text().split('%')[0] / 100;
            // 选中的增加hover效果
            $(this).addClass('on').siblings().removeClass('on');
            // 获取全屏满屏时的video的长宽
            fullWidth = $(window).innerWidth();
            fullHeight = $(window).innerHeight();
            _margin = (1 - _scale) / 2 * fullHeight + 'px ' + (1 - _scale) / 2 * fullWidth + 'px';
            videoWrap.width(fullWidth * _scale).height(fullHeight * _scale).css({margin: _margin});
        });

        /**
         * video-header control-bar toggle begin
         */
            // 判断鼠标静止插件,时间为1000
        (function ($) {
            $.fn.moveStopEvent = function (callback) {
                return this.each(function () {
                    var x = 0,
                        y = 0,
                        x1 = 0,
                        y1 = 0,
                        isRun = false,
                        si,
                        self = this;

                    var sif = function () {
                        si = setInterval(function () {
                            // 如果video停止了,clearInterval
                            if (video.paused) {
                                clearInterval(si);
                            } else {
                                if (x == x1 && y == y1) {
                                    clearInterval(si);
                                    isRun = false;
                                    // 在self对象上执行callback的方法
                                    callback && callback.call(self);
                                }
                                x = x1;
                                y = y1;
                            }
                        }, 1000);
                    };

                    $(this).mousemove(function (e) {
                        x1 = e.pageX;
                        y1 = e.pageY;
                        !isRun && sif(), isRun = true;
                    }).mouseout(function () {
                        clearInterval(si);
                        isRun = false;
                    });
                });
            }
        })(jQuery);

        /**
         * 全屏begin
         */
        _isFull = false;
        videoHeader.find('.video-name').text(headTitle1 || headTitle2);
        videoHeaderDom = videoHeader.show().detach();
        // 鼠标全屏事件
        $('.full-screen').on('click', function () {
            toggleFullScreen();
        });

        //// enter键全屏事件(冲突,本次弃用)
        //$(document).keyup(function (e) {
        //    e = e || window.event;
        //    // 判断是否按的enter
        //    var code = e.which || e.keyCode;
        //    if (code == 13) {
        //        fullScreen();
        //        // 全屏时,用mousemove事件让controlBar显示出来,并唤醒moveStopEvent里的mousemove
        //        zvideoWrap.mousemove();
        //    }
        //});

        // esc键退出全屏事件
        $(document).keyup(function (e) {
            e = e || window.event;
            // 判断是否按的esc
            var code = e.which || e.keyCode;
            if (code == 27) {
                exitFullScreen();
                // 全屏时,用mousemove事件让controlBar显示出来,并唤醒moveStopEvent里的mousemove
                zvideoWrap.mousemove();
            }
        });

        // 绑定"退出全屏"
        outFull.on('click', function () {
            exitFullScreen();
        });

        // 判断是否是全屏
        var isFullScreen = function () {
            var elem, W3C, MOZ, WEBKIT, MS;

            elem = document;
            W3C = elem.fullscreenElement;
            MOZ = elem.mozFullScreenElement;
            WEBKIT = elem.webkitFullscreenElement;
            MS = elem.msFullscreenElement;

            return (W3C || MOZ || WEBKIT || MS);
        };


        // 全屏非全屏切换
        var toggleFullScreen = function () {
            if (isFullScreen()) {
                exitFullScreen();
            } else {
                fullScreen();
            }
        };

        // 全屏
        var fullScreen = function () {
            _isFull = true;
            zvideoWrap.css({'width': '100%', 'height': '100%'});
            if (zvideo.requestFullscreen) {
                zvideo.requestFullscreen();
            } else if (zvideo.webkitRequestFullscreen) {
                zvideo.webkitRequestFullscreen();
            } else if (zvideo.mozRequestFullScreen) {
                zvideo.mozRequestFullScreen();
            } else if (zvideo.msRequestFullscreen) {
                zvideo.msRequestFullscreen();
            }
            // 按钮变成'退出全屏'
            $('.full-screen').addClass('quit-screen');
            // 把复制的videoHeader加进来
            videoWrap.after(videoHeaderDom);
            // 加上100%的on
            $('.view-port .Big').addClass('on').siblings().removeClass('on');

            //// 把videoHeader的效果寄希望与show和hide导致逻辑混乱
            //// 全屏时显示videoHeader
            //videoHeader.show();
            //// 全屏时激活mousemove事件的videoHeader.fadeIn
            //zvideoWrap.on('mousemove', function () {
            //    videoHeader.fadeIn(500)
            //});
            ////$(window).on('moveStopEvent', function(){
            ////    console.log('moveStopEvent fadeOut');
            ////    videoHeader.fadeOut(500);
            ////});
        };

        // 退出全屏
        var exitFullScreen = function () {
            _isFull = false;
            var elem = document;
            if (elem.exitFullscreen) {
                elem.exitFullscreen();
            } else if (elem.msExitFullscreen) {
                elem.msExitFullscreen();
            } else if (elem.mozCancelFullScreen) {
                elem.mozCancelFullScreen();
            } else if (elem.oRequestFullscreen) {
                elem.oCancelFullScreen();
            } else if (elem.webkitExitFullscreen) {
                elem.webkitExitFullscreen();
            }
            videoHeader.detach();
            // video标签恢复顶满
            videoWrap.width('100%').height('100%').css({margin: 0});
            // 按钮变成'全屏'
            $('.full-screen').removeClass('quit-screen');

            //// 退出全屏时隐藏videoHeader
            //videoHeader.hide();
            //// 解绑通过on添加的mousemove事件(即videoHeader.fadeIn)
            //zvideoWrap.off('mousemove');
            //zvideoWrap.on('mousemove', function(){
            //    controlBar.fadeIn(500)
            //});
            ////$(window).off('moveStopEvent', function(){
            ////    videoHeader.fadeOut(500);
            ////});
        };

        /**
         * 播放时间和持续时间begin
         */
        // 初始化总时间
        $('.duration').text(changeTime(video.duration));
        // 当前播放时间
        videoWrap.on('timeupdate', function () {
            $('.current').text(changeTime(video.currentTime));
        });

        // 将秒转换为00:00:00形式函数
        function changeTime(time) {
            var h, m, s;
            h = Math.floor(time / 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            s = s < 10 ? '0' + s : s;
            m = m < 10 ? '0' + m : m;
            h = h < 10 ? '0' + h : h;

            return (h > 0 ? h + ":" : "") + m + ":" + s;
        }

        /**
         * 进度条基础begin
         */
        // 更新当前加载/播放进度条函数
        function update() {
            var c_time, d_time, video_progress;

            c_time = video.currentTime;
            d_time = video.duration;

            // 如果时间显示不正确,实时更新
            var Duration = $('.duration');
            if (Duration.text() != 5) {
                Duration.text(changeTime(d_time));
            }
            video_progress = c_time / d_time;

            $('.timeBar').css('width', video_progress * 100 + "%");
            $('.timeBar span').css('margin-right', 20 * (video_progress - 1));
            video.onprogress = function () {
                var buffer_width = video.buffered.end(0) / d_time * 100;
                $('.bufferBar').css("width", buffer_width + "%");
            };
            // 因为esc键被占用,不能响应退出全屏事件,故在此轮询任务上检测退出全屏,由此隐藏videoHeader
            var currentVideoHeader = $('.video-header');
            if (!isFullScreen() && currentVideoHeader.length) {
                videoHeader.detach();
                _isFull = false;
                videoWrap.width('100%').css({margin: '0'}).height('100%');
            } else if (isFullScreen() && !currentVideoHeader.length) { // 因为火狐浏览器不显示header,故在此轮询任务上检测全屏,显示videoHeader
                videoWrap.after(videoHeaderDom);
                _isFull = true;
            }

            isEnd();
        }

        // 监听函数,每个一秒更新
        function init() {
            interval = window.setInterval(update, 250);
        }

        init();

        /**
         * 拖拽进度条begin
         */
        timeDrag = false;
        $('.progressBar').mousedown(function (e) {
            timeDrag = true;
            updatebar(e.pageX);
        });
        $(document).mouseup(function (e) {
            if (timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });
        $(document).mousemove(function (e) {
            if (timeDrag) {
                updatebar(e.pageX);
            }
        });

        var updatebar = function (x) {
            var progress, maxduration, position, percentage;

            progress = $('.progressBar');
            maxduration = video.duration;
            if (progress.length > 0) {
                position = x - progress.offset().left;
                percentage = 100 * position / progress.width();
            } else {
                percentage = 100
            }

            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }

            $('.timeBar').css('width', percentage + '%');
            $('.timeBar span').css('margin-right', 20 * (percentage / 100 - 1));
            if (video.ended == false) {
                video.currentTime = maxduration * percentage / 100;
            }
        };

        /**
         * 播放速度begin
         */
            // 播放速度事件
        $('.play-rate-menu ul li').click(function () {
            var speed = $(this).text().split('x')[0];
            $(this).addClass('on').siblings().removeClass('on');
            // 设置播放速度
            video.playbackRate = speed;
            // 更新基准框里的text
            $(this).parents('.play-rate-menu').siblings('span').text(speed + 'x');
        });

        return startPause
    };
    module.exports = {
        //测试用,不要开
        //"Videojs": Videojs,
        "startPause": Videojs()
    };
});
