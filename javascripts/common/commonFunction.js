/**
 * Created by lilei on 14-2-17.
 */

(function ($) {

    $.extend({

        /*
         * 根据参数名获取参数
         * @name String 参数名
         */
        queryString: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.search);
            if (results == null) {
                return "";
            } else {
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        },

        /*
         * 根据URL地址后退
         * @URL String 需返回的后退URL地址
         */
        goBack: function (url) {
            if (url !== "" && typeof url !== "undefined") {
                var parameters = window.location.search;
                url = url + parameters;
                window.location.href = url;
            }
            else {
                window.history.back();
            }
        },

        /*
         * 回填文本框值
         * @objId String 回填对象
         * @queryStringName 回填参数值
         */
        fillInputValue: function (objId, queryStringName) {
            if (objId === "" || typeof objId === "undefined") {
                return false;
            }

            if (queryStringName === "" || typeof queryStringName === "undefined") {
                return false;
            }

            var self = $("#" + objId);
            var value = $.queryString(queryStringName);
            if (self.is('select')) {
                $(self).val(value)
            }
            if (self.attr("type") === "text") {
                $(self).val(value)
            }
        },

        /*
         * 根据URL跳转到前一页
         * @URL String 需返回的前一页URL地址
         * @urlParam json参数数据如：{parame1:"1",parame2:"2"}
         */
        goForward: function (url, urlParam) {
            if (typeof urlParam === "undefined" || urlParam === null) {
                urlParam = "";
            }

            var pageIndex = $("#_MvcPager_Ctrl0_pib").val();
            var positionY = $(document).scrollTop();
            $.extend(urlParam, { "py": positionY, "pageIndex": pageIndex });
            var strPara = $.param(urlParam);
            window.location.href = url + "&" + strPara;
        },

        /*
         * 渲染返回行需要表示的行
         * @lineObj object 行索引对象
         */
        animateLine: function (lineObj) {
            var py = $.queryString("py");
            py = parseFloat(py);
            var self = lineObj;
            if (typeof lineObj !== Object) {
                self = $("#" + lineObj);
            }
            // window.scrollTo(px, py);
            $("html,body").animate({ scrollTop: py }, 1);
            self.css("background", "#ccc");
        },
        // layer 加载层
        loading: function (msg) {
            if (!msg) {
                msg = '数据加载中...';
            }
            $.layer({
                time: 0, // 显示多久
                shade: [0.3, '#000', true],
                loading: {
                    type: 2,
                    msg: msg
                }, // loadGif 获取样式值,只能为0-3
                border: [10, 0.3, '#000', true],
                type: 3,
                title: ['', false],
                closeBtn: [0, false]
            });
        },
        // 关闭loding层
        loadClose: function () {
            layer.loadClose();
        },
        /*
         * 日期比较函数
         * @startDate String 起始日期
         * @endDate String 截止日期
         * @crossMonthNum int 表示不能跨月数（包含）1表示不能跨1个月，小于等于0或者其他都不做判断.
         * @keyWords String 关键字,重新拼接提示信息，默认"开始日期不能为空！"；例：查询:重新定义为"查询开始日期不能为空！".
         */
        compareDate: function (startDate, endDate, crossMonthNum, keyWords) {
            var start, // 起始时间
                end, // 截止日期
                yearNum, // 跨年数
                monthNum, // 跨月数
                strMonthNum, // 拼接语句,提示多少月
                crossMonthMsg, // 提示语句
                startYear, // 起始日期年份
                endYear, // 截止日期年份
                startMonth, // 起始日期月份
                endMonth, // 截止日期年份
                ReturnMsg = "", // 返回提示信息
                ReturnMonthMsg = ""; // 返回跨月提示信息

            if (startDate.replace(/(^\s*)|(\s*$)/g, "") === "") {
                crossMonthMsg = "开始日期不能为空！";
                if (keyWords !== "" && typeof keyWords !== "undefined") {
                    return ReturnMsg = keyWords + crossMonthMsg;
                }
                return crossMonthMsg;
            }
            if (endDate.replace(/(^\s*)|(\s*$)/g, "") === "") {
                crossMonthMsg = "结束日期不能为空！";
                if (keyWords !== "" && typeof keyWords !== "undefined") {
                    return ReturnMsg = keyWords + crossMonthMsg;
                }
                return crossMonthMsg;
            }

            start = new Date(Date.parse(startDate.replace(/-/g, "/")));
            end = new Date(Date.parse(endDate.replace(/-/g, "/")));
            if (end < start) {
                crossMonthMsg = "开始日期不能大于结束日期！";
                if (keyWords !== "" && typeof keyWords !== "undefined") {
                    return ReturnMsg = keyWords + crossMonthMsg;
                }
                return crossMonthMsg;
            }

            if (typeof crossMonthNum !== "number") {
                crossMonthNum = 0;
            }

            if (crossMonthNum !== "" && typeof keyWords !== "undefined") {
                crossMonthNum = parseInt(crossMonthNum, 10);
                strMonthNum = crossMonthNum === 1 ? "" : crossMonthNum + "个";
                crossMonthMsg = "查询时间不能跨" + strMonthNum + "月！";
                if (keyWords !== "" && typeof keyWords !== "undefined") {
                    ReturnMonthMsg = keyWords + "时间不能跨" + strMonthNum + "月！";
                } else {
                    ReturnMonthMsg = crossMonthMsg;
                }

                if (crossMonthNum < 12 && crossMonthNum > 0) {
                    yearNum = 0;
                    monthNum = crossMonthNum;
                }

                if (crossMonthNum >= 12) {
                    yearNum = Math.round(crossMonthNum / 12);
                    monthNum = Math.abs(crossMonthNum % 12);
                }

                startMonth = start.getMonth();
                endMonth = end.getMonth();
                startYear = start.getYear();
                endYear = end.getYear();
                /*
                 * yearNum 为0表示没有跨年按照跨月处理判断
                 *         为1表示跨年，按照跨年处理判断
                 */
                if (yearNum === 0) {
                    if (endYear - startYear === yearNum) {
                        if (endMonth - startMonth > monthNum - 1) {
                            return ReturnMonthMsg;
                        }
                    }
                    else if (endYear - startYear === yearNum + 1) {
                        if ((endMonth + 12) - startMonth > monthNum - 1) {
                            return ReturnMonthMsg;
                        }
                    }
                    else {
                        return ReturnMonthMsg;
                    }
                }
                else if (yearNum >= 1) {
                    if (endYear - startYear === yearNum) {
                        if (endMonth - startMonth > monthNum - 1) {
                            return ReturnMonthMsg;
                        }
                    } else if (endYear === startYear) {
                        return ReturnMsg;
                    } else {
                        return ReturnMonthMsg;
                    }
                }
            }

            return ReturnMsg;
        },

        /*
         * 表格checkbox选择函数
         * @cssColorOrTest String/int 颜色值和颜色名称/测试是否绑定事件需要测试传值1.
         */
        chooseCheckBoxPlug: function (cssColorOrTest) {
            var CheckBoxObj = {
                LayerJSPathErr: "",
                AddJSCSS: function (cssOption) {

                    for (var cssColorItem in cssOption) {
                        var cssColor = "<style type='text/css'>.LCCheckBoxBackColor{background-color: " + cssOption[cssColorItem] + ";}</style>";
                        $("head").append(cssColor);
                    }

                },
                FindTable: function () {
                    var $tableObjs = $("body").find("table");
                    var tableNum = 0;
                    for (var i = 0; i < $tableObjs.length; i++) {
                        var $this = $($tableObjs[i]);
                        if ($this.attr("class") !== undefined) {
                            if ($this.attr("class").indexOf("ChooseChkBoxPlug") >= 0) {
                                tableNum++;
                            }
                        }
                    }

                    return tableNum > 0 ? true : false;
                },
                AddEventListrer: function (tableObj) {
                    tableObj.find("tr").each(function () {
                        var $this = $(this);
                        if ($this.find("td:first").find("input[type='checkbox']").attr("checked") === "checked" || $this.find("td:first").find("input[type='radio']").attr("checked") === "checked") {
                            $this.find("td").addClass("LCCheckBoxBackColor");
                        }
                    })
                },
                Go: function (test) {
                    if (CheckBoxObj.FindTable()) {
                        var tableObj = $("table"),
                            tableObjTrue;

                        // 判断是否table第一个td中是否包含:checkbox
                        for (var i = 0; i < tableObj.length; i++) {
                            var $thisTable = tableObj[i],
                                trObj = $($thisTable).find("tr"),
                                checkBoxNum = 0;
                            if ($($thisTable).attr("class") !== undefined) {
                                if ($($thisTable).attr("class").indexOf("ChooseChkBoxPlug") >= 0) {
                                    for (var j = 0; j < trObj.length; j++) {
                                        var $this = $(trObj[j]);
                                        if ($this.find("td:first").find("input[type='checkbox']").length === 1 || $this.find("td:first").find("input[type='radio']").length === 1) {
                                            checkBoxNum++;
                                        }
                                    }
                                }
                            }

                            if (checkBoxNum > 0) {
                                tableObjTrue = $($thisTable);
                            }

                            if (tableObjTrue !== undefined) {
                                var trNum = 0;

                                if (test === 1) {
                                    try {
                                        layer.alert("事件绑定完毕,取消test传参正常使用吧!");
                                    }
                                    catch (ex) {
                                        if (CheckBoxObj.LayerJSPathErr === "") {
                                            CheckBoxObj.LayerJSPathErr = ex.message;
                                            console.log("ERR:" + ex.message);
                                            alert("事件绑定完毕,取消test传参正常使用吧!");
                                        }
                                    }
                                }

                                CheckBoxObj.AddEventListrer(tableObjTrue);

                                tableObjTrue.find("tr").each(function () {
                                    var $this = $(this);
                                    $this.css("cursor", "pointer");
                                    // 全选按钮功能实现
                                    if (trNum === 0) {
                                        $this.off("click").on("click", function (e) {
                                            if (e.target.nodeName.toUpperCase() === "TD" || e.target.nodeName.toUpperCase() === "TH") {
                                                if ($this.find("td:first").find("input[type='checkbox']").length > 0) {
                                                    if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                    } else {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                    }

                                                    $this.find("td:first").find("input[type='checkbox']").click();

                                                    // click时间过后修改正确即可
                                                    if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                    } else {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                    }
                                                } else if ($this.find("th:first").find("input[type='checkbox']").length > 0) {
                                                    if ($this.find("th:first").find("input[type='checkbox']")[0].checked) {
                                                        $this.find("th:first").find("input[type='checkbox']").attr("checked", false);
                                                    } else {
                                                        $this.find("th:first").find("input[type='checkbox']").attr("checked", true);
                                                    }

                                                    $this.find("th:first").find("input[type='checkbox']").click();

                                                    // click时间过后修改正确即可
                                                    if ($this.find("th:first").find("input[type='checkbox']")[0].checked) {
                                                        $this.find("th:first").find("input[type='checkbox']").attr("checked", false);
                                                    } else {
                                                        $this.find("th:first").find("input[type='checkbox']").attr("checked", true);
                                                    }
                                                }
                                            }
                                        });

                                        if ($this.find("td:first").find("input[type='checkbox']").length >= 1 || $this.find("th:first").find("input[type='checkbox']").length >= 1) {
                                            var allCheckBoxObj, NowTdOrTh = false;
                                            if ($this.find("td:first").find("input[type='checkbox']").length >= 1) {
                                                allCheckBoxObj = $this.find("td:first").find("input[type='checkbox']");
                                                NowTdOrTh = true;
                                            } else if ($this.find("th:first").find("input[type='checkbox']").length >= 1) {
                                                allCheckBoxObj = $this.find("th:first").find("input[type='checkbox']");
                                            }
                                            // 全选功能
                                            allCheckBoxObj.off("click").on("click", function () {
                                                var trObj = $(this).parents("table:first").find("tr");
                                                if (trObj.find("td").length > 0) {
                                                    if ($(this).attr("checked") === "checked") {
                                                        var num = 0;
                                                        trObj.each(function () {
                                                            if (NowTdOrTh) {
                                                                if (num !== 0) {
                                                                    if (trObj.find("td").length > 0) {
                                                                        if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
                                                                            $(this).find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                                            $(this).find("td").addClass("LCCheckBoxBackColor");
                                                                        }
                                                                    }
                                                                }
                                                                num++;
                                                            } else {
                                                                if (trObj.find("td").length > 0) {
                                                                    if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
                                                                        $(this).find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                                        $(this).find("td").addClass("LCCheckBoxBackColor");
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        var numNo = 0;
                                                        trObj.each(function () {
                                                            if (NowTdOrTh) {
                                                                if (numNo !== 0) {
                                                                    if (trObj.find("td").length > 0) {
                                                                        if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
                                                                            $(this).find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                                            $(this).find("td").removeClass("LCCheckBoxBackColor");
                                                                        }
                                                                    }
                                                                }
                                                                numNo++;
                                                            } else {
                                                                if (trObj.find("td").length > 0) {
                                                                    if ($(this).find("td:first").find("input[type='checkbox']").length > 0) {
                                                                        $(this).find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                                        $(this).find("td").removeClass("LCCheckBoxBackColor");
                                                                    }
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            });
                                        }
                                    }

                                    if (trNum >= 1) {
                                        $this.off("click").on("click", function (e) {
                                            if (e.target.nodeName.toUpperCase() === "TD" || e.target.nodeName.toUpperCase() === "DIV") {
                                                if ($this.find("td:first").find("input[type='checkbox']").length > 0) {
                                                    if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                    } else {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                    }

                                                    $this.find("td:first").find("input[type='checkbox']").click();

                                                    // click时间过后修改正确即可
                                                    if ($this.find("td:first").find("input[type='checkbox']")[0].checked) {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                    } else {
                                                        $this.find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                    }
                                                    var firstTr = $this.parents("table:first").find("tr:first");
                                                    if (firstTr.find("td").length > 0) {
                                                        var num = 0, checkTrueNum = 0;
                                                        checkBoxNum = 0;
                                                        $this.parents("table:first").find("tr").each(function () {
                                                            if (num != 0) {
                                                                if ($(this).find("td:first").find("input[type='checkbox']").length >= 1) {
                                                                    checkBoxNum++;
                                                                }
                                                                if ($(this).find("td:first").find("input[type='checkbox']:checked").length >= 1) {
                                                                    checkTrueNum++;
                                                                }
                                                            }
                                                            num++;
                                                        });

                                                        if (checkBoxNum === checkTrueNum) {
                                                            if (firstTr.find("td").length > 0) {
                                                                firstTr.find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                            } else {
                                                                firstTr.find("th:first").find("input[type='checkbox']").attr("checked", true);
                                                            }
                                                        }
                                                        else {
                                                            if (firstTr.find("td").length > 0) {
                                                                firstTr.find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                            } else {
                                                                firstTr.find("th:first").find("input[type='checkbox']").attr("checked", false);
                                                            }
                                                        }
                                                    } else if (firstTr.find("th").length > 0) {
                                                        if ($this.parents("table:first").find("tr").find("td:first").find("input[type='checkbox']").length === $this.parents("table:first").find("tr").find("td:first").find("input[type='checkbox']:checked").length) {
                                                            if (firstTr.find("td").length > 0) {
                                                                firstTr.find("td:first").find("input[type='checkbox']").attr("checked", true);
                                                            } else {
                                                                firstTr.find("th:first").find("input[type='checkbox']").attr("checked", true);
                                                            }
                                                        } else {
                                                            if (firstTr.find("td").length > 0) {
                                                                firstTr.find("td:first").find("input[type='checkbox']").attr("checked", false);
                                                            } else {
                                                                firstTr.find("th:first").find("input[type='checkbox']").attr("checked", false);
                                                            }
                                                        }
                                                    }

                                                } else if ($this.find("td:first").find("input[type='radio']").length > 0) {
                                                    $this.find("td:first").find("input[type='radio']").attr("checked", true);
                                                    $this.find("td:first").find("input[type='radio']").click();
                                                }
                                            } else if (e.target.type === "checkbox") {
                                                $this.find("td").toggleClass("LCCheckBoxBackColor");
                                            } else if (e.target.type === "radio") {
                                                $this.find("td").toggleClass("LCCheckBoxBackColor");
                                                $(e.target).parents("table:first").find("tr").each(function () {
                                                    if ($(this).find("td:first").find("input[type='radio']").attr("checked") === "checked") {
                                                        $(this).find("td").addClass("LCCheckBoxBackColor");
                                                    } else {
                                                        $(this).find("td").removeClass("LCCheckBoxBackColor");
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    trNum++;
                                });

                                tableObjTrue = undefined;
                            }
                        }
                    }
                }
            }, cssColorTmp, testTmp = 0;

            // 背景颜色设置
            if (cssColorOrTest !== "" && typeof cssColorOrTest !== "undefined") {
                if (cssColorOrTest === 1) {
                    testTmp = cssColorOrTest
                    cssColorTmp = {
                        background: "#BDD2FF"
                    };
                }
                else {
                    cssColorTmp = {
                        background: cssColorOrTest
                    };
                }
            } else {
                cssColorTmp = {
                    background: "#BDD2FF"
                };
            }

            CheckBoxObj.AddJSCSS(cssColorTmp);
            CheckBoxObj.Go(testTmp);
        },

        ////加载动画样式
        addAnimateCss:function(selector, styles){
            styles = styles.replace(/[,，]/g, " ");
            $(selector).addClass("animated "+styles);
        },
        ////移除动画样式
        removeAnimateCss:function(selector, styles){
            if($(selector).hasClass(styles)){
                $(selector).removeClass("animated " + styles);
            }
        }
    })

})(jQuery)

