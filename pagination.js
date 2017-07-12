(function ($, window, document, undefined) {

    var defaults = {
        totalData: 0, //数据总条数
        showData: 10, //每页显示的条数
        pageCount: 0, //总页数
        items: 10,//默认页码数量
        current: 1, //当前页数
        offsetNum: 4,
        prevCls: "previous", //上一页class
        nextCls: "next", //下一页class
        prevContent: "上一页", //上一页内容
        nextContent: "下一页", //下一页内容
        activeCls: "active", //当前页选中样式
        coping: false, //首页和尾页
        keepShowPN: true, //是否消除上一页and下一页
        callback: function () { }
    };

    var Pagination = function (element, options) {

        var opts = options,
            current,
            $container = $(element);

        this.setPageCount = function (page) {
            return opts.pageCount = page;
        };

        this.setTotalData = function (totalData) {
            return opts.totalData = totalData;
        };

        this.getPageCount = function () {
            return opts.pageCount > 0 ? opts.pageCount : Math.ceil(parseInt(opts.totalData || 0) / opts.showData || 0);
        };

        this.getCurrent = function () {
            return current || opts.current;
        };

        this.filling = function (pageIndex) {
            var html = "";
            current = pageIndex;
            var pageCount = this.getPageCount();
            if (pageCount > 1) {
                if (opts.keepShowPN) { //上一页
                    if (current === 1) {
                        html += '<li class="paginate_button disabled ' + opts.prevCls + '"><a href="javascript:void(0);">' + opts.prevContent + "</a></li>";
                    } else {
                        html += '<li class="paginate_button ' + opts.prevCls + '"><a href="javascript:void(0);">' + opts.prevContent + "</a></li>";
                    }
                } else {
                    $container.find("." + opts.prevCls) && $container.find("." + opts.prevCls).remove();
                }

                var end = 0;
                var start = 0;
                if (pageCount <= opts.items) {
                    end = pageCount;
                    start = 1;
                } else {

                    if (pageIndex + options.offsetNum <= options.items) {
                        end = options.items;
                    } else {
                        if (pageIndex + options.offsetNum >= pageCount) {
                            end = pageCount;
                        } else {
                            end = pageIndex + options.offsetNum;
                        }
                    }
                    start = (end - options.items + 1) > 0 ? (end - options.items + 1) : 1;
                }

                for (; start <= end; start++) {
                    if (start <= pageCount && start >= 1) {
                        if (start !== current) {
                            html += '<li class="paginate_button"><a href="javascript:void(0);" data-page="' + start + '">' + start + "</a></li>";
                        } else {
                            html += '<li class="paginate_button ' + opts.activeCls + '"><a href="javascript:void(0);">' + start + "</a></li>";
                        }
                    }
                }
                if (opts.keepShowPN || current < pageCount) { //下一页
                    if (current === pageCount) {
                        html += '<li class="paginate_button disabled ' + opts.nextCls + '"><a href="javascript:void(0);">' + opts.nextContent + "</a></li>";
                    } else {
                        html += '<li class="paginate_button ' + opts.nextCls + '"><a href="javascript:void(0);">' + opts.nextContent + "</a></li>";
                    }
                } else {
                    if (opts.keepShowPN === false) {
                        $container.find("." + opts.nextCls) && $container.find("." + opts.nextCls).remove();
                    }
                }
                $container.html(html).show();
            } else {
                $container.empty();
            }
        };

        //添加事件
        this.eventBind = function () {
            var that = this;
            var pageCount = that.getPageCount();
            var index = 1;
            $container.off().on("click",
                "li a",
                function () {
                    var $parent = $(this).parent();
                    if ($parent.hasClass(opts.nextCls)) {
                        if ($container.find("." + opts.activeCls).text() >= pageCount) {
                            $parent.addClass("disabled");
                            index = -1;
                        } else {
                            index = parseInt($container.find("." + opts.activeCls + " a").text()) + 1;
                        }
                    } else if ($parent.hasClass(opts.prevCls)) {
                        if ($container.find("." + opts.activeCls).text() <= 1) {
                            $parent.addClass("disabled");
                            index = -1;
                        } else {
                            index = parseInt($container.find("." + opts.activeCls + " a").text()) - 1;
                        }
                    } else {
                        if ($(this).hasClass('active')) {
                            index = -1;
                        } else {
                            index = parseInt($(this).data("page"));
                        }
                    }
                    if (index > 0)
                        that.filling(index);
                    typeof opts.callback === "function" && opts.callback(that);//处理回调，返回pagination对象
                    return false;
                });
        };

        this.init = function () {
            this.filling(this.getCurrent());
            this.eventBind();
            var pageCount = this.getPageCount();
            if (pageCount === 0) $container.hide();
        };
    };

    $.fn.pagination = function (params, callback) {
        if (typeof params == "function") {
            callback = params;
            params = {};
        } else {
            params = params || {};
            callback = callback || function () { };
        }
        var options = $.extend({}, defaults, params);
        options.callback = callback;   //回调保存
        return this.each(function () {
            var pagination = new Pagination(this, options);
            callback(pagination);
            pagination.init();
        });
    };

})(jQuery, window, document);
